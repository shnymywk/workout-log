export type LoginActionState = {
  error: string | null;
};

export type SignUpActionState = {
  error: string | null;
  success: string | null;
};

export type GuestLoginActionState = {
  error: string | null;
};

export const initialLoginActionState: LoginActionState = {
  error: null
};

export const initialSignUpActionState: SignUpActionState = {
  error: null,
  success: null
};

export const initialGuestLoginActionState: GuestLoginActionState = {
  error: null
};
