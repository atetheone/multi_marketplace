import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () => import('#auth/controllers/auth_controller')
const RegistrationController = () => import('#auth/controllers/registration_controller')

router
  .group(() => {
    router.post('/register-user', [RegistrationController, 'registerUser'])
    router.post('/forgot-password', [RegistrationController, 'forgotPassword'])
    router.post('/login', [AuthController, 'login'])
    router.post('/logout', [AuthController, 'logout'])
    // router.post('/refresh', [AuthController, 'refreshToken'])
    router.get('/me', [AuthController, 'me']).use(middleware.auth({ guards: ['jwt'] }))
  })
  .prefix('/api/v1/auth')
  .use(middleware.checkTenant())

router.put('/set-password/:token', [RegistrationController, 'setPassword']).prefix('/api/v1/auth')
router.get('/verify/:token', [RegistrationController, 'verify']).prefix('/api/v1/auth')

export { router as authRouter }
