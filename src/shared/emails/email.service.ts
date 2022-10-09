import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  // constructor() {}

  public async sendEmail(
    receiverEmail: string,
    subject: string,
    body: string,
  ): Promise<void> {
    console.log(process.env.NODE_ENV);
  }
}
