import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import db from '@adonisjs/lucid/services/db'

export default class DiagnoseSimple extends BaseCommand {
  static commandName = 'diagnose:simple'
  static description = 'Simple inventory diagnosis'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    this.logger.info('🔍 Simple inventory diagnosis...')

    try {
      // 1. Check table structure first
      this.logger.info('📋 Checking inventory table structure...')
      const columns = await db.rawQuery(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'inventory' 
        ORDER BY ordinal_position
      `)

      console.table(columns.rows)

      // 2. Check if inventory records exist for products 103 and 104  
      this.logger.info('\n🔍 Checking inventory for products 103 and 104...')
      const inventoryCheck = await db
        .from('inventory')
        .select('*')
        .whereIn('product_id', [103, 104])

      console.table(inventoryCheck)

      // 3. Check products and their tenants
      this.logger.info('\n📦 Checking products...')
      const products = await db
        .from('products')
        .select('id', 'name', 'tenant_id')
        .whereIn('id', [103, 104])

      console.table(products)

      // 4. Check if products have inventory for their respective tenants
      this.logger.info('\n🎯 Checking product-tenant inventory combinations...')
      for (const product of products) {
        const inventory = await db
          .from('inventory')
          .where('product_id', product.id)
          .where('tenant_id', product.tenant_id)
          .first()

        if (!inventory) {
          this.logger.error(
            `❌ Missing: Product ${product.id} (${product.name}) tenant ${product.tenant_id}`
          )

          // Create the missing record
          await db.table('inventory').insert({
            product_id: product.id,
            tenant_id: product.tenant_id,
            quantity: 100,
            reservedQuantity: 0,
            reorder_point: 10,
            reorder_quantity: 50,
            low_stock_threshold: 5,
            created_at: new Date(),
            updated_at: new Date(),
          })
          this.logger.success(`✅ Created inventory for product ${product.id}`)
        } else {
          this.logger.success(`✅ EXISTS: Product ${product.id} - Qty: ${inventory.quantity}`)
        }
      }

      this.logger.success('🎉 Diagnosis completed!')
    } catch (error) {
      this.logger.error('Error:', error.message)
      console.error(error)
    }
  }
}
