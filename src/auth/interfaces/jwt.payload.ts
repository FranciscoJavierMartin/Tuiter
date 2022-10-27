export interface JwtPayload {
  userId: string;
  uId: string;
  email: string;
  username: string;
  avatarColor: string;
  profilePicture: string;
  iat: number;
  exp: number;
}
