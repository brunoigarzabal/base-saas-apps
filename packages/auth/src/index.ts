import { z } from 'zod'

import {
  AbilityBuilder,
  CreateAbility,
  createMongoAbility,
  MongoAbility,
} from '@casl/ability'

import { User } from './models'
import { permissions } from './permissions'
import {
  userSubjectSchema,
  projectSubjectSchema,
  organizationSubjectSchema,
  inviteSubjectSchema,
  billingSubjectSchema,
} from './subjects'

export * from './models'

const appAbilities = z.union([
  userSubjectSchema,
  projectSubjectSchema,
  organizationSubjectSchema,
  inviteSubjectSchema,
  billingSubjectSchema,
  z.tuple([z.literal('manage'), z.literal('all')]),
])

type AppAbilities = z.infer<typeof appAbilities>

export type AppAbility = MongoAbility<AppAbilities>
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>

export function defineAbilityFor(user: User) {
  const builder = new AbilityBuilder(createAppAbility)

  if (typeof permissions[user.role] !== 'function') {
    throw new Error(`Permissions for role ${user.role} not found`)
  }

  permissions[user.role](user, builder)

  const ability = builder.build({
    detectSubjectType: subject => {
      return subject.__typename
    },
  })

  ability.can = ability.can.bind(ability)
  ability.cannot = ability.cannot.bind(ability)

  return ability
}
