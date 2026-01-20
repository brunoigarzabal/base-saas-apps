import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { z } from 'zod'

export function createAccountRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: {
        body: z.object({
          name: z.string(),
          email: z.email(),
          password: z.string().min(6),
        }),
      },
    },
    async (request, reply) => {
      return 'User created!'
    }
  )
}
