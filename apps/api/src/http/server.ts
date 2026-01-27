import { fastify } from 'fastify'

import fastifyCors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import fastifyJwt from '@fastify/jwt'
import fastifySwaggerUI from '@fastify/swagger-ui'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { env } from '@saas/env'

import {
  createAccountRoute,
  authenticateWithPasswordRoute,
  getProfileRoute,
  getRequestPasswordRecoverRoute,
  resetPasswordRoute,
  authenticateWithGithubRoute,
} from './routes/auth'

import {
  createOrganizationRoute,
  getMembershipRoute,
  getOrganizationRoute,
  getOrganizationsRoute,
  updateOrganizationRoute,
  shutdownOrganizationRoute,
} from './routes/organizations'

import { errorHandler } from './error-handler'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.setErrorHandler(errorHandler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Saas API',
      description: 'Full-stack SaaS app with multi-tenant & RBAC.',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'Bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(fastifyCors)

app.register(authenticateWithPasswordRoute)
app.register(authenticateWithGithubRoute)
app.register(createAccountRoute)
app.register(getProfileRoute)
app.register(getRequestPasswordRecoverRoute)
app.register(resetPasswordRoute)

app.register(createOrganizationRoute)
app.register(getMembershipRoute)
app.register(getOrganizationsRoute)
app.register(getOrganizationRoute)
app.register(updateOrganizationRoute)
app.register(shutdownOrganizationRoute)

app
  .listen({
    port: env.SERVER_PORT,
  })
  .then(() => {
    console.log(`HTTP server running on :${env.SERVER_PORT}`)
  })
