export interface CartItemDto {
  productId: number
  quantity: number
}

export interface CreateCartDto {
  userId: number
  tenantId: number
  items: CartItemDto[]
}

export interface UpdateCartItemDto {
  quantity: number
}
