import { inject } from '@adonisjs/core'
import Product from '#product/models/product'
import { Exception } from '@adonisjs/core/exceptions'
import db from '@adonisjs/lucid/services/db'
import type { TransactionClientContract } from '@adonisjs/lucid/types/database'
import { NotificationService } from '#notification/services/notification_service'
import { NotificationRolesService } from '#notification/services/notification_roles_service'
import Inventory from '#product/models/inventory'
import { UpdateInventorySettingsDto } from '#product/types/inventory'

@inject()
export class InventoryService {
  constructor(
    protected notificationService: NotificationService,
    protected notificationRolesService: NotificationRolesService
  ) {}

  async updateStock(productId: number, stock: number, tenantId: number) {
    const trx = await db.transaction()

    try {
      const product = await Product.query({ client: trx })
        .where('id', productId)
        .where('tenant_id', tenantId)
        .forUpdate()
        .preload('inventory')
        .first()

      if (!product) {
        throw new Exception('Product not found', {
          status: 404,
          code: 'PRODUCT_NOT_FOUND',
        })
      }

      let inventory: Inventory

      if (product.inventory) {
        const currentReserved = product.inventory.reservedQuantity || 0

        if (stock < currentReserved) {
          throw new Exception('New stock level cannot be less than reserved quantity', {
            status: 400,
            code: 'INVALID_STOCK_LEVEL',
            cause: {
              requestedStock: stock,
              reservedQuantity: currentReserved,
            },
          })
        }
        inventory = await product.inventory
          .merge({
            quantity: stock,
            reservedQuantity: currentReserved,
          })
          .save()
      } else {
        inventory = await product.related('inventory').create({
          quantity: stock,
          tenantId,
          reorderPoint: 10,
          reorderQuantity: 20,
          lowStockThreshold: 5,
          reservedQuantity: 0,
        })
      }

      // Check for low stock conditions and send notifications
      const availableStock = inventory.quantity - (inventory.reservedQuantity || 0)
      await this.checkThresholds(product, inventory, availableStock)

      await product.load('inventory')
      await trx.commit()
      return product
    } catch (error) {
      await trx.rollback()

      if (error instanceof Exception) {
        throw error
      }

      throw new Exception('Failed to update inventory', {
        status: 500,
        code: 'INVENTORY_UPDATE_FAILED',
        cause: error,
      })
    }
  }

  async updateSettings(productId: number, settings: UpdateInventorySettingsDto, tenantId: number) {
    const trx = await db.transaction()

    try {
      const product = await Product.query()
        .where('id', productId)
        .where('tenant_id', tenantId)
        .preload('inventory')
        .firstOrFail()

      if (
        settings.reorderPoint < 0 ||
        settings.reorderQuantity < 0 ||
        settings.lowStockThreshold < 0
      ) {
        throw new Exception('Invalid inventory settings values', {
          status: 400,
          code: 'INVALID_INVENTORY_SETTINGS',
        })
      }

      let inventory: Inventory

      if (product.inventory) {
        inventory = await product.inventory.merge(settings).save()
        const availableStock = inventory.quantity - inventory.reservedQuantity

        await this.checkThresholds(product, inventory, availableStock)
      } else {
        inventory = await product.related('inventory').create({
          ...settings,
          quantity: 0,
          tenantId,
          reservedQuantity: 0,
        })
      }

      await trx.commit()
      await product.load('inventory')
      return product
    } catch (error) {
      await trx.rollback()

      if (error instanceof Exception) {
        throw error
      }

      throw new Exception('Failed to update inventory settings', {
        status: 500,
        code: 'INVENTORY_SETTINGS_UPDATE_FAILED',
        cause: error,
      })
    }
  }

  async getStockHistory(productId: number, tenantId: number) {
    return []
  }

  async reserveStock(productId: number, quantityToReserve: number, tenantId: number) {
    const trx = await db.transaction()

    try {
      const inventory = await Inventory.query()
        .where('product_id', productId)
        .where('tenant_id', tenantId)
        .first()

      if (!inventory) {
        throw new Exception('Inventory not found', {
          status: 404,
          code: 'INVENTORY_NOT_FOUND',
        })
      }

      const availableStock = inventory.quantity - inventory.reservedQuantity

      // Check if sufficient stock is available
      if (availableStock < quantityToReserve) {
        throw new Exception('Insufficient available stock', {
          code: 'INSUFFICIENT_STOCK',
          status: 400,
        })
      }

      // Increase reserved quantity
      await inventory
        .merge({
          reservedQuantity: inventory.reservedQuantity + quantityToReserve,
        })
        .save()

      await trx.commit()
      return inventory
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  async releaseReservedStock(productId: number, quantityToRelease: number, tenantId: number) {
    const trx = await db.transaction()

    try {
      const inventory = await Inventory.query()
        .where('product_id', productId)
        .where('tenant_id', tenantId)
        .firstOrFail()

      await inventory
        .merge({
          reservedQuantity: Math.max(0, inventory.reservedQuantity - quantityToRelease),
        })
        .save()

      await trx.commit()
      return inventory
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  async commitReservedStock(productId: number, quantity: number, tenantId: number) {
    const trx = await db.transaction()

    try {
      const inventory = await Inventory.query()
        .where('product_id', productId)
        .where('tenant_id', tenantId)
        .firstOrFail()

      if (inventory.reservedQuantity < quantity) {
        throw new Exception('Cannot commit more stock than reserved', {
          status: 400,
          code: 'INVALID_STOCK_COMMIT',
        })
      }

      await inventory
        .merge({
          quantity: inventory.quantity - quantity,
          reservedQuantity: inventory.reservedQuantity - quantity,
        })
        .save()

      await trx.commit()
      return inventory
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  private async checkThresholds(product: Product, inventory: Inventory, availableStock: number) {
    // Check for low stock conditions
    if (availableStock <= inventory.lowStockThreshold) {
      await this.notificationRolesService.notifyRoles({
        type: 'inventory:low',
        title: 'Low Stock Alert',
        message: `Product "${product.name}" is running low on stock (${availableStock} available)`,
        tenantId: product.tenantId,
        data: {
          productId: product.id,
          currentStock: inventory.quantity,
          availableStock,
          reservedQuantity: inventory.reservedQuantity,
          threshold: inventory.lowStockThreshold,
        },
      })
    }

    // Check for reorder point
    if (availableStock <= inventory.reorderPoint) {
      await this.notificationRolesService.notifyRoles({
        type: 'inventory:reorder',
        title: 'Reorder Point Reached',
        message: `Product "${product.name}" has reached reorder point. Suggested order: ${inventory.reorderQuantity} units`,
        tenantId: product.tenantId,
        data: {
          productId: product.id,
          currentStock: inventory.quantity,
          availableStock,
          reservedQuantity: inventory.reservedQuantity,
          reorderPoint: inventory.reorderPoint,
          suggestedQuantity: inventory.reorderQuantity,
        },
      })
    }
  }
}
