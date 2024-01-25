import React from 'react';
import '../styles/App.scss';
import { loginUser, selectAuth, setEmail, setPassword, fetchUserData, setError } from '../slices/AuthSlice';
import { useAppDispatch, useAppSelector } from '../Hooks';
import { isEmailValid } from '../utils/emailValidation';
import { useNavigate } from 'react-router-dom';

function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const email = useAppSelector(selectAuth).email;
  const password = useAppSelector(selectAuth).password;
  const loading = useAppSelector(selectAuth).loading;
  const loadingUser = useAppSelector(selectAuth).loadingUser;
  const errorMessage = useAppSelector(selectAuth).errorMessage;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (errorMessage !== "") {
      dispatch(setError({ errorNumber: 0, errorMessage: '' }));
    }
    if (email && isEmailValid(email) && password) {
      try {
        const resultAction = await dispatch(loginUser({ email, password }));
        const token = resultAction.payload; 


        await dispatch(fetchUserData(token as string));

        console.log('Login bem-sucedido. Token:', token);
        navigate('/details');
      } catch (error) {
        console.error('Erro ao fazer login:', error);
      }
    }
  };

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <div className="logo">
          <div className="vertical"></div>
          <div className="horizontal"></div>
        </div>

        <div className="inputs">
          <label htmlFor="email">
            Email:
            <input
              type="email"
              value={email || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                dispatch(setEmail({ email: e.target.value }));
              }}
            />
          </label>

          <label htmlFor="password">
            Password:
            <input
              type="password"
              value={password || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                dispatch(setPassword({ password: e.target.value }));
              }}
            />
          </label>
          {errorMessage && <div className='error'>{errorMessage}</div>}
          {loading && <div className='loading'>Loading...</div>}
          {loadingUser && <div className='loading'>Only a bit more...</div>}

          <button type="submit" disabled={!isEmailValid(email || '') || !password}>
            Send
          </button>
        </div>
      </form>
    </main>
  );
}

export default App;
