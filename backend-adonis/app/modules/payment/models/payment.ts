import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon';
import Order from '#order/models/order';

export default class Payment extends BaseModel {
  @column({ isPrimary: true, isIncrement: true })
  declare id: number;

  @column()
  declare orderId: number;

  @column()
  declare paymentMethod: string;

  @column()
  declare amount: number;

  @column()
  declare status: string; // e.g., 'success', 'failed', 'pending', 'refunded'

  @column()
  declare transactionId: string | null;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime;

  @belongsTo(() => Order)
  declare order: BelongsTo<typeof Order>;
}
