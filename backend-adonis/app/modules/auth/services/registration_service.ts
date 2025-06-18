import { RegistrationUserDto } from '#auth/types/registration_user'
import User from '#user/models/user'
import RoleService from '#role/services/role_service'
import { NotificationRolesService } from '#notification/services/notification_roles_service'
import { NotificationService } from '#notification/services/notification_service'
import { inject } from '@adonisjs/core'
import jwt from 'jsonwebtoken'
import env from '#start/env'
import mail from '@adonisjs/mail/services/main'
import VerifyENotification from '#mails/verify_e_notification'
import { Exception } from '@adonisjs/core/exceptions'
import SetPasswordNotification from '#mails/set_password_notification'

@inject()
export default class RegistrationService {
  constructor(
    protected roleService: RoleService,
    protected notificationRolesService: NotificationRolesService,
    protected notificationService: NotificationService
  ) {}

  public async registerUser(user: RegistrationUserDto, tenantId: number) {
    // check if username is already taken
    const existingUser = await User.query()
      .where('username', user.username)
      .whereHas('tenants', (query) => {
        query.where('tenant_id', tenantId)
      })
      .first()

    if (existingUser) {
      throw new Exception('Username already taken', {
        code: 'USERNAME_CONFLICT',
        status: 409,
      })
    }

    // check if email is already taken
    const existingEmail = await User.query()
      .where('email', user.email)
      .whereHas('tenants', (query) => {
        query.where('tenant_id', tenantId)
      })
      .first()

    if (existingEmail) {
      throw new Exception('Email already taken', {
        code: 'EMAIL_CONFLICT',
        status: 409,
      })
    }

    // create the user
    const newUser = await User.create({
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      password: user.password,
    })


    await newUser.related('tenants').attach([tenantId])

    // Assign the user role to the new user
    await this.roleService.assignRolesToUser({
      userId: newUser.id,
      tenantId: tenantId,
      roles: user.roles ?? [],
    })

    await newUser.load('roles', (rolesQuery) => {
      rolesQuery
        .preload('permissions', (permissionsQuery: any) => {
          permissionsQuery.select(['resource', 'action'])
        })
        .select(['name'])
    })

    // Notify admins about new user registration
    await this.notificationRolesService.notifyRoles({
      type: 'user:registered',
      title: 'New User Registration',
      message: `${newUser.firstName} ${newUser.lastName} has registered as ${user.roles?.join(', ') || 'user'}`,
      tenantId,
      data: {
        userId: newUser.id,
        username: newUser.username,
        email: newUser.email,
        roles: user.roles,
        permissions: newUser.roles.flatMap(role => 
          role.permissions.map(p => `${p.resource}:${p.action}`)
        )
      }
    })

    // Notify the new user
    await this.notificationService.createNotification({
      type: 'user:welcome',
      title: 'Welcome to the Platform',
      message: `Welcome ${newUser.firstName}! Your account has been created successfully.`,
      userId: newUser.id,
      tenantId,
      data: {
        roles: user.roles,
        permissions: newUser.roles.flatMap(role => 
          role.permissions.map(p => `${p.resource}:${p.action}`)
        )
      }
    })

    await this.sendMail(newUser)

    return newUser
  }

  async verifyAccount(token: string) {
    const decoded = await this.validateToken(token, env.get('JWT_EMAIL_VERIFY'))
    const user = await this.validateAndGetUser(decoded.userId)

    user.status = 'active'
    await user.save()
  }

  async resendVerificationEmail(expiredToken: string) {
    const decoded = await this.validateToken(expiredToken, env.get('JWT_EMAIL_VERIFY'), true)
    const user = await this.validateAndGetUser(decoded.userId)

    await this.sendMail(user)

    return { message: 'Verification email resent successfully' }
  }

  async setPassword(password: string, token: string) {
    const decoded = jwt.verify(token, env.get('JWT_SET_PASSWORD')) as any

    const user = await User.findOrFail(decoded.userId!)

    if (!user) {
      throw new Exception('Token invalid', {
        code: 'INVALID_TOKEN',
        status: 400,
      })
    }

    await user.merge({ password: password }).save()
  }

  private async validateToken(token: string, secret: string, allowExpired = false) {
    if (!token) {
      throw new Exception('Token is required', {
        code: 'TOKEN_REQUIRED',
        status: 400,
      })
    }

    try {
      // Use decode if we're allowing expired tokens (for resend), otherwise verify
      const decoded = allowExpired ? jwt.decode(token) : jwt.verify(token, secret)

      if (!decoded || !decoded.userId || !decoded.email) {
        throw new Exception('Invalid token format', {
          code: 'TOKEN_INVALID',
          status: 400,
        })
      }

      return decoded
    } catch (error) {
      if (error.name === 'TokenExpiredError' && !allowExpired) {
        throw new Exception('Verification token has expired', {
          code: 'TOKEN_EXPIRED',
          status: 400,
        })
      }
      throw new Exception('Invalid verification token', {
        code: 'TOKEN_INVALID',
        status: 400,
      })
    }
  }

  private async validateAndGetUser(userId: number) {
    const user = await User.find(userId)
    if (!user) {
      throw new Exception('User not found', {
        code: 'USER_NOT_FOUND',
        status: 404,
      })
    }

    if (user.status === 'active') {
      throw new Exception('Account already verified', {
        code: 'ALREADY_VERIFIED',
        status: 400,
      })
    }

    return user
  }

  private async sendMail(newUser: User) {
    // Generate JWT token for email verification
    const verificationToken = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      env.get('JWT_EMAIL_VERIFY'),
      { expiresIn: '1h' }
    )

    const verifyEmail = new VerifyENotification(newUser, verificationToken)

    // send email verification
    await mail.sendLater(verifyEmail)
  }

  async forgotPassword(email: string) {
    const user = await User.findBy('email', email)

    if (!user) {
      // Return success even if user not found to prevent email enumeration
      return
    }

    // Generate reset token
    const token = jwt.sign({ userId: user.id }, env.get('JWT_SET_PASSWORD'), { expiresIn: '1h' })

    // Send password reset 
    const resetPass = new SetPasswordNotification(user, token)
    await mail.sendLater(resetPass)
  }
}
