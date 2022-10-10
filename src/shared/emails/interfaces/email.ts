export interface MailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

export interface MailWorkerData {
  receiverEmail: string;
  token: string;
  username: string;
}
