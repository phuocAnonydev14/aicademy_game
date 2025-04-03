export type AuthOK = {
  claims: Record<string, any>;
  jwt: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  email_verified_at: string;
  created_at: string;
  updated_at: string;
};

export type UserOther = Pick<User, "id" | "name">;
