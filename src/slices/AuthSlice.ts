import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { IAuthState } from '../interface/IAuthState';

interface ApiResponse {
  token: string;
  id: string;
}

export const loginUser = createAsyncThunk<string, { email: string; password: string }>(
  'auth/loginUser',
  async (credentials, thunkAPI) => {
    try {
      const response = await fetch('https://sigmabackend.onrender.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Erro na requisição');
      }

      const data: ApiResponse = await response.json();
      return data.token;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message);
      } else {
        return thunkAPI.rejectWithValue('Erro desconhecido');
      }
    }
  }
);

const initialState: IAuthState = {
  email: null,
  password: null,
  token: null,
  loading: false,
  errorNumber: 0,
  errorMessage: '',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<{ email: string }>) => {
      state.email = action.payload.email;
    },
    setPassword: (state, action: PayloadAction<{ password: string }>) => {
      state.password = action.payload.password;
    },
    setLoading: (state, action: PayloadAction<{ loading: boolean }>) => {
      state.loading = action.payload.loading;
    },
    setError: (state, action: PayloadAction<{ errorNumber: number; errorMessage: string }>) => {
      state.errorNumber = action.payload.errorNumber;
      state.errorMessage = action.payload.errorMessage;
    },
    setToken: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.token = action.payload;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      if (action.payload instanceof Error) {
        state.errorMessage = action.payload.message;
      } else {
        state.errorMessage = 'Unable to get your data';
      }
    });
  },
});

export default authSlice.reducer;
export const { setEmail, setPassword, setLoading, setError, setToken } = authSlice.actions;
export const selectAuth = (state: { auth: IAuthState }) => state.auth;
