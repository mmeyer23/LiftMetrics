export interface User {
  id: string;
  name: string;
  email: string;
}

export interface DecodedToken {
  userId: string;
  exp: number;
  iat: number;
}
