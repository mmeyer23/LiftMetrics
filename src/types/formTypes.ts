export interface RegisterFormState {
  errors?: {
    email?: string;
    password?: string;
    form?: string;
  };
}

export interface RegistrationResponse {
  success?: boolean;
  errors?: {
    email?: string;
    password?: string;
    form?: string;
  };
}


export type RegisterAction = (
  prevState: RegisterFormState,
  formData: FormData
) => Promise<RegistrationResponse>;

export interface LoginFormState {
    success: boolean;
    message: string;
    errors: {
      email?: string;
      password?: string;
      form?: string;
    };
  }

  export interface LoginFormData {
    email: string;
    password: string;
  }

  export interface ServerFormData {
    email: string | null;
    password: string | null;
  }
