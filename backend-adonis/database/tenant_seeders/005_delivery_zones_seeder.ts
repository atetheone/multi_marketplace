import { BaseSeeder } from '@adonisjs/lucid/seeders'
import DeliveryZone from '#address/models/delivery_zone'
import Tenant from '#tenant/models/tenant'

export default class extends BaseSeeder {
  async run() {
    // Get tenants
    const defaultTenant = await Tenant.findByOrFail('slug', 'default')
    const dakarTenant = await Tenant.findByOrFail('slug', 'dakar-express')

    // Create delivery zones for Dakar and surroundings
    await DeliveryZone.createMany([
      // Dakar Centre
      {
        name: 'Dakar Centre',
        description: 'Plateau, Médina, Gueule Tapée',
        deliveryFee: 1500, // XOF
        estimatedDeliveryTime: 45, // minutes
        isActive: true,
        postalCodes: ['11000', '11001', '11002'],
        tenantId: defaultTenant.id,
      },
      {
        name: 'Dakar Ouest',
        description: 'Almadies, Ngor, Ouakam, Yoff',
        deliveryFee: 2000,
        estimatedDeliveryTime: 60,
        isActive: true,
        postalCodes: ['11010', '11011', '11012', '11013'],
        tenantId: defaultTenant.id,
      },
      {
        name: 'Dakar Sud',
        description: 'Fann, Point E, Mermoz, Sacré-Cœur',
        deliveryFee: 1800,
        estimatedDeliveryTime: 50,
        isActive: true,
        postalCodes: ['11020', '11021', '11022'],
        tenantId: defaultTenant.id,
      },
      // Pikine
      {
        name: 'Pikine',
        description: 'Pikine, Guédiawaye, Yeumbeul',
        deliveryFee: 2500,
        estimatedDeliveryTime: 75,
        isActive: true,
        postalCodes: ['12000', '12001', '12002'],
        tenantId: defaultTenant.id,
      },
      // Rufisque
      {
        name: 'Rufisque',
        description: 'Rufisque et environs',
        deliveryFee: 3000,
        estimatedDeliveryTime: 90,
        isActive: true,
        postalCodes: ['13000', '13001'],
        tenantId: defaultTenant.id,
      },
      // Thiaroye
      {
        name: 'Thiaroye',
        description: 'Thiaroye sur Mer, Keur Massar',
        deliveryFee: 2800,
        estimatedDeliveryTime: 80,
        isActive: true,
        postalCodes: ['14000', '14001'],
        tenantId: defaultTenant.id,
      },
      // Parcelles Assainies
      {
        name: 'Parcelles Assainies',
        description: 'Unités 1 à 26',
        deliveryFee: 2200,
        estimatedDeliveryTime: 65,
        isActive: true,
        postalCodes: ['15000', '15001'],
        tenantId: defaultTenant.id,
      },

      // Specific zones for Dakar Express tenant
      {
        name: 'Zone Express Dakar',
        description: 'Livraison express dans Dakar (moins de 30min)',
        deliveryFee: 2500,
        estimatedDeliveryTime: 30,
        isActive: true,
        postalCodes: ['11000', '11001', '11020'],
        tenantId: dakarTenant.id,
      },
      {
        name: 'Zone Express Banlieue',
        description: 'Livraison express en banlieue (moins de 45min)',
        deliveryFee: 3500,
        estimatedDeliveryTime: 45,
        isActive: true,
        postalCodes: ['12000', '15000'],
        tenantId: dakarTenant.id,
      },
    ])

    console.log('✅ Delivery zones created for Dakar region')
    console.log(
      '📍 Zones: Dakar Centre, Ouest, Sud, Pikine, Rufisque, Thiaroye, Parcelles Assainies'
    )
    console.log('💰 Delivery fees: 1500-3500 XOF based on distance')
    console.log('⏱️ Estimated delivery: 30-90 minutes')
  }
}
