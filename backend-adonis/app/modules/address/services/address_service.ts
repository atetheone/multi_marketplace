import type { TransactionClientContract } from '@adonisjs/lucid/types/database'
import Address from '#address/models/address'
import { CreateAddressDto, UpdateAddressDto } from '#address/types/address'
import { Exception } from '@adonisjs/core/exceptions'
import DeliveryZone from '#address/models/delivery_zone'

export default class AddressService {
  async getUserAddresses(userId: number, tenantId: number) {
    const addresses = await Address.query()
      .whereHas('users', (query) => {
        query.where('user_id', userId)
      })
      .where('tenant_id', tenantId)
      .orderBy('is_default', 'desc')
      .orderBy('created_at', 'desc')

    return addresses
  }

  async getAddressById(addressId: number, userId: number, tenantId: number) {
    const address = await Address.query()
      .whereHas('users', (query) => {
        query.where('user_id', userId)
      })
      .where('id', addressId)
      .where('tenant_id', tenantId)
      .preload('zone')
      .firstOrFail()

    return address
  }

  async createAddress(
    userId: number,
    tenantId: number,
    data: CreateAddressDto,
    trx?: TransactionClientContract
  ) {
    const normalizedAddress = this.normalizeAddress(data)

    const adQuery = trx ? Address.query({ client: trx }) : Address.query()

    const existingAddress = await adQuery
      .where('tenant_id', tenantId)
      .where('type', data.type)
      .where('address_line1', normalizedAddress.addressLine1)
      .where((query) => {
        query
          .whereNull('address_line2')
          .orWhere('address_line2', normalizedAddress.addressLine2 || '')
      })
      .where('city', normalizedAddress.city)
      .where((query) => {
        query.whereNull('state').orWhere('state', normalizedAddress.state || '')
      })
      .where('country', normalizedAddress.country)
      .where((query) => {
        query.whereNull('postal_code').orWhere('postal_code', normalizedAddress.postalCode || '')
      })
      .where((query) => {
        query.whereNull('phone').orWhere('phone', normalizedAddress.phone || '')
      })
      .preload('zone')
      .first()

    if (existingAddress) {
      // Handle default address settings
      if (data.isDefault && !existingAddress.isDefault) {
        await this.updateDefaultAddress(userId, tenantId, data.type, trx)
        await existingAddress.merge({ isDefault: true }).save()
      }
      return existingAddress
    }

    const { zoneId, ...addressData } = data

    const relatedZone = await DeliveryZone.query().where('id', zoneId).firstOrFail()

    // Create new address
    const address = await Address.create(
      {
        ...addressData,
        tenantId,
      },
      { client: trx }
    )

    // Attach address to user
    await address.related('users').attach([userId], trx)

    await address.related('zone').associate(relatedZone)

    await address.load('zone')

    return address
  }

  async updateAddress(addressId: number, userId: number, tenantId: number, data: UpdateAddressDto) {
    console.log(`Updating address: ${JSON.stringify(data, null, 3)}`)
    const address = await this.getAddressById(addressId, userId, tenantId)

    if (data.isDefault && !address.isDefault) {
      await Address.query()
        .whereHas('users', (query) => {
          query.where('user_id', userId)
        })
        .where('tenant_id', tenantId)
        .where('type', address.type)
        .update({ isDefault: false })
    }

    await address.merge(data).save()
    return address
  }

  async deleteAddress(addressId: number, userId: number, tenantId: number) {
    const address = await this.getAddressById(addressId, userId, tenantId)

    // Don't allow deletion of last address if it's a default one
    const addressCountResult = await Address.query()
      .whereHas('users', (query) => {
        query.where('user_id', userId)
      })
      .where('tenant_id', tenantId)
      .where('type', address.type)
      .count('*', 'total')

    const addressCount: number = addressCountResult[0].$extras.total

    if (address.isDefault && addressCount === 1) {
      throw new Exception('Cannot delete the only default address', {
        status: 400,
        code: 'LAST_DEFAULT_ADDRESS',
      })
    }

    await address.delete()
  }

  async getDefaultShippingAddress(userId: number, tenantId: number) {
    const defaultAddress = await Address.query()
      .whereHas('users', (query) => {
        query.where('user_id', userId)
      })
      .where('tenant_id', tenantId)
      .where('type', 'shipping')
      .where('is_default', true)
      .preload('zone')
      .first()

    if (!defaultAddress) {
      // Optionally get the most recent shipping address if no default exists
      const recentAddress = await Address.query()
        .whereHas('users', (query) => {
          query.where('user_id', userId)
        })
        .where('tenant_id', tenantId)
        .where('type', 'shipping')
        .orderBy('created_at', 'desc')
        .preload('zone')
        .first()

      if (!recentAddress) {
        return null
      }

      return recentAddress
    }

    return defaultAddress
  }

  private normalizeAddress(addressData: CreateAddressDto): CreateAddressDto {
    return {
      type: addressData.type,
      addressLine1: addressData.addressLine1.trim(),
      addressLine2: addressData.addressLine2?.trim() || undefined,
      city: addressData.city.trim(),
      state: addressData.state?.trim() || undefined,
      country: addressData.country.trim(),
      postalCode: addressData.postalCode?.trim() || undefined,
      phone: addressData.phone?.trim() || undefined,
      isDefault: addressData.isDefault,
      zoneId: addressData.zoneId,
    }
  }

  private async updateDefaultAddress(
    userId: number,
    tenantId: number,
    type: string,
    trx?: TransactionClientContract
  ) {
    const query = trx ? Address.query({ client: trx }) : Address.query()

    await query
      .whereHas('users', (userQuery) => {
        userQuery.where('user_id', userId)
      })
      .where('tenant_id', tenantId)
      .where('type', type)
      .update({ is_default: false })
  }
}
