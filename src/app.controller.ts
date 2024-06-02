import { Controller, Get } from '@nestjs/common';
// import { AppService } from './app.service';
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@Controller()
export class AppController {
  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly typeOrmHealthIndicator: TypeOrmHealthIndicator,
    private memoryHealthIndicator: MemoryHealthIndicator,
    private diskHealthIndicator: DiskHealthIndicator,
  ) {}
  // 메모리, 디스크 데이터베이스 연결 부분 체크

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  @Get()
  @HealthCheck()
  async getAPIServerHealthCheck(): Promise<HealthCheckResult> {
    return await this.healthCheckService.check([
      () => this.typeOrmHealthIndicator.pingCheck('database'),
      () =>
        this.memoryHealthIndicator.checkHeap('memory heap', 300 * 1024 * 1024),
      // The process should not have more than 300MB RSS memory allocated
      () =>
        this.memoryHealthIndicator.checkRSS('memory RSS', 300 * 1024 * 1024),
      // the used disk storage should not exceed the 50% of the available space
      () =>
        this.diskHealthIndicator.checkStorage('disk health', {
          thresholdPercent: 0.8,
          path: '/',
        }),
    ]);
  }
}
