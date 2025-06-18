import { CreateUserDto, UpdateUserDto, UpdateProfileDto } from '#user/types/user'
import User from '#user/models/user'
import { inject } from '@adonisjs/core'
import RegistrationService from '#auth/services/registration_service'
import { Exception } from '@adonisjs/core/exceptions'
import RoleService from '#role/services/role_service'
import jwt from 'jsonwebtoken'
import env from '#start/env'
import mail from '@adonisjs/mail/services/main'
import SetPasswordNotification from '#mails/set_password_notification'

@inject()
export default class UserService {
  constructor(protected roleService: RoleService) {}

  async createUser(user: CreateUserDto) {
    const newUser = await User.create({
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      password: 'default',
    })

    await newUser.related('profile').create({})

    if (user.tenantId) {
      await newUser.related('tenants').attach([user.tenantId])

      await this.roleService.assignRolesToUser({
        userId: newUser.id,
        tenantId: user.tenantId,
        roles: user.roles,
      })
    }

    await newUser.load((loader) => {
      loader.load('roles', (rolesQuery) => {
        rolesQuery.preload('permissions')
      })
      loader.load('profile')
    })

    // Generate JWT token to set a new passw
    const setPassordToken = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
      },
      env.get('JWT_SET_PASSWORD'),
      { expiresIn: '1h' }
    )

    const setPasswordEmail = new SetPasswordNotification(newUser, setPassordToken)

    await mail.sendLater(setPasswordEmail)
  }

  async updateUser(userData: UpdateUserDto, tenantId: number) {
    const user = await User.query()
      .where('id', userData.id)
      .whereHas('tenants', (query) => {
        query.where('tenant_id', tenantId)
      })
      .first()

    if (!user) {
      throw new Exception('User not found', {
        status: 404,
        code: 'USER_NOT_FOUND',
      })
    }
    console.table(userData)

    await user.merge(userData).save()

    // Update the related records in other tables (roles, profile?)
    await this.roleService.assignRolesToUser({
      userId: user.id,
      tenantId: tenantId,
      roles: userData.roles || [],
    })

    return user
  }

  async deleteUser(id: number, tenantId: number) {
    const user = await User.query()
      .where('id', id)
      .whereHas('tenants', (query) => {
        query.where('tenant_id', tenantId)
      })
      .first()

    if (!user) {
      throw new Exception('User not found', {
        status: 404,
        code: 'USER_NOT_FOUND',
      })
    }
    await user.delete()
  }

  async getUser(id: number, tenantId: number) {
    const user = await User.query()
      .where('id', id)
      .whereHas('tenants', (query) => {
        query.where('tenant_id', tenantId)
      })
      .preload('roles')
      .preload('profile')
      .first()

    if (!user) {
      throw new Exception('User not found', {
        status: 404,
        code: 'USER_NOT_FOUND',
      })
    }

    return user
  }

  async getUsers(tenantId: number) {
    const users = await User.query()
      .whereHas('tenants', (query) => {
        query.where('tenant_id', tenantId)
      })
      .preload('roles')
      .preload('profile')

    return users
  }

  async getProfile(userId: number, tenantId: number) {
    const user = await User.query()
      .where('id', userId)
      .whereHas('tenants', (query) => {
        query.where('tenant_id', tenantId)
      })
      .preload('profile')
      .preload('addresses', (query) => {
        query.orderBy('is_default', 'asc')
      }).first

    if (!user) {
      throw new Exception('User not found', {
        status: 404,
        code: 'USER_NOT_FOUND',
      })
    }

    return user
  }

  async updateProfile(userData: Partial<UpdateProfileDto>, userId: number, tenantId: number) {
    const user = await User.query()
      .where('id', userId)
      .whereHas('tenants', (query) => {
        query.where('tenant_id', tenantId)
      })
      .preload('profile')
      .first()

    if (!user) {
      throw new Exception('User not found', {
        status: 404,
        code: 'USER_NOT_FOUND',
      })
    }

    // Update basic user info
    const userUpdates: Partial<User> = {}
    if (userData.firstName) userUpdates.firstName = userData.firstName
    if (userData.lastName) userUpdates.lastName = userData.lastName

    if (Object.keys(userUpdates).length > 0) {
      await user.merge(userUpdates).save()
    }

    // Update or create profile
    const profileData = {
      bio: userData.bio,
      phone: userData.phone,
      website: userData.website,
    }

    if (user.profile) {
      await user.profile.merge(profileData).save()
    } else {
      await user.related('profile').create(profileData)
    }

    await user.load('profile')
    return user
  }

  async getUsersWithRole(role: string, tenantId?: number) {
    const users = await User.query()
      .whereHas('tenants', (query_) => {
        query_.where((query) => {
          query.whereNull('tenant_id')
          if (tenantId) {
            query.orWhere('tenant_id', tenantId)
          }
        })
      })
      .preload('roles')
      .whereHas('roles', (q) => q.where('name', role))

    return users
  }
}
