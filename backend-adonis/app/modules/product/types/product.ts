export interface CreateProductDto {
  name: string
  description: string
  price: number
  sku: string
  stock: number
  isActive?: boolean
  categoryIds: number[]
}

export interface UpdateProductDto extends CreateProductDto {
  id: number
}

export interface Product extends CreateProductDto {
  id: number
  createdAt: Date
  updatedAt: Date
}
