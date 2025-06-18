export interface OrderItemDto {
  productId: number
  quantity: number
  unitPrice: number
}

export interface CreateOrderDto {
  shippingAddress: {
    addressLine1: string
    addressLine2?: string
    city: string
    state?: string
    country: string
    postalCode?: string
    phone?: string
    isDefault?: boolean
    zoneId: number
  }
  cartId: number
  paymentMethod: string
}

export interface UpdateOrderStatusDto {
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned'
}

export interface UpdateOrderPaymentStatusDto {
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
}
