import { PrismaClient } from "@prisma/client"
import * as bcrypt from "bcrypt"

const prisma = new PrismaClient()

type MovieData = {
  title: string
  description: string
  releaseYear: number
  posterUrl: string
  directorNames: [string, string][]
  actorNames: [string, string][]
  genreNames: string[]
}

const DIRECTORS: [string, string][] = [
  ["Christopher", "Nolan"],
  ["Denis", "Villeneuve"],
  ["Martin", "Scorsese"],
  ["Quentin", "Tarantino"],
  ["David", "Fincher"],
]

const ACTORS: [string, string][] = [
  ["Leonardo", "DiCaprio"],
  ["Brad", "Pitt"],
  ["Cillian", "Murphy"],
  ["Timothée", "Chalamet"],
  ["Zendaya", ""],
  ["Margot", "Robbie"],
  ["Natalie", "Portman"],
  ["Tom", "Hanks"],
  ["Christian", "Bale"],
  ["Matt", "Damon"],
]

const MOVIES: MovieData[] = [
  {
    title: "Inception",
    description:
      "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    releaseYear: 2010,
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_FTa.jpg",
    directorNames: [["Christopher", "Nolan"]],
    actorNames: [
      ["Leonardo", "DiCaprio"],
      ["Christian", "Bale"],
    ],
    genreNames: ["Sci-Fi", "Action"],
  },
  {
    title: "Interstellar",
    description:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    releaseYear: 2014,
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
    directorNames: [["Christopher", "Nolan"]],
    actorNames: [["Matt", "Damon"]],
    genreNames: ["Sci-Fi"],
  },
  {
    title: "Dune",
    description:
      "Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding, must travel to the most dangerous planet in the universe to ensure the future of his family and his people.",
    releaseYear: 2021,
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BN2FjNmEyNWMtYzM0ZS00NjIyLTg5YzYtYThlMGVjNzE1OGViXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
    directorNames: [["Denis", "Villeneuve"]],
    actorNames: [
      ["Timothée", "Chalamet"],
      ["Zendaya", ""],
    ],
    genreNames: ["Sci-Fi"],
  },
  {
    title: "The Dark Knight",
    description:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    releaseYear: 2008,
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
    directorNames: [["Christopher", "Nolan"]],
    actorNames: [["Christian", "Bale"]],
    genreNames: ["Action", "Drama"],
  },
  {
    title: "Pulp Fiction",
    description:
      "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.",
    releaseYear: 1994,
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
    directorNames: [["Quentin", "Tarantino"]],
    actorNames: [["Brad", "Pitt"]],
    genreNames: ["Drama", "Thriller"],
  },
  {
    title: "Fight Club",
    description:
      "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.",
    releaseYear: 1999,
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BMmEzNTkxYjQtZTc0MC00YTVjLTg5ZTEtZWMwOWVlYzY0NWIwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
    directorNames: [["David", "Fincher"]],
    actorNames: [["Brad", "Pitt"]],
    genreNames: ["Drama", "Thriller"],
  },
  {
    title: "Oppenheimer",
    description:
      "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.",
    releaseYear: 2023,
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_.jpg",
    directorNames: [["Christopher", "Nolan"]],
    actorNames: [["Cillian", "Murphy"]],
    genreNames: ["Drama"],
  },
  {
    title: "The Wolf of Wall Street",
    description:
      "Based on the true story of Jordan Belfort, from his rise to a wealthy stock-broker living the high life to his fall involving crime, corruption and the federal government.",
    releaseYear: 2013,
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BMjIxMjgxNTk0MF5BMl5BanBnXkFtZTgwNjIyOTg2MDE@._V1_.jpg",
    directorNames: [["Martin", "Scorsese"]],
    actorNames: [
      ["Leonardo", "DiCaprio"],
      ["Margot", "Robbie"],
    ],
    genreNames: ["Drama", "Comedy"],
  },
  {
    title: "Black Swan",
    description:
      "A committed dancer wins the lead role in a production of Tchaikovsky's Swan Lake only to find herself struggling to maintain her sanity.",
    releaseYear: 2010,
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BNzY2NzI4OTE5MF5BMl5BanBnXkFtZTcwMjMyNDY4Mw@@._V1_.jpg",
    directorNames: [],
    actorNames: [["Natalie", "Portman"]],
    genreNames: ["Drama", "Thriller"],
  },
  {
    title: "Cast Away",
    description:
      "A FedEx executive undergoes a physical and emotional transformation after crash landing on a deserted island.",
    releaseYear: 2000,
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BYTI2Mzg1ZWUtYmI0Zi00ZDIzLWIzZjEtZGE3ZWZlYTQ3YmM1XkEyXkFqcGc@._V1_.jpg",
    directorNames: [],
    actorNames: [["Tom", "Hanks"]],
    genreNames: ["Drama"],
  },
]

const findOrCreateDirector = async (firstName: string, lastName: string) => {
  const existing = await prisma.director.findFirst({
    where: { firstName, lastName },
  })
  if (existing) return existing
  return prisma.director.create({ data: { firstName, lastName } })
}

const findOrCreateActor = async (firstName: string, lastName: string) => {
  const existing = await prisma.actor.findFirst({
    where: { firstName, lastName },
  })
  if (existing) return existing
  return prisma.actor.create({ data: { firstName, lastName } })
}

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
  const genreNames = ["Action", "Drama", "Comedy", "Sci-Fi", "Thriller"]
  for (const name of genreNames) {
    await prisma.genre.upsert({
      where: { name },
      update: {},
      create: { name },
    })
  }

  for (const [firstName, lastName] of DIRECTORS) {
    await findOrCreateDirector(firstName, lastName)
  }

  for (const [firstName, lastName] of ACTORS) {
    await findOrCreateActor(firstName, lastName)
  }

  let movieCount = 0
  for (const m of MOVIES) {
    const exists = await prisma.movie.findFirst({ where: { title: m.title } })
    if (exists) continue

    const genreRecords = await Promise.all(
      m.genreNames.map((name) => prisma.genre.findFirstOrThrow({ where: { name } })),
    )
    const actorRecords = await Promise.all(
      m.actorNames.map(([fn, ln]) =>
        prisma.actor.findFirstOrThrow({ where: { firstName: fn, lastName: ln } }),
      ),
    )
    const directorRecords = await Promise.all(
      m.directorNames.map(([fn, ln]) =>
        prisma.director.findFirstOrThrow({ where: { firstName: fn, lastName: ln } }),
      ),
    )

    await prisma.$transaction(async (tx) => {
      const movie = await tx.movie.create({
        data: {
          title: m.title,
          description: m.description,
          releaseYear: m.releaseYear,
          posterUrl: m.posterUrl,
        },
      })
      for (const genre of genreRecords) {
        await tx.genreOnMovie.create({ data: { movieId: movie.id, genreId: genre.id } })
      }
      for (const actor of actorRecords) {
        await tx.actorOnMovie.create({ data: { movieId: movie.id, actorId: actor.id } })
      }
      for (const director of directorRecords) {
        await tx.directorOnMovie.create({
          data: { movieId: movie.id, directorId: director.id },
        })
      }
    })
    movieCount++
  }

  console.log(
    `Seed done: ${movieCount} movies, ${ACTORS.length} actors, ${DIRECTORS.length} directors`,
  )
}

main().finally(() => prisma.$disconnect())
