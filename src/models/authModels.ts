export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    metadata: object;
  };
  expiresAt: string;
}