import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { IAuthState } from '../interface/IAuthState';
import { RootState } from '../store';

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

export const fetchUserData = createAsyncThunk(
  'auth/fetchUserData',
  async (token: string, thunkAPI) => {
    try {
      thunkAPI.dispatch(setLoadingUser({ loading: true }));

      const response = await fetch('https://sigmabackend.onrender.com/user', {
        method: 'GET',
        headers: {
          'Authorization': token,
        },
      });

      if (!response.ok) {
        throw new Error('Erro na requisição');
      }

      const userData: { user: { firstname: string | null; lastname: string | null; email: string | null; }; permissions: string[] } = await response.json();

      thunkAPI.dispatch(setUserData({ userData }));

      return userData;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message);
      } else {
        return thunkAPI.rejectWithValue('Erro desconhecido');
      }
    } finally {
      thunkAPI.dispatch(setLoadingUser({ loading: false }));
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (token: string, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState;

      const { editUser } = state.auth;

      const response = await fetch('https://sigmabackend.onrender.com/user', {
        method: 'PUT',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: editUser.user }),
      });

      if (!response.ok) {
        throw new Error('Erro na requisição');
      }

      const updatedUserData: { user: { firstname: string | null; lastname: string | null; email: string | null; }; permissions: string[] } = await response.json();

      thunkAPI.dispatch(setUserData({ userData: updatedUserData }));

      return updatedUserData;
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
  loadingUser: false,
  errorNumber: 0,
  errorMessage: '',
  userData: {
    user: {
      firstname: null,
      lastname: null,
      email: null
    },
    permissions: []
  },
  editUser: {
    user: {
      firstname: '',
      lastname: '',
      email: ''
    }
  }
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
    setLoadingUser: (state, action: PayloadAction<{ loading: boolean }>) => {
      state.loadingUser = action.payload.loading;
    },
    setError: (state, action: PayloadAction<{ errorNumber: number; errorMessage: string }>) => {
      state.errorNumber = action.payload.errorNumber;
      state.errorMessage = action.payload.errorMessage;
    },
    setToken: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
    },
    setUserData: (state, action: PayloadAction<{ userData: { user: { firstname: string | null; lastname: string | null; email: string | null; }; permissions: string[] } }>) => {
      state.userData = action.payload.userData;
    },
    setEditUser: (state, action: PayloadAction<{ editUser: { user: { firstname: string | ''; lastname: string | ''; email: string | ''; } } }>) => {
      state.editUser = action.payload.editUser;
    }
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
export const { setEmail, setPassword, setLoading, setLoadingUser, setError, setToken, setUserData, setEditUser } = authSlice.actions;
export const selectAuth = (state: { auth: IAuthState }) => state.auth;
