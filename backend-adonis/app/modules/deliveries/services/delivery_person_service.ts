import { inject } from '@adonisjs/core'
import DeliveryPerson from '#deliveries/models/delivery_person'
import User from '#user/models/user'
import { UpdateDeliveryPersonDto } from '#deliveries/types/update_delivery_person_dto'
import { DateTime } from 'luxon'

@inject()
export class DeliveryPersonService {
  private normalizeLicenseExpiryFormat(licenceExpiry: any) {
    if (licenseExpiry) {
      if (data.licenseExpiry instanceof DateTime) {
        licenseExpiry = data.licenseExpiry
      } else if (typeof data.licenseExpiry === 'string') {
        // Try parsing as ISO string first
        licenseExpiry = DateTime.fromISO(data.licenseExpiry)

        // If invalid, try other common formats
        if (!licenseExpiry.isValid) {
          // Try SQL date format
          licenseExpiry = DateTime.fromSQL(data.licenseExpiry)
        }

        if (!licenseExpiry.isValid) {
          // Try JS date format
          licenseExpiry = DateTime.fromJSDate(new Date(data.licenseExpiry))
        }

        if (!licenseExpiry.isValid) {
          throw new Error('Invalid date format for licenseExpiry')
        }
      } else if (data.licenseExpiry instanceof Date) {
        licenseExpiry = DateTime.fromJSDate(data.licenseExpiry)
      }

      return licenceExpiry
    }

  }
  async createDeliveryPerson(userId: number, tenantId: number, data: any) {
    // Verify user has delivery-person role
    await User.query()
      .where('id', userId)
      .whereHas('roles', (q) => q.where('name', 'delivery-person'))
      .firstOrFail()

    // Properly handle the licenseExpiry date conversion to DateTime
    let licenseExpiry: DateTime | undefined

    licenceExpiry = this.normalizeLicenseExpiryFormat(licenceExpiry)

    return await DeliveryPerson.create({
      userId,
      tenantId,
      vehicleType: data.vehicleType,
      vehiclePlateNumber: data.vehiclePlateNumber,
      vehicleModel: data.vehicleModel,
      vehicleYear: data.vehicleYear,
      licenseNumber: data.licenseNumber,
      licenseExpiry,
      licenseType: data.licenseType,
      isActive: true,
      isAvailable: true,
    })
  }

  async getUsersWithDeliveryPersonRole(tenantId?: number) {
    const users = await User.query()
      .where((query) => {
        query.whereNull('tenant_id')
        if (tenantId) {
          query.orWhere('tenant_id', tenantId)
        }
      })
      .whereHas('roles', (q) => q.where('name', 'delivery-person'))

    return users
  }

  async updateZones(deliveryPersonId: number, zoneIds: number[]) {
    const deliveryPerson = await DeliveryPerson.findOrFail(deliveryPersonId)

    const now = DateTime.now().toISO()

    const pivotData = zoneIds.reduce(
      (
        acc: Record<string, { is_active: boolean; created_at: string; updated_at: string }>,
        zoneId
      ) => {
        acc[zoneId] = {
          is_active: true,
          created_at: now,
          updated_at: now,
        }
        return acc
      },
      {}
    )

    await deliveryPerson.related('zones').sync(pivotData)

    return await deliveryPerson.load('zones')
  }

  async toggleAvailability(deliveryPersonId: number, isAvailable: boolean) {
    const deliveryPerson = await DeliveryPerson.findOrFail(deliveryPersonId)
    await deliveryPerson
      .merge({
        isAvailable,
        lastActiveAt: isAvailable ? DateTime.now() : undefined,
      })
      .save()
    return deliveryPerson
  }

  async getDeliveryPersonProfile(userId: number) {
    const deliveryPerson = await DeliveryPerson.query()
      .where('user_id', userId)
      .preload('zones')
      .preload('user')
      .firstOrFail()

    return deliveryPerson
  }

  async getDeliveryPerson(id: number) {
    const deliveryPerson = await DeliveryPerson.query()
      .where('id', id)
      .preload('zones')
      .preload('user')
      .firstOrFail()

    return deliveryPerson
  }

  async listDeliveryPersons(
    tenantId: number,
    zoneId?: number //,
    // {
    //   page = 1,
    //   limit = 10,
    //   zoneId,
    //   search,
    // }: { page?: number; limit?: number; zoneId?: number; search?: string }
  ) {
    const query = DeliveryPerson.query()
      .where('tenant_id', tenantId)
      .where('is_active', true)
      .preload('user')
      .preload('zones')

    if (zoneId) {
      query.whereHas('zones', (q) => {
        q.where('zone_id', zoneId).where('is_active', true)
      })
    }

    return await query.orderBy('rating', 'desc')
  }

  async updateDeliveryPersonZones(userId: number, zoneIds: number[]) {
    const deliveryPerson = await DeliveryPerson.query().where('user_id', userId).firstOrFail()

    return await this.updateZones(deliveryPerson.id, zoneIds)
  }

  async updateDeliveryPerson(
    deliveryPersonId: number,
    tenantId: number,
    data: UpdateDeliveryPersonDto
  ) {
    // const trx = await db.transaction()
    const deliveryPerson = await DeliveryPerson.query()
      .where('id', deliveryPersonId)
      .where((query) => {
        query.whereNull('tenant_id')
        if (tenantId) {
          query.orWhere('tenant_id', tenantId)
        }
      })
      .firstOrFail()

    if (data.zoneIds.length) {
      await this.updateZones(deliveryPersonId, data.zoneIds)
    }

    const licenseExpiry = this.normalizeLicenseExpiryFormat(data.licenseExpiry || '')

    await deliveryPerson
      .merge({
        vehicleType: data.vehicleType,
        vehiclePlateNumber: data.vehiclePlateNumber,
        vehicleModel: data.vehicleModel,
        vehicleYear: data.vehicleYear,
        licenseNumber: data.licenseNumber,
        licenseExpiry,
        licenseType: data.licenseType,
      })
      .save()

    return deliveryPerson
  }
}
