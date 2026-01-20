import { fastify } from 'fastify'

import fastifyCors from '@fastify/cors'
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { createAccountRoute } from './routes/auth'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifyCors)

app.register(createAccountRoute)

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP server running on :3333')
  })
