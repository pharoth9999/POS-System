import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import configuration from './config/configuration.js';
import { envValidationSchema } from './config/env.validation.js';
import { DatabaseModule } from './database/database.module.js';
import { CategoriesModule } from './modules/categories/categories.module.js';
import { DebtsModule } from './modules/debts/debts.module.js';
import { LocationsModule } from './modules/locations/locations.module.js';
import { MembersModule } from './modules/members/members.module.js';
import { ProductsModule } from './modules/products/products.module.js';
import { ReportsModule } from './modules/reports/reports.module.js';
import { SalesModule } from './modules/sales/sales.module.js';
import { SettingsModule } from './modules/settings/settings.module.js';
import { StockModule } from './modules/stock/stock.module.js';
import { TelegramModule } from './modules/telegram/telegram.module.js';
import { TransfersModule } from './modules/transfers/transfers.module.js';
import { UnitsModule } from './modules/units/units.module.js';
import { UsersModule } from './modules/users/users.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
      // Joi 18 implements Standard Schema, which @nestjs/config v12 expects.
      validationSchema: envValidationSchema,
    }),
    DatabaseModule,

    UsersModule,
    ProductsModule,
    CategoriesModule,
    UnitsModule,
    LocationsModule,
    StockModule,
    TransfersModule,
    SalesModule,
    MembersModule,
    DebtsModule,
    SettingsModule,
    TelegramModule,
    ReportsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
