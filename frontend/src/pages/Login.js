import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaSignInAlt, FaSpinner, FaCheck, FaRedo } from 'react-icons/fa';
import { authService } from '../utils/api';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: var(--light-grey);
  padding: 2rem;
`;

const LoginCard = styled.div`
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  width: 100%;
  max-width: 450px;
  padding: 2.5rem;
  
  @media (max-width: 576px) {
    padding: 1.5rem;
  }
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
  
  h1 {
    font-size: 2.5rem;
    color: var(--primary-color);
    margin-bottom: 0.5rem;
  }
  
  p {
    color: var(--dark-color);
    opacity: 0.7;
  }
`;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  color: var(--dark-color);
  margin-bottom: 1.5rem;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  position: relative;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid var(--grey-color);
  border-radius: var(--border-radius);
  overflow: hidden;
  transition: border-color 0.3s ease;
  
  &:focus-within {
    border-color: var(--primary-color);
  }
`;

const InputIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
  color: var(--dark-color);
  opacity: 0.5;
`;

const Input = styled.input`
  flex: 1;
  padding: 1rem;
  border: none;
  font-size: 1rem;
  
  &:focus {
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  &:disabled {
    background-color: var(--grey-color);
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background-color: var(--danger-light);
  color: var(--danger-color);
  padding: 0.8rem;
  border-radius: var(--border-radius);
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
`;

const InfoMessage = styled.div`
  background-color: var(--info-light);
  color: var(--info-color);
  padding: 0.8rem;
  border-radius: var(--border-radius);
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
`;

const SuccessMessage = styled.div`
  background-color: var(--success-light);
  color: var(--success-color);
  padding: 0.8rem;
  border-radius: var(--border-radius);
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
`;

const ResendCodeLink = styled.button`
  background: none;
  border: none;
  color: var(--primary-color);
  padding: 0;
  font-size: 0.9rem;
  cursor: pointer;
  margin-top: 1rem;
  text-decoration: underline;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: var(--primary-dark);
  }
`;

const VerificationCodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const VerificationCodeDescription = styled.p`
  font-size: 0.9rem;
  color: var(--dark-color);
  opacity: 0.8;
`;

const VerificationCodeInput = styled.input`
  border: 1px solid var(--grey-color);
  border-radius: var(--border-radius);
  padding: 1rem;
  font-size: 1.5rem;
  text-align: center;
  letter-spacing: 0.5rem;
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`;

const LoadingSpinner = styled(FaSpinner)`
  animation: spin 1s linear infinite;
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email || !password) {
      setError('Proszę wypełnić wszystkie pola.');
      return;
    }
    
    try {
      setLoading(true);
      
      console.log('Próba logowania z danymi:', { email, password });
      
      const response = await authService.login({
        email,
        password
      });
      
      console.log('Odpowiedź z serwera:', response);
      
      // Token jest już zapisany w localStorage przez authService.login
      
      setSuccess('Logowanie zakończone sukcesem!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      console.error('Szczegóły błędu:', err.response?.data || err);
      setError(err.response?.data?.message || 'Nieprawidłowe dane logowania lub problem z serwerem.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <LoginContainer>
      <LoginCard>
        <Logo>
          <h1>Wydatki</h1>
          <p>Zaloguj się do swojego konta</p>
        </Logo>
        
        <FormTitle>Logowanie</FormTitle>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
        
        <form onSubmit={handleLogin}>
          <FormGroup>
            <InputGroup>
              <InputIcon>
                <FaEnvelope />
              </InputIcon>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </InputGroup>
          </FormGroup>
          
          <FormGroup>
            <InputGroup>
              <InputIcon>
                <FaLock />
              </InputIcon>
              <Input
                type="password"
                placeholder="Hasło"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </InputGroup>
          </FormGroup>
          
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <LoadingSpinner />
                Logowanie...
              </>
            ) : (
              <>
                <FaSignInAlt />
                Zaloguj się
              </>
            )}
          </Button>
        </form>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login; 