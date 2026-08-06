import { Module } from '@nestjs/common';
import { TableResolver } from './table.resolver';
import { TableService } from './table.service';
import { TableRepository } from './table.repository';
import { PrismaModule } from '../prisma/prisma.module'; // omit if PrismaService is global

@Module({
  imports: [PrismaModule],
  providers: [TableResolver, TableService, TableRepository],
  exports: [TableService],
})
export class TableModule {}