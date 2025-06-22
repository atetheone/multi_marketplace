import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Resource from '#role/models/resource'

export default class extends BaseSeeder {
  async run() {
    // Global resources (tenant_id = null) - available to all tenants
    await Resource.createMany([
      {
        name: 'users',
        description: 'Gestion des utilisateurs',
        isActive: true,
        availableActions: ['create', 'read', 'update', 'delete', 'activate', 'deactivate'],
        tenantId: null, // Global resource
      },
      {
        name: 'products',
        description: 'Gestion des produits',
        isActive: true,
        availableActions: ['create', 'read', 'update', 'delete', 'publish', 'unpublish'],
        tenantId: null,
      },
      {
        name: 'orders',
        description: 'Gestion des commandes',
        isActive: true,
        availableActions: ['create', 'read', 'update', 'delete', 'process', 'cancel'],
        tenantId: null,
      },
      {
        name: 'deliveries',
        description: 'Gestion des livraisons',
        isActive: true,
        availableActions: ['create', 'read', 'update', 'delete', 'assign', 'track'],
        tenantId: null,
      },
      {
        name: 'payments',
        description: 'Gestion des paiements',
        isActive: true,
        availableActions: ['read', 'process', 'refund', 'verify'],
        tenantId: null,
      },
      {
        name: 'inventory',
        description: 'Gestion des stocks',
        isActive: true,
        availableActions: ['read', 'update', 'adjust', 'count'],
        tenantId: null,
      },
      {
        name: 'categories',
        description: 'Gestion des catégories',
        isActive: true,
        availableActions: ['create', 'read', 'update', 'delete'],
        tenantId: null,
      },
      {
        name: 'delivery_zones',
        description: 'Gestion des zones de livraison',
        isActive: true,
        availableActions: ['create', 'read', 'update', 'delete'],
        tenantId: null,
      },
      {
        name: 'notifications',
        description: 'Gestion des notifications',
        isActive: true,
        availableActions: ['create', 'read', 'update', 'delete', 'send'],
        tenantId: null,
      },
      {
        name: 'reports',
        description: 'Rapports et analytics',
        isActive: true,
        availableActions: ['read', 'export', 'generate'],
        tenantId: null,
      },
      {
        name: 'settings',
        description: 'Paramètres système',
        isActive: true,
        availableActions: ['read', 'update'],
        tenantId: null,
      },
    ])

    console.log('✅ Global resources created successfully')
  }
}