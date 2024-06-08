import { DocumentBuilder } from '@nestjs/swagger';

export class BaseAPIDoc {
  public builder = new DocumentBuilder();

  public initializeOptions() {
    return this.builder
      .setTitle('Sangwon AWS')
      .setDescription('Sangwon AWS API Document')
      .setVersion('1.0')
      .build();
  }
}
