package com.app.wydatki.repository;

import com.app.wydatki.dto.fiilter.TransactionFilterDTO;
import com.app.wydatki.model.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    Optional<Transaction> findByIdAndUserEmail(Long transactionId, String userEmail);

    List<Transaction> findByUserEmail(String userEmail);

    List<Transaction> findByUserEmailAndDateBetween(String userEmail, LocalDate startDate, LocalDate endDate);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user.email = :userEmail AND t.date BETWEEN :startDate AND :endDate")
    BigDecimal sumTransactions(@Param("userEmail") String userEmail, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    List<Transaction> findByUserEmailAndDateBetweenOrderByDateDesc(String userEmail, LocalDate startDate, LocalDate endDate);

    @Query("SELECT t FROM Transaction t WHERE t.user.email = :userEmail " +
            "AND t.date BETWEEN :startDate AND :endDate " +
            "AND (:category IS NULL OR t.category = :category) " +
            "AND (:minAmount IS NULL OR t.amount >= :minAmount) " +
            "AND (:maxAmount IS NULL OR t.amount <= :maxAmount) " +
            "AND (:type IS NULL OR t.type = :type)")
    List<Transaction> findFilteredTransactions(@Param("userEmail") String userEmail,
                                               @Param("startDate") LocalDate startDate,
                                               @Param("endDate") LocalDate endDate,
                                               @Param("category") String category,
                                               @Param("minAmount") BigDecimal minAmount,
                                               @Param("maxAmount") BigDecimal maxAmount,
                                               @Param("type") String type);

    default List<Transaction> findFilteredTransactionsByDTO(String userEmail, TransactionFilterDTO filterDTO) {
        return findFilteredTransactions(
                userEmail,
                filterDTO.getStartDate(),
                filterDTO.getEndDate(),
                filterDTO.getCategory(),
                filterDTO.getMinAmount(),
                filterDTO.getMaxAmount(),
                filterDTO.getType()
        );
    }

    @Query("SELECT t FROM Transaction t WHERE t.user.email = :userEmail AND t.date = :date")
    List<Transaction> findTransactionsByDate(@Param("userEmail") String userEmail, @Param("date") LocalDate date);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user.email = :userEmail AND t.date = :date")
    BigDecimal sumTransactionsByDay(@Param("userEmail") String userEmail, @Param("date") LocalDate date);

    @Query("SELECT FUNCTION('MONTH', t.date) AS month, COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user.email = :userEmail AND t.date BETWEEN :startDate AND :endDate GROUP BY FUNCTION('MONTH', t.date)")
    List<Object[]> getMonthlyTransactionsSummary(@Param("userEmail") String userEmail,
                                                 @Param("startDate") LocalDate startDate,
                                                 @Param("endDate") LocalDate endDate);

    @Query("SELECT t FROM Transaction t WHERE t.user.email = :userEmail AND t.date BETWEEN :startDate AND :endDate AND (:excludedCategory IS NULL OR t.category != :excludedCategory)")
    List<Transaction> findTransactionsExcludingCategory(@Param("userEmail") String userEmail,
                                                        @Param("startDate") LocalDate startDate,
                                                        @Param("endDate") LocalDate endDate,
                                                        @Param("excludedCategory") String excludedCategory);
    
    /**
     * Pobiera paginowaną listę transakcji z filtrowaniem i wyszukiwaniem
     */
    @Query("SELECT t FROM Transaction t WHERE t.user.email = :userEmail " +
            "AND (:startDate IS NULL OR t.date >= :startDate) " +
            "AND (:endDate IS NULL OR t.date <= :endDate) " +
            "AND (:category IS NULL OR t.category = :category) " +
            "AND (:type IS NULL OR t.type = :type) " +
            "AND (:searchTerm IS NULL OR LOWER(t.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(t.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
            "AND (:minAmount IS NULL OR t.amount >= :minAmount) " +
            "AND (:maxAmount IS NULL OR t.amount <= :maxAmount)")
    Page<Transaction> findPaginatedTransactions(
            @Param("userEmail") String userEmail,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("category") String category,
            @Param("type") String type,
            @Param("searchTerm") String searchTerm,
            @Param("minAmount") BigDecimal minAmount,
            @Param("maxAmount") BigDecimal maxAmount,
            Pageable pageable);
}
