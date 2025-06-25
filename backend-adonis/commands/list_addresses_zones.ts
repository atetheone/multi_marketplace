import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import db from '@adonisjs/lucid/services/db'

export default class ListAddressesZones extends BaseCommand {
  static commandName = 'store:addresses-zones'
  static description = 'Retrieve store addresses and their related delivery zones'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    this.logger.info('🏪 Retrieving store addresses and delivery zones...')

    try {
      // Get all tenants first
      const tenants = await db
        .from('tenants')
        .select('id', 'name', 'domain', 'slug')
        .orderBy('name')

      if (tenants.length === 0) {
        this.logger.warning('⚠️ No tenants found in the system')
        return
      }

      this.logger.info(`📊 Found ${tenants.length} tenant(s)`)

      for (const tenant of tenants) {
        this.logger.info(`\n🏢 === ${tenant.name} (${tenant.domain}) ===`)
        
        // Get delivery zones for this tenant
        const zones = await db
          .from('delivery_zones')
          .select('*')
          .where('tenant_id', tenant.id)
          .orderBy('name')

        if (zones.length === 0) {
          this.logger.warning(`  ⚠️ No delivery zones found for ${tenant.name}`)
          continue
        }

        this.logger.info(`  📍 Delivery Zones (${zones.length}):`)
        console.table(zones.map(zone => ({
          ID: zone.id,
          Name: zone.name,
          Fee: `${zone.fee || 0} FCFA`,
          'Est. Delivery': zone.estimated_delivery_time ? `${zone.estimated_delivery_time} min` : 'N/A',
          Active: zone.is_active !== undefined ? (zone.is_active ? '✅' : '❌') : 'N/A',
          'Postal Codes': zone.postal_codes ? JSON.parse(zone.postal_codes).join(', ') : 'N/A'
        })))

        // Get addresses for this tenant with their zones
        const addresses = await db
          .from('addresses')
          .leftJoin('delivery_zones', 'addresses.zone_id', 'delivery_zones.id')
          .select(
            'addresses.id as address_id',
            'addresses.type',
            'addresses.address_line1',
            'addresses.address_line2',
            'addresses.city',
            'addresses.state',
            'addresses.country',
            'addresses.postal_code',
            'addresses.phone',
            'addresses.is_default',
            'delivery_zones.id as zone_id',
            'delivery_zones.name as zone_name',
            'delivery_zones.fee as zone_fee'
          )
          .where('addresses.tenant_id', tenant.id)
          .orderBy('addresses.is_default', 'desc')
          .orderBy('addresses.created_at', 'desc')

        if (addresses.length === 0) {
          this.logger.warning(`  ⚠️ No addresses found for ${tenant.name}`)
          continue
        }

        this.logger.info(`  🏠 Addresses (${addresses.length}):`)
        console.table(addresses.map(addr => ({
          ID: addr.address_id,
          Type: addr.type,
          'Full Address': `${addr.address_line1}, ${addr.city}${addr.state ? `, ${addr.state}` : ''}, ${addr.country}`,
          'Postal Code': addr.postal_code || 'N/A',
          Phone: addr.phone || 'N/A',
          Default: addr.is_default ? '⭐' : '',
          'Zone ID': addr.zone_id || 'N/A',
          'Zone Name': addr.zone_name || 'No Zone',
          'Zone Fee': addr.zone_fee ? `${addr.zone_fee} FCFA` : 'N/A'
        })))

        // Summary statistics
        const defaultAddresses = addresses.filter(addr => addr.is_default)
        const addressesWithZones = addresses.filter(addr => addr.zone_id)
        const addressesWithoutZones = addresses.filter(addr => !addr.zone_id)

        this.logger.info(`  📈 Summary:`)
        this.logger.info(`    • Default addresses: ${defaultAddresses.length}`)
        this.logger.info(`    • Addresses with zones: ${addressesWithZones.length}`)
        this.logger.info(`    • Addresses without zones: ${addressesWithoutZones.length}`)

        if (addressesWithoutZones.length > 0) {
          this.logger.warning(`    ⚠️ ${addressesWithoutZones.length} address(es) have no delivery zone assigned!`)
        }
      }

      // Global summary
      this.logger.info('\n📊 === GLOBAL SUMMARY ===')
      
      const totalZones = await db.from('delivery_zones').count('* as total').first()
      const totalAddresses = await db.from('addresses').count('* as total').first()
      const addressesWithZones = await db
        .from('addresses')
        .whereNotNull('zone_id')
        .count('* as total')
        .first()
      const addressesWithoutZones = await db
        .from('addresses')
        .whereNull('zone_id')
        .count('* as total')
        .first()

      this.logger.info(`📍 Total delivery zones: ${totalZones?.total || 0}`)
      this.logger.info(`🏠 Total addresses: ${totalAddresses?.total || 0}`)
      this.logger.info(`✅ Addresses with zones: ${addressesWithZones?.total || 0}`)
      this.logger.info(`⚠️ Addresses without zones: ${addressesWithoutZones?.total || 0}`)

      // Check for orphaned zones (zones with no addresses)
      const orphanedZones = await db
        .from('delivery_zones')
        .leftJoin('addresses', 'delivery_zones.id', 'addresses.zone_id')
        .whereNull('addresses.zone_id')
        .select('delivery_zones.id', 'delivery_zones.name', 'delivery_zones.tenant_id')
        .groupBy('delivery_zones.id', 'delivery_zones.name', 'delivery_zones.tenant_id')

      if (orphanedZones.length > 0) {
        this.logger.warning(`\n🔍 Found ${orphanedZones.length} delivery zone(s) with no addresses:`)
        console.table(orphanedZones.map(zone => ({
          'Zone ID': zone.id,
          'Zone Name': zone.name,
          'Tenant ID': zone.tenant_id
        })))
      }

      this.logger.success('\n🎉 Address and zone analysis completed!')

    } catch (error) {
      this.logger.error('❌ Error retrieving addresses and zones:', error.message)
      console.error(error)
    }
  }
}