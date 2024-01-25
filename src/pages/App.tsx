import React from 'react';
import '../styles/App.scss';
import { loginUser, selectAuth, setEmail, setPassword } from '../slices/AuthSlice';
import { useAppDispatch, useAppSelector } from '../Hooks';
import { isEmailValid } from '../utils/emailValidation';

function App() {
  const dispatch = useAppDispatch();
  const email = useAppSelector(selectAuth).email;
  const password = useAppSelector(selectAuth).password;
  const loading = useAppSelector(selectAuth).loading;
  const errorMessage = useAppSelector(selectAuth).errorMessage;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email && isEmailValid(email) && password) {
      try {
        const resultAction = dispatch(loginUser({ email, password }));
        console.log('Login bem-sucedido. Token:', (await resultAction).payload);
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
          {errorMessage && <div>{errorMessage}</div>}
          {loading && <div>Loading...</div>}
          
          <button type="submit" disabled={!isEmailValid(email || '') || !password}>
            Send
          </button>
        </div>
      </form>
    </main>
  );
}

export default App;
