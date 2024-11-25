import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient()

async function main() {
  for (let i = 0; i < 15; i++) {
    await prisma.artist.create({
      data: {
        name: faker.music.artist(),
        birthDate: faker.date.birthdate(),
      }
    })
  }

  for (let i = 0; i < 50; i++) {
    const free = Math.random() < 0.25;
    await prisma.song.create({
      data: {
        artist: { connect: { id: faker.number.int({ min: 1, max: 15 }) } },
        title: faker.music.songName(),
        duration: faker.number.int({ min: 60, max: 150 }),
        price: free ? 0 : faker.number.int({ min: 60, max: 150 }),
        rating: faker.number.float({ min: 1, max: 5 })
      }
    })
  }

  for (let i = 0; i < 10; i++) {
    await prisma.playlist.create({
      data: {
        name: faker.music.album(),
        songs: {
          connect: [
            {
              id: i + 1
            },
          ]
        }
      }
    })
  }
  await prisma.playlist.update({
    where: { id: 2 },
    data: {
      songs: {
        connect: [
          { id: 2 },
          { id: 4 },
          { id: 5 },
          { id: 10 },
          { id: 11 },
        ]
      }
    }
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
