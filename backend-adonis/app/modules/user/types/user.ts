export interface UserDto {
  email: string
  username: string
  password: string
  firstName: string
  lastName: string
  roles: number[]
  tenantId?: number
}

export interface UserProfileDto {
  firstName: string
  lastName: string
  bio: string
  phone: string
  avatar_url: string
  website?: string
  socialLinks: SocialLinks
}

export interface CreateUserDto {
  email: string
  username: string
  password?: string
  firstName: string
  lastName: string
  status?: string
  roles: number[]
  tenantId?: number
}

export interface UpdateUserDto extends Partial<CreateUserDto> {
  id: number
}

export interface UpdateProfileDto {
  firstName?: string
  lastName?: string
  bio?: string
  phone?: string
  avatarUrl?: string
  website?: string
}

export interface SocialLinks {
  linkedin?: string
  twitter?: string
  facebook?: string
  github?: string
  [key: string]: string | undefined
}
