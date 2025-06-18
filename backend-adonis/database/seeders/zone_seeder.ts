import { BaseSeeder } from '@adonisjs/lucid/seeders'
import DeliveryZone from '#address/models/delivery_zone'
import Tenant from '#tenant/models/tenant'

export default class ZoneSeeder extends BaseSeeder {
  async run() {
    // Define Dakar zones with delivery fees
    const dakarZones = [
      { name: 'Amitité I', fee: 1500 },
      { name: 'Fass', fee: 1000 },
      { name: 'Almadies', fee: 2000 },
      { name: 'Point E', fee: 1500 },
      { name: 'Plateau', fee: 1500 },
      { name: 'Mermoz', fee: 2000 },
      { name: 'Ouakam', fee: 2500 },
      { name: 'Ngor', fee: 3000 },
      { name: 'Yoff', fee: 2500 },
      { name: 'Sacré Coeur', fee: 2000 },
      { name: 'Medina', fee: 1500 },
      { name: 'Fann', fee: 1500 },
      { name: 'HLM', fee: 2000 },
      { name: 'Grand Dakar', fee: 2000 },
      { name: 'Pikine', fee: 3500 },
      { name: 'Guediawaye', fee: 4000 },
      { name: 'Rufisque', fee: 4500 },
    ]

    // Get all active tenants
    const tenants = await Tenant.query().where('status', 'active')

    // Create zones for each tenant
    for (const tenant of tenants) {
      // Create delivery zones with their respective fees
      await Promise.all(
        dakarZones.map(async (zone) => {
          await DeliveryZone.create({
            name: zone.name,
            fee: zone.fee,
            tenantId: tenant.id
          })
        })
      )
    }
  }
}