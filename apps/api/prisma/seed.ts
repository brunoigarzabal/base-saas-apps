import { faker } from '@faker-js/faker'

import argon2 from 'argon2'

import { PrismaClient } from '../src/generated/prisma/client'

import { pgAdapter } from '../src/lib/prisma'

const prisma = new PrismaClient({ adapter: pgAdapter })

async function seed() {
  await prisma.organization.deleteMany()
  await prisma.user.deleteMany()

  const passwordHash = await argon2.hash('123456')

  const user1 = await prisma.user.create({
    data: {
      email: 'brunoigar@live.com',
      name: 'Bruno Igarzabal',
      avatarUrl: faker.image.avatarGitHub(),
      passwordHash,
    },
  })

  const user2 = await prisma.user.create({
    data: {
      email: faker.internet.email(),
      name: faker.person.firstName(),
      avatarUrl: faker.image.avatarGitHub(),
      passwordHash,
    },
  })

  const user3 = await prisma.user.create({
    data: {
      email: faker.internet.email(),
      name: faker.person.firstName(),
      avatarUrl: faker.image.avatarGitHub(),
      passwordHash,
    },
  })

  const organization1 = await prisma.organization.create({
    data: {
      name: 'Acme Inc (Admin)',
      domain: 'acme.com',
      slug: 'acme-admin',
      avatarUrl: faker.image.url(),
      shouldAttachUserByDomain: true,
      ownerId: user1.id,
      projects: {
        createMany: {
          data: [
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(4),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.url(),
              ownerId: faker.helpers.arrayElement([
                user1.id,
                user2.id,
                user3.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(4),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.url(),
              ownerId: faker.helpers.arrayElement([
                user1.id,
                user2.id,
                user3.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(4),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.url(),
              ownerId: faker.helpers.arrayElement([
                user1.id,
                user2.id,
                user3.id,
              ]),
            },
          ],
        },
      },
      members: {
        createMany: {
          data: [
            { userId: user1.id, role: 'ADMIN' },
            { userId: user2.id, role: 'MEMBER' },
            { userId: user3.id, role: 'MEMBER' },
          ],
        },
      },
    },
  })

  const organization2 = await prisma.organization.create({
    data: {
      name: 'Acme Inc (Member)',
      slug: 'acme-member',
      avatarUrl: faker.image.url(),
      ownerId: user1.id,
      projects: {
        createMany: {
          data: [
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(4),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.url(),
              ownerId: faker.helpers.arrayElement([
                user1.id,
                user2.id,
                user3.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(4),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.url(),
              ownerId: faker.helpers.arrayElement([
                user1.id,
                user2.id,
                user3.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(4),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.url(),
              ownerId: faker.helpers.arrayElement([
                user1.id,
                user2.id,
                user3.id,
              ]),
            },
          ],
        },
      },
      members: {
        createMany: {
          data: [
            { userId: user1.id, role: 'MEMBER' },
            { userId: user2.id, role: 'ADMIN' },
            { userId: user3.id, role: 'MEMBER' },
          ],
        },
      },
    },
  })

  const organization3 = await prisma.organization.create({
    data: {
      name: 'Acme Inc (Billing)',
      slug: 'acme-billing',
      avatarUrl: faker.image.url(),
      ownerId: user1.id,
      projects: {
        createMany: {
          data: [
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(4),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.url(),
              ownerId: faker.helpers.arrayElement([
                user1.id,
                user2.id,
                user3.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(4),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.url(),
              ownerId: faker.helpers.arrayElement([
                user1.id,
                user2.id,
                user3.id,
              ]),
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.slug(4),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.url(),
              ownerId: faker.helpers.arrayElement([
                user1.id,
                user2.id,
                user3.id,
              ]),
            },
          ],
        },
      },
      members: {
        createMany: {
          data: [
            { userId: user1.id, role: 'BILLING' },
            { userId: user2.id, role: 'ADMIN' },
            { userId: user3.id, role: 'MEMBER' },
          ],
        },
      },
    },
  })
}

seed()
  .then(async () => {
    console.log('Database seeded successfully')
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
