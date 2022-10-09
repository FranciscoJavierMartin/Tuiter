export interface MailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

export interface MailWorkerData {
  receiverEmail: string;
  subject: string;
  username: string;
}
