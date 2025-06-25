import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import db from '@adonisjs/lucid/services/db'

export default class FixInventoryTenants extends BaseCommand {
  static commandName = 'fix:inventory-tenants'
  static description = 'Fix inventory tenant_id mismatches'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    this.logger.info('🔧 Fixing inventory tenant mismatches...')

    try {
      // 1. Find all inventory records with mismatched tenant_ids
      this.logger.info('\n🔍 Finding tenant mismatches...')
      const mismatches = await db.rawQuery(`
        SELECT 
          i.id as inventory_id,
          i.product_id,
          i.tenant_id as inventory_tenant,
          p.tenant_id as product_tenant,
          p.name as product_name
        FROM inventory i
        JOIN products p ON i.product_id = p.id
        WHERE i.tenant_id != p.tenant_id
      `)

      if (mismatches.rows.length > 0) {
        this.logger.info(`Found ${mismatches.rows.length} mismatched records:`)
        console.table(mismatches.rows)

        // 2. Fix the mismatches
        this.logger.info('\n🔧 Fixing mismatches...')
        for (const mismatch of mismatches.rows) {
          await db.from('inventory').where('id', mismatch.inventory_id).update({
            tenant_id: mismatch.product_tenant,
            updated_at: new Date(),
          })

          this.logger.success(
            `✅ Fixed inventory ${mismatch.inventory_id}: tenant ${mismatch.inventory_tenant} → ${mismatch.product_tenant}`
          )
        }
      } else {
        this.logger.info('✅ No tenant mismatches found!')
      }

      // 3. Verify the fix for products 103 and 104
      this.logger.info('\n✅ Verifying products 103 and 104...')
      const verification = await db.rawQuery(`
        SELECT 
          p.id as product_id,
          p.name,
          p.tenant_id as product_tenant,
          i.tenant_id as inventory_tenant,
          i.quantity,
          i.reserved_quantity,
          CASE 
            WHEN i.tenant_id = p.tenant_id THEN 'MATCH ✅'
            ELSE 'MISMATCH ❌'
          END as status
        FROM products p
        JOIN inventory i ON p.id = i.product_id
        WHERE p.id IN (103, 104)
      `)

      console.table(verification.rows)

      this.logger.success('🎉 Fix completed!')
    } catch (error) {
      this.logger.error('Error:', error.message)
      console.error(error)
    }
  }
}
