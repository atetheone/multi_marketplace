import { inject } from '@adonisjs/core'
import { Exception } from '@adonisjs/core/exceptions'
import DeliveryZone from '#address/models/delivery_zone'
import type { CreateZoneDto, UpdateZoneDto } from '#address/types/delivery_zone'

@inject()
export class DeliveryZoneService {
  async listZones(tenantId: number) {
    console.log('Tenant id: ' + tenantId)
    return await DeliveryZone.query().where('tenant_id', tenantId).orderBy('name', 'asc')
  }

  async getZoneById(id: number, tenantId: number) {
    const zone = await DeliveryZone.query().where('id', id).where('tenant_id', tenantId).first()

    if (!zone) {
      throw new Exception('Delivery zone not found', {
        status: 404,
        code: 'ZONE_NOT_FOUND',
      })
    }

    return zone
  }

  async createZone(data: CreateZoneDto & { tenantId: number }) {
    return await DeliveryZone.create({
      name: data.name,
      fee: data.fee,
      tenantId: data.tenantId,
    })
  }

  async updateZone(data: UpdateZoneDto & { tenantId: number }) {
    const zone = await this.getZoneById(data.id, data.tenantId)

    await zone.merge({ name: data.name, fee: data.fee }).save()

    return zone
  }

  async deleteZone(id: number, tenantId: number) {
    const zone = await this.getZoneById(id, tenantId)
    await zone.delete()
  }
}
