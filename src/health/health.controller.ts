import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  public async health(): Promise<string> {
    return `Health: Server instance is healthy with process id ${
      process.pid
    } on ${new Date().toLocaleDateString(undefined, {
      day: '2-digit',
      weekday: 'short',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })}`;
  }

  @Get('env')
  public async env(): Promise<string> {
    return `This is the ${process.env.NODE_ENV} environment.`;
  }
}
