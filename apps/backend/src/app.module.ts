import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from './database/database.module'
import { HealthModule } from './modules/health/health.module'
import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'
import { MedicationsModule } from './modules/medications/medications.module'
import { NotificationsModule } from './modules/notifications/notifications.module'
import { PrescriptionOcrModule } from './modules/prescription-ocr/prescription-ocr.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
    DatabaseModule,
    HealthModule,
    AuthModule,
    UsersModule,
    MedicationsModule,
    NotificationsModule,
    PrescriptionOcrModule,
  ],
})
export class AppModule {}

