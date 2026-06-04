export type LoginActionState = {
  error: string | null;
};

export type SignUpActionState = {
  error: string | null;
  success: string | null;
};

export const initialLoginActionState: LoginActionState = {
  error: null
};

export const initialSignUpActionState: SignUpActionState = {
  error: null,
  success: null
};
