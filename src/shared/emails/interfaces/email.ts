export interface MailForgotPasswordData {
  receiverEmail: string;
  token: string;
  username: string;
}

export interface MailResetPasswordData {
  receiverEmail: string;
  username: string;
  ipaddress: string;
  date: string;
}
