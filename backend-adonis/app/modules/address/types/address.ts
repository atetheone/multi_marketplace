export interface AddressDto {
  type: 'shipping' | 'billing'
  addressLine1: string
  addressLine2?: string
  city: string
  state?: string
  country: string
  postalCode?: string
  phone?: string
  isDefault: boolean
  zoneId: number
}

export interface CreateAddressDto extends AddressDto {
}

export interface UpdateAddressDto extends Partial<AddressDto> {
  type?: 'shipping' | 'billing'
}
