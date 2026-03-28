import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common"
import { PrismaClient } from "@prisma/client"

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  onModuleInit = async () => {
    await this.$connect()
  }

  onModuleDestroy = async () => {
    await this.$disconnect()
  }
}
