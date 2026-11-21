import { Test, type TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller.js';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();
    appController = app.get(AppController);
  });

  it('reports health', () => {
    expect(appController.health()).toMatchObject({ status: 'ok' });
  });
});
