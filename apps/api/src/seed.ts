import { PrismaClient } from "@prisma/client"
import * as bcrypt from "bcrypt"

const prisma = new PrismaClient()

const main = async () => {
  const passwordHash = await bcrypt.hash("Admin1234!", 12)
  await prisma.user.upsert({
    where: { email: "admin@bmdb.local" },
    update: {},
    create: {
      email: "admin@bmdb.local",
      passwordHash,
      firstName: "Admin",
      lastName: "User",
      role: "ADMIN",
      isVerified: true,
    },
  })
  const genres = ["Action", "Drama", "Comedy", "Sci-Fi", "Thriller"]
  for (const name of genres) {
    await prisma.genre.upsert({
      where: { name },
      update: {},
      create: { name },
    })
  }
  console.log("Seed done")
}

main()
  .finally(() => prisma.$disconnect())
