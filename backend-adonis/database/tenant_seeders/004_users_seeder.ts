import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#user/models/user'
import UserProfile from '#user/models/user_profile'
import Role from '#role/models/role'
import Tenant from '#tenant/models/tenant'

export default class extends BaseSeeder {
  async run() {
    // Get tenants and roles
    const defaultTenant = await Tenant.findByOrFail('slug', 'default')
    const dakarTenant = await Tenant.findByOrFail('slug', 'dakar-express')
    const terangaTenant = await Tenant.findByOrFail('slug', 'teranga-market')

    const superAdminRole = await Role.findByOrFail('name', 'super-admin')
    const adminRole = await Role.findByOrFail('name', 'admin')
    const managerRole = await Role.findByOrFail('name', 'manager')
    const customerRole = await Role.findByOrFail('name', 'customer')
    const deliveryRole = await Role.findByOrFail('name', 'delivery-person')

    // Create Super Admin for default tenant
    const superAdmin = await User.create({
      fullName: 'Administrateur Principal',
      email: 'admin@jefjel.sn',
      password: 'password123', // Will be hashed automatically
      isActive: true,
      tenantId: defaultTenant.id,
    })

    await UserProfile.create({
      userId: superAdmin.id,
      firstName: 'Administrateur',
      lastName: 'Principal',
      phone: '+221 77 000 00 00',
      language: 'fr',
      tenantId: defaultTenant.id,
    })

    await superAdmin.related('roles').attach([superAdminRole.id])
    await superAdmin.related('tenants').attach([defaultTenant.id])

    // Create Admin for Dakar Express
    const dakarAdmin = await User.create({
      fullName: 'Mamadou Diallo',
      email: 'admin@dakar-express.jefjel.sn',
      password: 'password123',
      isActive: true,
      tenantId: dakarTenant.id,
    })

    await UserProfile.create({
      userId: dakarAdmin.id,
      firstName: 'Mamadou',
      lastName: 'Diallo',
      phone: '+221 77 123 45 67',
      language: 'fr',
      tenantId: dakarTenant.id,
    })

    await dakarAdmin.related('roles').attach([adminRole.id])
    await dakarAdmin.related('tenants').attach([dakarTenant.id])

    // Create Admin for Teranga Market
    const terangaAdmin = await User.create({
      fullName: 'Aïssatou Ndiaye',
      email: 'admin@teranga.jefjel.sn',
      password: 'password123',
      isActive: true,
      tenantId: terangaTenant.id,
    })

    await UserProfile.create({
      userId: terangaAdmin.id,
      firstName: 'Aïssatou',
      lastName: 'Ndiaye',
      phone: '+221 78 987 65 43',
      language: 'fr',
      tenantId: terangaTenant.id,
    })

    await terangaAdmin.related('roles').attach([adminRole.id])
    await terangaAdmin.related('tenants').attach([terangaTenant.id])

    // Create sample manager for Dakar Express
    const manager = await User.create({
      fullName: 'Ousmane Ba',
      email: 'manager@dakar-express.jefjel.sn',
      password: 'password123',
      isActive: true,
      tenantId: dakarTenant.id,
    })

    await UserProfile.create({
      userId: manager.id,
      firstName: 'Ousmane',
      lastName: 'Ba',
      phone: '+221 76 555 66 77',
      language: 'fr',
      tenantId: dakarTenant.id,
    })

    await manager.related('roles').attach([managerRole.id])
    await manager.related('tenants').attach([dakarTenant.id])

    // Create sample customers
    const customers = await User.createMany([
      {
        fullName: 'Fatou Sow',
        email: 'fatou.sow@gmail.com',
        password: 'password123',
        isActive: true,
        tenantId: defaultTenant.id,
      },
      {
        fullName: 'Ibrahima Fall',
        email: 'ibrahima.fall@gmail.com',
        password: 'password123',
        isActive: true,
        tenantId: defaultTenant.id,
      },
    ])

    for (const customer of customers) {
      const [firstName, lastName] = customer.fullName.split(' ')
      await UserProfile.create({
        userId: customer.id,
        firstName,
        lastName,
        phone: `+221 77 ${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
        language: 'fr',
        tenantId: defaultTenant.id,
      })

      await customer.related('roles').attach([customerRole.id])
      await customer.related('tenants').attach([defaultTenant.id])
    }

    // Create sample delivery person
    const deliveryPerson = await User.create({
      fullName: 'Modou Gueye',
      email: 'modou.gueye@jefjel.sn',
      password: 'password123',
      isActive: true,
      tenantId: dakarTenant.id,
    })

    await UserProfile.create({
      userId: deliveryPerson.id,
      firstName: 'Modou',
      lastName: 'Gueye',
      phone: '+221 70 123 45 67',
      language: 'fr',
      tenantId: dakarTenant.id,
    })

    await deliveryPerson.related('roles').attach([deliveryRole.id])
    await deliveryPerson.related('tenants').attach([dakarTenant.id])

    console.log('✅ Users created successfully with Senegalese context')
    console.log('👤 Super Admin: admin@jefjel.sn')
    console.log('👤 Dakar Admin: admin@dakar-express.jefjel.sn')
    console.log('👤 Teranga Admin: admin@teranga.jefjel.sn')
    console.log('🔑 Default password for all users: password123')
  }
}