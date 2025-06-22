import { defineConfig } from '@adonisjs/cors'
import env from '#start/env'

/**
 * Configuration options to tweak the CORS policy. The following
 * options are documented on the official documentation website.
 *
 * https://docs.adonisjs.com/guides/security/cors
 */
const corsConfig = defineConfig({
  enabled: true,
  // SECURITY FIX: Only allow specific origins instead of true (any origin)
  origin: [
    env.get('DOMAIN_CLIENT'),
    'http://localhost:4200',
    'http://localhost:3000',
    // Add production domains here
  ].filter(Boolean),
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH'],
  headers: true,
  exposeHeaders: [],
  credentials: true,
  maxAge: 90,
})

export default corsConfig
