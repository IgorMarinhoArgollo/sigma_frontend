export interface IAuthState {
  email: string | null;
  password: string | null;
  token: string | null;
  loading: boolean;
  errorNumber: number;
  errorMessage: string;
}