export interface UpdateDeliveryPersonDto {
  vehicleType: string
  vehiclePlateNumber: string
  vehicleModel: string
  vehicleYear: number
  licenseNumber: string
  licenseExpiry: string
  licenseType: string
  zoneIds?: number[]
  isActive: boolean
  isAvailable: boolean
}
