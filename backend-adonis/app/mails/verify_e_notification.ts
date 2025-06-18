import { BaseMail } from '@adonisjs/mail'
import User from '#user/models/user'
import env from '#start/env'

export default class VerifyENotification extends BaseMail {
  from = 'noreply@atetheone.me'
  subject = 'Please verify your email'

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
    const path = `/verify/${this.token}`
    const url = `${domain}${path}`
    const mailTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Verify Your Account</h2>
        <p>Hello ${this.user.firstName},</p>
        <p>Thank you for registering. Please verify your email address by clicking the link below:</p>
        <p>
          <a href="${url}" 
            style="display: inline-block; 
                    padding: 10px 20px; 
                    background-color: #4CAF50; 
                    color: white; 
                    text-decoration: none; 
                    border-radius: 5px;">
            Verify Email
          </a>
        </p>
        <p>If the button doesn't work, copy and paste this link in your browser:</p>
        <p>${url}</p>
        <p>This link will expire in 1 hour.</p>
        <small>If you didn't create an account, please ignore this email.</small>
      </div>
    `
    this.message.subject(this.subject).from(this.from).to(this.user.email).html(mailTemplate)
  }
}
