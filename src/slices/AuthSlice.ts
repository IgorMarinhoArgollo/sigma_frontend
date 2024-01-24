import { createSlice, PayloadAction, ThunkAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import axios, { AxiosResponse } from 'axios';

interface AuthState {
  email: string | null;
  password: string | null;
  token: string | null;
}

const initialState: AuthState = {
  email: null,
  password: null,
  token: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    setApiResponse: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
  },
});

export const { setEmail, setPassword, setApiResponse } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;

interface ApiResponse {
  token: string,
  id: string
}

export const sendRequest = (): ThunkAction<void, RootState, unknown, PayloadAction<ApiResponse>> => async (
  dispatch,
  getState
) => {
  try {
    const { email, password } = getState().auth;
    const response: AxiosResponse<ApiResponse> = await axios.post('https://sigmabackend.onrender.com', { email, password });

    dispatch({ type: 'auth/setApiResponse', payload: response.data });
  } catch (error) {
    console.error('Erro na requisição:', error);
  }
};




export default authSlice.reducer;
