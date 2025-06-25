import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import db from '@adonisjs/lucid/services/db'

export default class DiagnoseInventory extends BaseCommand {
  static commandName = 'diagnose:inventory'
  static description = 'Diagnose inventory issues for cart and products'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    this.logger.info('🔍 Starting inventory diagnosis...')

    try {
      // 1. Check cart and its items
      this.logger.info('\n📦 Checking cart ID 20 and its items...')
      const cartItems = await db
        .from('cart_items')
        .select(
          'cart_items.id as cart_item_id',
          'cart_items.cart_id',
          'cart_items.product_id',
          'cart_items.quantity',
          'cart_items.tenant_id as cart_item_tenant_id',
          'products.name as product_name',
          'products.tenant_id as product_tenant_id',
          'products.price'
        )
        .join('products', 'cart_items.product_id', 'products.id')
        .where('cart_items.cart_id', 20)

      console.table(cartItems)

      // 2. Check inventory records for these products
      this.logger.info('\n🏪 Checking inventory records...')
      const productIds = cartItems.map(item => item.product_id)
      
      const inventoryRecords = await db
        .from('inventory')
        .select(
          'inventory.id',
          'inventory.product_id',
          'inventory.tenant_id',
          'inventory.quantity',
          'inventory.reservedQuantity',
          'inventory.reorder_point',
          'products.name as product_name',
          'products.tenant_id as product_tenant_id'
        )
        .join('products', 'inventory.product_id', 'products.id')
        .whereIn('inventory.product_id', productIds)

      console.table(inventoryRecords)

      // 3. Find missing inventory records
      this.logger.info('\n❌ Checking for missing inventory records...')
      const missingInventory = await db.rawQuery(`
        SELECT 
          p.id as product_id,
          p.name,
          p.tenant_id,
          CASE 
            WHEN i.id IS NULL THEN 'MISSING INVENTORY'
            ELSE 'HAS INVENTORY'
          END as inventory_status
        FROM products p
        LEFT JOIN inventory i ON p.id = i.product_id AND p.tenant_id = i.tenant_id
        WHERE p.id = ANY(?)
        ORDER BY p.id
      `, [productIds])

      console.table(missingInventory.rows)

      // 4. Check specific product-tenant combinations from cart
      this.logger.info('\n🎯 Checking specific product-tenant combinations...')
      for (const item of cartItems) {
        const inventory = await db
          .from('inventory')
          .where('product_id', item.product_id)
          .where('tenant_id', item.product_tenant_id)
          .first()

        if (!inventory) {
          this.logger.error(`❌ Missing inventory: Product ${item.product_id} (${item.product_name}) for tenant ${item.product_tenant_id}`)
          
          // Create missing inventory record
          this.logger.info(`🔧 Creating inventory record for product ${item.product_id}...`)
          await db
            .table('inventory')
            .insert({
              product_id: item.product_id,
              tenant_id: item.product_tenant_id,
              quantity: 100, // Default quantity
              reservedQuantity: 0,
              reorder_point: 10,
              reorder_quantity: 50,
              low_stock_threshold: 5,
              created_at: new Date(),
              updated_at: new Date(),
            })
          this.logger.success(`✅ Created inventory record for product ${item.product_id}`)
        } else {
          this.logger.success(`✅ Inventory exists: Product ${item.product_id} - Qty: ${inventory.quantity}, Reserved: ${inventory.reservedQuantity}`)
        }
      }

      // 5. Final verification
      this.logger.info('\n✅ Final verification...')
      const finalCheck = await db
        .from('products')
        .select(
          'products.id',
          'products.name',
          'products.tenant_id',
          'inventory.quantity',
          'inventory.reservedQuantity'
        )
        .join('inventory', function() {
          this.on('products.id', 'inventory.product_id')
              .andOn('products.tenant_id', 'inventory.tenant_id')
        })
        .whereIn('products.id', productIds)

      console.table(finalCheck)

      this.logger.success('🎉 Inventory diagnosis completed!')

    } catch (error) {
      this.logger.error('Error during diagnosis:', error)
    }
  }
}