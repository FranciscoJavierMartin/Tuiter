export interface MailForgotPasswordData {
  receiverEmail: string;
  token: string;
  username: string;
}

export interface MailResetPasswordData {
  receiverEmail: string;
  subject: string;
  username: string;
  ipaddress: string;
  date: string;
}

export interface MailNotificationData {
  receiverEmail: string;
  subject: string;
  username: string;
  message: string;
  header: string;
}
