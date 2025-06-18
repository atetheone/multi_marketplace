/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

// Import routes from other files
import '#role/routes/role_routes'
import '#role/routes/permission_routes'
import '#role/routes/resource_routes'
import '#tenant/routes/tenant_routes'
import '#tenant/routes/market_routes'
import '#user/routes/user_routes'
import '#address/routes/address_routes'
import '#address/routes/zone_routes'
import '#auth/routes/auth_routes'
import '#navigation/routes/menu_item_routes'
import '#product/routes/product_routes'
import '#product/routes/category_routes'
import '#cart/routes/cart_routes'
import '#order/routes/order_routes'
import '#notification/routes/notification_routes'
import '#deliveries/routes/delivery_routes'
import '#deliveries/routes/delivery_person_routes'

router.get('/', async () => {
  return {
    message: 'Welcome to my multitenant app',
  }
})
