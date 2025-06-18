import { BaseMail } from '@adonisjs/mail'
import User from '#user/models/user'
import env from '#start/env'

export default class SetPasswordNotification extends BaseMail {
  from = 'noreply@atetheone.me'
  subject = 'Please Set Your Password'

  constructor(
    private user: User,
    private token: string
  ) {
    super()
  }

  /**
   * The "prepare" method is called automatically when
   * the email is sent or queued.
   */
  prepare() {
    const domain = env.get('DOMAIN_CLIENT')
    const path = `/set-password/${this.token}`
    const url = `${domain}${path}`
    this.message.subject(this.subject).from(this.from).to(this.user.email).html(`
      <p>Hello ${this.user.firstName},</p>
      <p>Please click the following link to set your password:</p>
      <p><a href="${url}">Set your password</a></p>
      <p>If you did not create an account, no further action is required.</p>
      <p>Thank you!</p>
    `)
  }
}
