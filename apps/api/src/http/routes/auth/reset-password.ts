import { z } from 'zod'

import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import argon2 from 'argon2'

import { prisma } from '@/lib/prisma'
import { UnauthorizedError } from '../_errors'

export async function resetPasswordRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/password/reset',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Reset user password',
        body: z.object({
          code: z.string(),
          password: z.string().min(6),
        }),
        response: {
          204: z.undefined(),
        },
      },
    },
    async (request, reply) => {
      const { code, password } = request.body

      const tokenFromCode = await prisma.token.findUnique({
        where: {
          id: code,
        },
      })

      if (!tokenFromCode) {
        throw new UnauthorizedError()
      }

      const passwordHash = await argon2.hash(password)

      await prisma.$transaction([
        prisma.user.update({
          where: {
            id: tokenFromCode.userId,
          },
          data: {
            passwordHash,
          },
        }),
        prisma.token.delete({
          where: {
            id: code,
          },
        }),
      ])

      return reply.status(204).send()
    }
  )
}
