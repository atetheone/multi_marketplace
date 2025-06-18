export interface RegistrationUserDto {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
  roles?: number[]
}
