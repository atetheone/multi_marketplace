import { test } from '@japa/runner'
import User from '#user/models/user'
import Tenant from '#tenant/models/tenant'
import Notification from '#notification/models/notification'
import hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'

const NOTIFICATIONS_ROUTE = '/api/v1/notifications'

test.group('Notifications API', (group) => {
  let testUser: User
  let otherUser: User
  let testTenant: Tenant
  let authToken: string
  let otherUserToken: string

  group.setup(async () => {
    // Create test tenant
    testTenant = await Tenant.create({
      name: 'Test Notification Store',
      slug: 'test-notification-store',
      domain: 'notification.local',
      status: 'active',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    // Create test users
    const hashedPassword = await hash.make('password123')
    testUser = await User.create({
      username: 'notificationtest',
      email: 'notificationtest@example.com',
      password: hashedPassword,
      firstName: 'Notification',
      lastName: 'Tester',
      tenantId: testTenant.id,
      status: 'active',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    otherUser = await User.create({
      username: 'otheruser',
      email: 'otheruser@example.com',
      password: hashedPassword,
      firstName: 'Other',
      lastName: 'User',
      tenantId: testTenant.id,
      status: 'active',
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })
  })

  group.teardown(async () => {
    // Clean up test data
    await Notification.query().whereIn('user_id', [testUser.id, otherUser.id]).delete()
    await User.query().whereIn('id', [testUser.id, otherUser.id]).delete()
    await Tenant.query().where('id', testTenant.id).delete()
  })

  group.each.setup(async ({ client }) => {
    // Login before each test
    const loginResponse = await client
      .post('/api/v1/auth/login')
      .json({
        email: 'notificationtest@example.com',
        password: 'password123',
      })
      .header('X-Tenant-Slug', testTenant.slug)

    authToken = loginResponse.body().token.token

    // Login other user
    const otherLoginResponse = await client
      .post('/api/v1/auth/login')
      .json({
        email: 'otheruser@example.com',
        password: 'password123',
      })
      .header('X-Tenant-Slug', testTenant.slug)

    otherUserToken = otherLoginResponse.body().token.token
  })

  group.each.teardown(async () => {
    // Clean up notification data after each test
    await Notification.query().whereIn('user_id', [testUser.id, otherUser.id]).delete()
  })

  test('should get user notifications', async ({ client, assert }) => {
    // Create test notifications
    const notification1 = await Notification.create({
      userId: testUser.id,
      type: 'order_status',
      title: 'Order Status Update',
      message: 'Your order has been processed',
      data: { orderId: 123, status: 'processing' },
      isRead: false,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    const notification2 = await Notification.create({
      userId: testUser.id,
      type: 'promotion',
      title: 'Special Offer',
      message: 'Get 20% off on your next order',
      data: { discount: 20, code: 'SAVE20' },
      isRead: true,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    const response = await client
      .get(NOTIFICATIONS_ROUTE)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)
    assert.isArray(response.body().data)
    assert.equal(response.body().data.length, 2)
    
    // Verify notifications are sorted by creation date (newest first)
    assert.equal(response.body().data[0].id, notification2.id)
    assert.equal(response.body().data[1].id, notification1.id)
  })

  test('should get unread notifications count', async ({ client, assert }) => {
    // Create test notifications
    await Notification.createMany([
      {
        userId: testUser.id,
        type: 'order_status',
        title: 'Unread Notification 1',
        message: 'First unread message',
        data: {},
        isRead: false,
        createdAt: DateTime.local(),
        updatedAt: DateTime.local(),
      },
      {
        userId: testUser.id,
        type: 'order_status',
        title: 'Unread Notification 2',
        message: 'Second unread message',
        data: {},
        isRead: false,
        createdAt: DateTime.local(),
        updatedAt: DateTime.local(),
      },
      {
        userId: testUser.id,
        type: 'promotion',
        title: 'Read Notification',
        message: 'This is read',
        data: {},
        isRead: true,
        createdAt: DateTime.local(),
        updatedAt: DateTime.local(),
      },
    ])

    const response = await client
      .get(`${NOTIFICATIONS_ROUTE}/unread`)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)
    assert.equal(response.body().data.count, 2)
  })

  test('should get single notification by id', async ({ client, assert }) => {
    const notification = await Notification.create({
      userId: testUser.id,
      type: 'system',
      title: 'System Notification',
      message: 'System maintenance scheduled',
      data: { maintenanceDate: '2024-01-01T00:00:00Z' },
      isRead: false,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    const response = await client
      .get(`${NOTIFICATIONS_ROUTE}/${notification.id}`)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)
    assert.equal(response.body().data.id, notification.id)
    assert.equal(response.body().data.title, notification.title)
    assert.equal(response.body().data.message, notification.message)
    assert.deepEqual(response.body().data.data, notification.data)
  })

  test('should not access notification from different user', async ({ client }) => {
    // Create notification for other user
    const otherNotification = await Notification.create({
      userId: otherUser.id,
      type: 'private',
      title: 'Private Notification',
      message: 'This is private',
      data: {},
      isRead: false,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    // Try to access with different user
    const response = await client
      .get(`${NOTIFICATIONS_ROUTE}/${otherNotification.id}`)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(404)
  })

  test('should mark notification as read', async ({ client, assert }) => {
    const notification = await Notification.create({
      userId: testUser.id,
      type: 'reminder',
      title: 'Reminder Notification',
      message: 'You have pending tasks',
      data: {},
      isRead: false,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    const response = await client
      .patch(`${NOTIFICATIONS_ROUTE}/${notification.id}/read`)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)
    assert.equal(response.body().data.isRead, true)
    assert.exists(response.body().data.readAt)

    // Verify in database
    await notification.refresh()
    assert.isTrue(notification.isRead)
    assert.exists(notification.readAt)
  })

  test('should not mark other user notification as read', async ({ client }) => {
    // Create notification for other user
    const otherNotification = await Notification.create({
      userId: otherUser.id,
      type: 'restricted',
      title: 'Restricted Notification',
      message: 'Cannot mark as read',
      data: {},
      isRead: false,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    // Try to mark as read with different user
    const response = await client
      .patch(`${NOTIFICATIONS_ROUTE}/${otherNotification.id}/read`)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(404)
  })

  test('should mark all notifications as read', async ({ client, assert }) => {
    // Create multiple unread notifications
    const notifications = await Notification.createMany([
      {
        userId: testUser.id,
        type: 'batch1',
        title: 'Batch Notification 1',
        message: 'First batch message',
        data: {},
        isRead: false,
        createdAt: DateTime.local(),
        updatedAt: DateTime.local(),
      },
      {
        userId: testUser.id,
        type: 'batch2',
        title: 'Batch Notification 2',
        message: 'Second batch message',
        data: {},
        isRead: false,
        createdAt: DateTime.local(),
        updatedAt: DateTime.local(),
      },
      {
        userId: testUser.id,
        type: 'batch3',
        title: 'Batch Notification 3',
        message: 'Third batch message',
        data: {},
        isRead: false,
        createdAt: DateTime.local(),
        updatedAt: DateTime.local(),
      },
    ])

    const response = await client
      .patch(`${NOTIFICATIONS_ROUTE}/read-all`)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)
    assert.exists(response.body().data.updated)
    assert.isAbove(response.body().data.updated, 0)

    // Verify all notifications are marked as read
    const updatedNotifications = await Notification.query()
      .where('user_id', testUser.id)
      .whereIn('id', notifications.map(n => n.id))

    updatedNotifications.forEach(notification => {
      assert.isTrue(notification.isRead)
      assert.exists(notification.readAt)
    })
  })

  test('should filter notifications by type', async ({ client, assert }) => {
    // Create notifications of different types
    await Notification.createMany([
      {
        userId: testUser.id,
        type: 'order_status',
        title: 'Order Update',
        message: 'Order status changed',
        data: {},
        isRead: false,
        createdAt: DateTime.local(),
        updatedAt: DateTime.local(),
      },
      {
        userId: testUser.id,
        type: 'promotion',
        title: 'Promotion Alert',
        message: 'New promotion available',
        data: {},
        isRead: false,
        createdAt: DateTime.local(),
        updatedAt: DateTime.local(),
      },
      {
        userId: testUser.id,
        type: 'order_status',
        title: 'Another Order Update',
        message: 'Another order status changed',
        data: {},
        isRead: false,
        createdAt: DateTime.local(),
        updatedAt: DateTime.local(),
      },
    ])

    const response = await client
      .get(NOTIFICATIONS_ROUTE)
      .qs({ type: 'order_status' })
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)
    assert.isArray(response.body().data)
    assert.equal(response.body().data.length, 2)
    
    // All returned notifications should be of type 'order_status'
    const allOrderStatus = response.body().data.every((notification: any) => 
      notification.type === 'order_status'
    )
    assert.isTrue(allOrderStatus)
  })

  test('should filter notifications by read status', async ({ client, assert }) => {
    // Create read and unread notifications
    await Notification.createMany([
      {
        userId: testUser.id,
        type: 'test',
        title: 'Unread Notification',
        message: 'This is unread',
        data: {},
        isRead: false,
        createdAt: DateTime.local(),
        updatedAt: DateTime.local(),
      },
      {
        userId: testUser.id,
        type: 'test',
        title: 'Read Notification',
        message: 'This is read',
        data: {},
        isRead: true,
        readAt: DateTime.local(),
        createdAt: DateTime.local(),
        updatedAt: DateTime.local(),
      },
    ])

    const response = await client
      .get(NOTIFICATIONS_ROUTE)
      .qs({ isRead: false })
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)
    assert.isArray(response.body().data)
    assert.equal(response.body().data.length, 1)
    assert.equal(response.body().data[0].isRead, false)
  })

  test('should paginate notifications', async ({ client, assert }) => {
    // Create multiple notifications
    const notificationPromises = Array.from({ length: 15 }, (_, index) =>
      Notification.create({
        userId: testUser.id,
        type: 'pagination_test',
        title: `Notification ${index + 1}`,
        message: `Message ${index + 1}`,
        data: {},
        isRead: false,
        createdAt: DateTime.local().minus({ minutes: index }),
        updatedAt: DateTime.local(),
      })
    )

    await Promise.all(notificationPromises)

    const response = await client
      .get(NOTIFICATIONS_ROUTE)
      .qs({ page: 1, limit: 10 })
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)
    assert.isArray(response.body().data)
    assert.equal(response.body().data.length, 10)
    assert.exists(response.body().meta)
    assert.equal(response.body().meta.total, 15)
    assert.equal(response.body().meta.currentPage, 1)
  })

  test('should require authentication', async ({ client }) => {
    const response = await client
      .get(NOTIFICATIONS_ROUTE)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(401)
  })

  test('should require valid tenant', async ({ client }) => {
    const response = await client
      .get(NOTIFICATIONS_ROUTE)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', 'invalid-tenant')

    response.assertStatus(404)
  })

  test('should handle non-existent notification', async ({ client }) => {
    const response = await client
      .get(`${NOTIFICATIONS_ROUTE}/99999`)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(404)
  })

  test('should validate notification data structure', async ({ client, assert }) => {
    const notification = await Notification.create({
      userId: testUser.id,
      type: 'complex_data',
      title: 'Complex Data Notification',
      message: 'Notification with complex data',
      data: {
        orderId: 123,
        items: [
          { productId: 1, name: 'Product 1', quantity: 2 },
          { productId: 2, name: 'Product 2', quantity: 1 },
        ],
        total: 99.99,
        metadata: {
          source: 'order_system',
          priority: 'high',
        },
      },
      isRead: false,
      createdAt: DateTime.local(),
      updatedAt: DateTime.local(),
    })

    const response = await client
      .get(`${NOTIFICATIONS_ROUTE}/${notification.id}`)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)
    assert.exists(response.body().data.data)
    assert.equal(response.body().data.data.orderId, 123)
    assert.isArray(response.body().data.data.items)
    assert.equal(response.body().data.data.items.length, 2)
    assert.exists(response.body().data.data.metadata)
  })

  test('should handle empty notifications list', async ({ client, assert }) => {
    const response = await client
      .get(NOTIFICATIONS_ROUTE)
      .header('Authorization', `Bearer ${authToken}`)
      .header('X-Tenant-Slug', testTenant.slug)

    response.assertStatus(200)
    assert.isArray(response.body().data)
    assert.equal(response.body().data.length, 0)
  })
})