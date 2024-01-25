export interface IAuthState {
  email: string | null;
  password: string | null;
  token: string | null;
  loading: boolean;
  loadingUser: boolean;
  errorNumber: number;
  errorMessage: string;
  userData: {
    user: {
      firstname: string | null;
      lastname: string | null;
      email: string | null;
    },
    permissions: string[]
  }
  editUser: {
    user: {
      firstname: string | '';
      lastname: string | '';
      email: string | '';
    }
  }
}