export interface JwtPayload {
  userId: string;
  uId: string;
  email: string;
  username: string;
  avatarColor: string;
  iat: number;
  exp: number;
}
