import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Tenant from '#tenant/models/tenant'

export default class extends BaseSeeder {
  async run() {
    // Create the default marketplace tenant first (ID: 1)
    const defaultTenant = await Tenant.create({
      name: 'JefJel Marketplace',
      slug: 'default',
      domain: 'jefjel.sn',
      description: 'Marketplace principal du Sénégal - Plateforme centrale JefJel',
      isActive: true,
      contactEmail: 'admin@jefjel.sn',
      contactPhone: '+221 77 000 00 00',
      settings: {
        currency: 'XOF', // Franc CFA
        timezone: 'Africa/Dakar',
        language: 'fr',
        features: ['multi-vendor', 'deliveries', 'inventory', 'notifications', 'mobile-money'],
        paymentMethods: ['orange-money', 'wave', 'free-money', 'cash', 'bank-transfer'],
        isMarketplace: true,
      },
      branding: {
        primaryColor: '#e74c3c', // Red for marketplace
        secondaryColor: '#2c3e50',
        logo: '/logos/jefjel-marketplace.png',
      },
    })

    // Create additional demo tenants (sub-stores on the marketplace)
    await Tenant.createMany([
      {
        name: 'Dakar Express',
        slug: 'dakar-express',
        domain: 'dakar-express.jefjel.sn',
        description: 'Service de livraison rapide à Dakar et banlieue',
        isActive: true,
        contactEmail: 'contact@dakar-express.jefjel.sn',
        contactPhone: '+221 77 123 45 67',
        settings: {
          currency: 'XOF',
          timezone: 'Africa/Dakar',
          language: 'fr',
          features: ['deliveries', 'inventory', 'notifications', 'mobile-money'],
          paymentMethods: ['orange-money', 'wave', 'free-money', 'cash'],
        },
        branding: {
          primaryColor: '#ff6b35', // Orange Senegal inspired
          secondaryColor: '#2c3e50',
          logo: '/logos/dakar-express.png',
        },
      },
      {
        name: 'Teranga Market',
        slug: 'teranga-market',
        domain: 'teranga.jefjel.sn',
        description: 'Produits traditionnels et artisanaux sénégalais',
        isActive: true,
        contactEmail: 'info@teranga.jefjel.sn',
        contactPhone: '+221 78 987 65 43',
        settings: {
          currency: 'XOF',
          timezone: 'Africa/Dakar',
          language: 'fr',
          features: ['deliveries', 'inventory', 'notifications', 'artisan-products'],
          paymentMethods: ['orange-money', 'wave', 'cash'],
        },
        branding: {
          primaryColor: '#27ae60', // Green for traditional markets
          secondaryColor: '#8b4513',
          logo: '/logos/teranga-market.png',
        },
      },
    ])

    console.log('✅ Default JefJel marketplace tenant (ID: 1) and demo tenants created successfully')
    console.log(`📍 Default tenant ID: ${defaultTenant.id}`)
    console.log(`🌐 Main domain: jefjel.sn`)
  }
}