import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setEmail, setPassword, sendRequest, selectAuth } from '../slices/AuthSlice';
import { isEmailValid } from '../utils/emailValidation';
import '../styles/App.scss';
import { AppDispatch } from '../store';



function App() {

  const dispatch: AppDispatch = useDispatch();
  const auth = useSelector(selectAuth);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setEmail(e.target.value));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setPassword(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (auth.email && isEmailValid(auth.email) && auth.password) {
      dispatch(sendRequest());
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
              value={auth.email || ''}
              onChange={handleEmailChange}
            />
          </label>

          <label htmlFor="password">
            Password:
            <input
              type="password"
              value={auth.password || ''}
              onChange={handlePasswordChange}
            />
          </label>

          <button type="submit" disabled={!isEmailValid(auth.email || '') || !auth.password}>
            Send
          </button>
        </div>
      </form>
    </main>
  );
}

export default App;
