import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('health')
export class HealthController {
  constructor(private readonly configService: ConfigService) {}

  @Get()
  public health(): string {
    return `Health: Server instance is healthy with process id ${
      process.pid
    } on ${this.getCurrentDate()}`;
  }

  @Get('env')
  public env(): string {
    return `This is the ${process.env.NODE_ENV} environment.`;
  }

  @Get('instance')
  public async instance(): Promise<string> {
    const response = await fetch(this.configService.get('EC2_URL'));
    const data = await response.json();

    return `Server is running on EC2 instance with id ${data} and process id ${
      process.pid
    } on ${this.getCurrentDate()}`;
  }

  private getCurrentDate(): string {
    return new Date().toLocaleDateString(undefined, {
      day: '2-digit',
      weekday: 'short',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }
}
