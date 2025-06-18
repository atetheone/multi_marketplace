import Factory from '@adonisjs/lucid/factories'
import Tenant from '#tenant/models/tenant'

export const TenantFactory = Factory.define(Tenant, ({ faker }) => {
  const companyName = faker.company.name()
  return {
    slug: faker.helpers.slugify(companyName).toLowerCase() + '-' + faker.string.alphanumeric(8),
    name: faker.company.name(),
    domain: faker.internet.domainName(),
    description: faker.company.catchPhrase(),
    status: 'active',
  }
}).build()
