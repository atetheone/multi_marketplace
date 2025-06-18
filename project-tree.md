# Project Structure

## Backend
```
├── app/
│   ├── exceptions/
│   │   └── handler.ts
│   ├── guard/
│   │   ├── config.ts
│   │   ├── jwt.ts
│   │   └── jwt_types.ts
│   ├── mails/
│   │   ├── set_password_notification.ts
│   │   └── verify_e_notification.ts
│   ├── middleware/
│   │   ├── auth_middleware.ts
│   │   ├── check_tenant_middleware.ts
│   │   ├── container_bindings_middleware.ts
│   │   ├── force_json_response_middleware.ts
│   │   ├── guest_middleware.ts
│   │   ├── permission_middleware.ts
│   │   ├── role_middleware.ts
│   │   └── silent_auth_middleware.ts
│   ├── modules/
│   │   ├── address/
│   │   │   ├── controllers/
│   │   │   │   ├── address_controller.ts
│   │   │   │   └── delivery_zone_controller.ts
│   │   │   ├── models/
│   │   │   │   ├── address.ts
│   │   │   │   └── delivery_zone.ts
│   │   │   ├── routes/
│   │   │   │   └── address_routes.ts
│   │   │   ├── services/
│   │   │   │   ├── address_service.ts
│   │   │   │   └── delivery_zone_service.ts
│   │   │   ├── types/
│   │   │   │   ├── address.ts
│   │   │   │   └── delivery_zone.ts
│   │   │   └── validators/
│   │   │   │   ├── address_validator.ts
│   │   │   │   └── zone_validator.ts
│   │   ├── auth/
│   │   │   ├── controllers/
│   │   │   │   ├── auth_controller.ts
│   │   │   │   └── registration_controller.ts
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   │   └── auth_routes.ts
│   │   │   ├── services/
│   │   │   │   ├── auth_service.ts
│   │   │   │   └── registration_service.ts
│   │   │   ├── types/
│   │   │   │   ├── login_credentials.ts
│   │   │   │   ├── registration_tenant.ts
│   │   │   │   ├── registration_user.ts
│   │   │   │   └── token.ts
│   │   │   └── validators/
│   │   │   │   ├── login.ts
│   │   │   │   └── registration.ts
│   │   ├── cart/
│   │   │   ├── controllers/
│   │   │   │   ├── cart_controller.ts
│   │   │   │   └── cart_item_controller.ts
│   │   │   ├── models/
│   │   │   │   ├── cart.ts
│   │   │   │   └── cart_item.ts
│   │   │   ├── routes/
│   │   │   │   └── cart_routes.ts
│   │   │   ├── services/
│   │   │   │   └── cart_service.ts
│   │   │   ├── types/
│   │   │   │   └── cart.ts
│   │   │   └── validators/
│   │   │   │   └── cart.ts
│   │   ├── navigation/
│   │   │   ├── contracts/
│   │   │   │   └── request.ts
│   │   │   ├── controllers/
│   │   │   │   └── menu_item_controller.ts
│   │   │   ├── models/
│   │   │   │   └── menu_item.ts
│   │   │   ├── routes/
│   │   │   │   └── menu_item_routes.ts
│   │   │   ├── services/
│   │   │   │   └── menu_item_service.ts
│   │   │   ├── types/
│   │   │   │   └── menu_item.ts
│   │   │   └── validators/
│   │   │   │   └── menu_item_validator.ts
│   │   ├── order/
│   │   │   ├── controllers/
│   │   │   │   └── order_controller.ts
│   │   │   ├── models/
│   │   │   │   ├── order.ts
│   │   │   │   └── order_item.ts
│   │   │   ├── routes/
│   │   │   │   └── order_routes.ts
│   │   │   ├── services/
│   │   │   │   └── order_service.ts
│   │   │   ├── types/
│   │   │   │   └── order.ts
│   │   │   └── validators/
│   │   │   │   └── order.ts
│   │   ├── payment/
│   │   │   ├── controllers/
│   │   │   ├── models/
│   │   │   │   └── payment.ts
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   ├── types/
│   │   │   └── validators/
│   │   ├── product/
│   │   │   ├── controllers/
│   │   │   │   ├── category_controller.ts
│   │   │   │   ├── inventory_controller.ts
│   │   │   │   └── product_controller.ts
│   │   │   ├── models/
│   │   │   │   ├── category.ts
│   │   │   │   ├── inventory.ts
│   │   │   │   ├── product.ts
│   │   │   │   └── product_image.ts
│   │   │   ├── routes/
│   │   │   │   ├── category_routes.ts
│   │   │   │   └── product_routes.ts
│   │   │   ├── services/
│   │   │   │   ├── category_service.ts
│   │   │   │   ├── inventory_service.ts
│   │   │   │   └── product_service.ts
│   │   │   ├── types/
│   │   │   │   └── product.ts
│   │   │   └── validators/
│   │   │   │   ├── category.ts
│   │   │   │   ├── inventory.ts
│   │   │   │   └── product.ts
│   │   ├── role/
│   │   │   ├── controllers/
│   │   │   │   ├── permission_controller.ts
│   │   │   │   └── role_controller.ts
│   │   │   ├── models/
│   │   │   │   ├── permission.ts
│   │   │   │   └── role.ts
│   │   │   ├── routes/
│   │   │   │   ├── permission_routes.ts
│   │   │   │   └── role_routes.ts
│   │   │   ├── services/
│   │   │   │   ├── permission_service.ts
│   │   │   │   └── role_service.ts
│   │   │   ├── types/
│   │   │   │   ├── permission.ts
│   │   │   │   └── role.ts
│   │   │   └── validators/
│   │   │   │   ├── permission_validator.ts
│   │   │   │   └── role_validator.ts
│   │   ├── tenant/
│   │   │   ├── controllers/
│   │   │   │   ├── market_controller.ts
│   │   │   │   └── tenant_controller.ts
│   │   │   ├── models/
│   │   │   │   └── tenant.ts
│   │   │   ├── routes/
│   │   │   │   ├── market_routes.ts
│   │   │   │   └── tenant_routes.ts
│   │   │   ├── services/
│   │   │   │   ├── market_service.ts
│   │   │   │   └── tenant_service.ts
│   │   │   ├── types/
│   │   │   │   └── tenant.ts
│   │   │   └── validators/
│   │   │   │   └── tenant_validator.ts
│   │   └── user/
│   │   │   ├── controllers/
│   │   │   │   └── user_controller.ts
│   │   │   ├── models/
│   │   │   │   ├── user.ts
│   │   │   │   └── user_profile.ts
│   │   │   ├── routes/
│   │   │   │   └── user_routes.ts
│   │   │   ├── services/
│   │   │   │   └── user_service.ts
│   │   │   ├── types/
│   │   │   │   └── user.ts
│   │   │   └── validators/
│   │   │   │   └── user_validator.ts
│   ├── services/
│   │   └── cloudinary_service.ts
│   └── utils/
│   │   └── api_response.ts
├── bin/
│   ├── console.ts
│   ├── server.ts
│   └── test.ts
├── commands/
│   └── make_module.ts
├── config/
│   ├── app.ts
│   ├── auth.ts
│   ├── bodyparser.ts
│   ├── cloudinary.ts
│   ├── cors.ts
│   ├── database.ts
│   ├── hash.ts
│   ├── logger.ts
│   └── mail.ts
├── database/
│   ├── factories/
│   │   ├── category_factory.ts
│   │   ├── permission_factory.ts
│   │   ├── product_factory.ts
│   │   ├── product_image_factory.ts
│   │   ├── role_factory.ts
│   │   ├── tenant_factory.ts
│   │   └── user_factory.ts
│   ├── migrations/
│   │   ├── 1731933440045_create_users_table.ts
│   │   ├── 1731933445045_create_tenants_table.ts
│   │   ├── 1731933450060_create_user_tenants_table.ts
│   │   ├── 1731934399743_create_roles_table.ts
│   │   ├── 1731934414554_create_permissions_table.ts
│   │   ├── 1731934432328_create_role_permissions_table.ts
│   │   ├── 1731947302488_create_user_roles_table.ts
│   │   ├── 1733142614520_create_menu_items_table.ts
│   │   ├── 1733143757044_create_menu_item_permissions_table.ts
│   │   ├── 1734432987657_create_products_table.ts
│   │   ├── 1734433008833_create_categories_table.ts
│   │   ├── 1734434417062_create_user_profiles_table.ts
│   │   ├── 1734435594908_create_delivery_zones_table.ts
│   │   ├── 1734435594909_create_addresses_table.ts
│   │   ├── 1734439732278_create_product_images_table.ts
│   │   ├── 1734440945400_create_users_addresses_table.ts
│   │   ├── 1734446941562_create_category_products_table.ts
│   │   ├── 1735302870119_create_inventory_table.ts
│   │   ├── 1735647020770_create_orders_table.ts
│   │   ├── 1735647020775_create_payments_table.ts
│   │   ├── 1735647493506_create_order_items_table.ts
│   │   ├── 1735819892757_create_carts_table.ts
│   │   └── 1735821040845_create_cart_items_table.ts
│   └── seeders/
│   │   ├── main_seeder.ts
│   │   ├── menu_item_seeder.ts
│   │   ├── permission_seeder.ts
│   │   ├── product_seeder.ts
│   │   ├── role_seeder.ts
│   │   ├── tenant_seeder.ts
│   │   ├── user_seeder.ts
│   │   └── zone_seeder.ts
├── start/
│   ├── env.ts
│   ├── kernel.ts
│   └── routes.ts
└── tests/
│   └── functional/
│   │   ├── auth/
│   │   │   ├── current_user.spec.ts
│   │   │   ├── login_user.spec.ts
│   │   │   └── register_user.spec.ts
│   │   ├── permissions/
│   │   │   └── create.spec.ts
│   │   ├── roles/
│   │   │   ├── create.spec.ts
│   │   │   ├── delete.spec.ts
│   │   │   ├── get.spec.ts
│   │   │   └── update.spec.ts
│   │   └── tenant/
│   └── bootstrap.ts
├── ace.js
├── adonisrc.ts
├── eslint.config.js
├── features.md
├── package.json
├── package-lock.json
└── tsconfig.json
```

## Frontend
```
├── .vscode/
│   ├── extensions.json
│   ├── launch.json
│   └── tasks.json
├── public/
│   └── assets/
│   │   └── images/
└── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── guards/
│   │   │   │   ├── admin.guard.spec.ts
│   │   │   │   ├── admin.guard.ts
│   │   │   │   ├── auth.guard.spec.ts
│   │   │   │   ├── auth.guard.ts
│   │   │   │   ├── permission.guard.spec.ts
│   │   │   │   └── permission.guard.ts
│   │   │   ├── interceptors/
│   │   │   │   ├── auth.interceptor.ts
│   │   │   │   └── tenant.interceptor.ts
│   │   │   ├── services/
│   │   │   │   ├── auth.service.spec.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── menu.service.spec.ts
│   │   │   │   ├── menu.service.ts
│   │   │   │   ├── permission.service.spec.ts
│   │   │   │   ├── permission.service.ts
│   │   │   │   ├── role.service.spec.ts
│   │   │   │   └── role.service.ts
│   │   │   └── types/
│   │   │   │   ├── address.ts
│   │   │   │   ├── api_response.ts
│   │   │   │   ├── cart.ts
│   │   │   │   ├── data_state.ts
│   │   │   │   ├── inventory.ts
│   │   │   │   ├── login_request.ts
│   │   │   │   ├── login_response.ts
│   │   │   │   ├── market.ts
│   │   │   │   ├── marketplace.ts
│   │   │   │   ├── menu.ts
│   │   │   │   ├── order.ts
│   │   │   │   ├── paginated_response.ts
│   │   │   │   ├── permission.ts
│   │   │   │   ├── product.ts
│   │   │   │   ├── role.ts
│   │   │   │   ├── tenant.ts
│   │   │   │   ├── user.ts
│   │   │   │   └── user_registration_response.ts
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   │   ├── login.component.html
│   │   │   │   │   ├── login.component.sass
│   │   │   │   │   ├── login.component.spec.ts
│   │   │   │   │   └── login.component.ts
│   │   │   │   ├── password-forgotten/
│   │   │   │   │   ├── password-forgotten.component.html
│   │   │   │   │   ├── password-forgotten.component.sass
│   │   │   │   │   ├── password-forgotten.component.spec.ts
│   │   │   │   │   └── password-forgotten.component.ts
│   │   │   │   ├── register/
│   │   │   │   │   ├── register.component.html
│   │   │   │   │   ├── register.component.sass
│   │   │   │   │   ├── register.component.spec.ts
│   │   │   │   │   └── register.component.ts
│   │   │   │   ├── set-password/
│   │   │   │   │   ├── set-password.component.html
│   │   │   │   │   ├── set-password.component.sass
│   │   │   │   │   ├── set-password.component.spec.ts
│   │   │   │   │   └── set-password.component.ts
│   │   │   │   └── verify-account/
│   │   │   │   │   ├── verify-account.component.html
│   │   │   │   │   ├── verify-account.component.sass
│   │   │   │   │   ├── verify-account.component.spec.ts
│   │   │   │   │   └── verify-account.component.ts
│   │   │   ├── cart/
│   │   │   │   ├── cart-item/
│   │   │   │   │   ├── cart-item.component.html
│   │   │   │   │   ├── cart-item.component.sass
│   │   │   │   │   ├── cart-item.component.spec.ts
│   │   │   │   │   └── cart-item.component.ts
│   │   │   │   ├── cart-overview/
│   │   │   │   │   ├── cart-overview.component.html
│   │   │   │   │   ├── cart-overview.component.sass
│   │   │   │   │   ├── cart-overview.component.spec.ts
│   │   │   │   │   └── cart-overview.component.ts
│   │   │   │   └── services/
│   │   │   ├── checkout/
│   │   │   │   └── services/
│   │   │   │   │   ├── checkout.service.spec.ts
│   │   │   │   │   └── checkout.service.ts
│   │   │   │   ├── checkout.component.html
│   │   │   │   ├── checkout.component.sass
│   │   │   │   ├── checkout.component.spec.ts
│   │   │   │   └── checkout.component.ts
│   │   │   ├── dashboard/
│   │   │   │   └── components/
│   │   │   │   │   └── profile/
│   │   │   │   │   │   ├── profile.component.html
│   │   │   │   │   │   ├── profile.component.sass
│   │   │   │   │   │   ├── profile.component.spec.ts
│   │   │   │   │   │   └── profile.component.ts
│   │   │   │   ├── dashboard.component.html
│   │   │   │   ├── dashboard.component.sass
│   │   │   │   ├── dashboard.component.spec.ts
│   │   │   │   └── dashboard.component.ts
│   │   │   ├── marketplace/
│   │   │   │   ├── components/
│   │   │   │   │   ├── marketplace-product-card/
│   │   │   │   │   │   ├── marketplace-product-card.component.html
│   │   │   │   │   │   ├── marketplace-product-card.component.sass
│   │   │   │   │   │   ├── marketplace-product-card.component.spec.ts
│   │   │   │   │   │   └── marketplace-product-card.component.ts
│   │   │   │   │   └── product-details/
│   │   │   │   │   │   ├── product-details.component.html
│   │   │   │   │   │   ├── product-details.component.sass
│   │   │   │   │   │   ├── product-details.component.spec.ts
│   │   │   │   │   │   └── product-details.component.ts
│   │   │   │   ├── market-details/
│   │   │   │   │   ├── market-details.component.html
│   │   │   │   │   ├── market-details.component.sass
│   │   │   │   │   ├── market-details.component.spec.ts
│   │   │   │   │   └── market-details.component.ts
│   │   │   │   ├── markets/
│   │   │   │   │   ├── markets.component.html
│   │   │   │   │   ├── markets.component.sass
│   │   │   │   │   ├── markets.component.spec.ts
│   │   │   │   │   └── markets.component.ts
│   │   │   │   └── services/
│   │   │   │   │   ├── market.service.spec.ts
│   │   │   │   │   └── market.service.ts
│   │   │   │   ├── marketplace.component.html
│   │   │   │   ├── marketplace.component.sass
│   │   │   │   ├── marketplace.component.spec.ts
│   │   │   │   ├── marketplace.component.ts
│   │   │   │   └── marketplace.routes.ts
│   │   │   ├── orders/
│   │   │   │   ├── orders.component.html
│   │   │   │   ├── orders.component.sass
│   │   │   │   ├── orders.component.spec.ts
│   │   │   │   └── orders.component.ts
│   │   │   ├── products/
│   │   │   │   ├── create-product/
│   │   │   │   │   ├── create-product.component.html
│   │   │   │   │   ├── create-product.component.sass
│   │   │   │   │   ├── create-product.component.spec.ts
│   │   │   │   │   └── create-product.component.ts
│   │   │   │   ├── product-card/
│   │   │   │   │   ├── product-card.component.html
│   │   │   │   │   ├── product-card.component.sass
│   │   │   │   │   ├── product-card.component.spec.ts
│   │   │   │   │   └── product-card.component.ts
│   │   │   │   ├── product-details/
│   │   │   │   │   ├── product-details.component.html
│   │   │   │   │   ├── product-details.component.sass
│   │   │   │   │   ├── product-details.component.spec.ts
│   │   │   │   │   └── product-details.component.ts
│   │   │   │   └── products-list/
│   │   │   │   │   ├── products-list.component.html
│   │   │   │   │   ├── products-list.component.sass
│   │   │   │   │   ├── products-list.component.spec.ts
│   │   │   │   │   └── products-list.component.ts
│   │   │   │   ├── products.component.html
│   │   │   │   ├── products.component.sass
│   │   │   │   ├── products.component.spec.ts
│   │   │   │   ├── products.component.ts
│   │   │   │   └── products.routes.ts
│   │   │   ├── roles/
│   │   │   │   ├── create-role/
│   │   │   │   │   ├── create-role.component.html
│   │   │   │   │   ├── create-role.component.sass
│   │   │   │   │   ├── create-role.component.spec.ts
│   │   │   │   │   └── create-role.component.ts
│   │   │   │   ├── role-details/
│   │   │   │   │   ├── role-details.component.html
│   │   │   │   │   ├── role-details.component.sass
│   │   │   │   │   ├── role-details.component.spec.ts
│   │   │   │   │   └── role-details.component.ts
│   │   │   │   └── roles-list/
│   │   │   │   │   ├── roles-list.component.html
│   │   │   │   │   ├── roles-list.component.sass
│   │   │   │   │   ├── roles-list.component.spec.ts
│   │   │   │   │   └── roles-list.component.ts
│   │   │   │   ├── roles.component.html
│   │   │   │   ├── roles.component.sass
│   │   │   │   ├── roles.component.spec.ts
│   │   │   │   ├── roles.component.ts
│   │   │   │   └── roles.routes.ts
│   │   │   ├── tenants/
│   │   │   │   ├── create-tenant/
│   │   │   │   │   ├── create-tenant.component.html
│   │   │   │   │   ├── create-tenant.component.sass
│   │   │   │   │   ├── create-tenant.component.spec.ts
│   │   │   │   │   └── create-tenant.component.ts
│   │   │   │   ├── services/
│   │   │   │   │   ├── tenant.service.spec.ts
│   │   │   │   │   └── tenant.service.ts
│   │   │   │   ├── tenant-details/
│   │   │   │   │   ├── tenant-details.component.html
│   │   │   │   │   ├── tenant-details.component.sass
│   │   │   │   │   ├── tenant-details.component.spec.ts
│   │   │   │   │   └── tenant-details.component.ts
│   │   │   │   └── tenants-list/
│   │   │   │   │   ├── tenants-list.component.html
│   │   │   │   │   ├── tenants-list.component.sass
│   │   │   │   │   ├── tenants-list.component.spec.ts
│   │   │   │   │   └── tenants-list.component.ts
│   │   │   │   ├── tenants.component.html
│   │   │   │   ├── tenants.component.sass
│   │   │   │   ├── tenants.component.spec.ts
│   │   │   │   ├── tenants.component.ts
│   │   │   │   └── tenants.routes.ts
│   │   │   └── users/
│   │   │   │   ├── create-user/
│   │   │   │   │   ├── create-user.component.html
│   │   │   │   │   ├── create-user.component.sass
│   │   │   │   │   ├── create-user.component.spec.ts
│   │   │   │   │   └── create-user.component.ts
│   │   │   │   ├── services/
│   │   │   │   │   ├── user.service.spec.ts
│   │   │   │   │   └── user.service.ts
│   │   │   │   ├── user-details/
│   │   │   │   │   ├── user-details.component.html
│   │   │   │   │   ├── user-details.component.sass
│   │   │   │   │   ├── user-details.component.spec.ts
│   │   │   │   │   └── user-details.component.ts
│   │   │   │   └── users-list/
│   │   │   │   │   ├── users-list.component.html
│   │   │   │   │   ├── users-list.component.sass
│   │   │   │   │   ├── users-list.component.spec.ts
│   │   │   │   │   └── users-list.component.ts
│   │   │   │   ├── users.component.html
│   │   │   │   ├── users.component.sass
│   │   │   │   ├── users.component.spec.ts
│   │   │   │   ├── users.component.ts
│   │   │   │   └── users.routes.ts
│   │   ├── layouts/
│   │   │   ├── admin-layout/
│   │   │   │   ├── admin-navbar/
│   │   │   │   │   ├── admin-navbar.component.html
│   │   │   │   │   ├── admin-navbar.component.sass
│   │   │   │   │   ├── admin-navbar.component.spec.ts
│   │   │   │   │   └── admin-navbar.component.ts
│   │   │   │   └── sidenav/
│   │   │   │   │   ├── sidenav.component.html
│   │   │   │   │   ├── sidenav.component.sass
│   │   │   │   │   ├── sidenav.component.spec.ts
│   │   │   │   │   └── sidenav.component.ts
│   │   │   │   ├── admin-layout.component.html
│   │   │   │   ├── admin-layout.component.sass
│   │   │   │   ├── admin-layout.component.spec.ts
│   │   │   │   └── admin-layout.component.ts
│   │   │   └── default-layout/
│   │   │   │   ├── default-layout.component.html
│   │   │   │   ├── default-layout.component.sass
│   │   │   │   ├── default-layout.component.spec.ts
│   │   │   │   └── default-layout.component.ts
│   │   └── shared/
│   │   │   ├── components/
│   │   │   │   ├── breadcrumb/
│   │   │   │   │   ├── breadcrumb.component.html
│   │   │   │   │   ├── breadcrumb.component.sass
│   │   │   │   │   ├── breadcrumb.component.spec.ts
│   │   │   │   │   ├── breadcrumb.component.ts
│   │   │   │   │   ├── breadcrumb.service.spec.ts
│   │   │   │   │   └── breadcrumb.service.ts
│   │   │   │   ├── confirm-dialog/
│   │   │   │   │   ├── confirm-dialog.component.html
│   │   │   │   │   ├── confirm-dialog.component.sass
│   │   │   │   │   ├── confirm-dialog.component.spec.ts
│   │   │   │   │   └── confirm-dialog.component.ts
│   │   │   │   ├── footer/
│   │   │   │   │   ├── footer.component.html
│   │   │   │   │   ├── footer.component.sass
│   │   │   │   │   ├── footer.component.spec.ts
│   │   │   │   │   └── footer.component.ts
│   │   │   │   └── navbar/
│   │   │   │   │   ├── navbar.component.html
│   │   │   │   │   ├── navbar.component.sass
│   │   │   │   │   ├── navbar.component.spec.ts
│   │   │   │   │   └── navbar.component.ts
│   │   │   ├── material/
│   │   │   │   └── material.module.ts
│   │   │   └── services/
│   │   │   │   ├── address.service.spec.ts
│   │   │   │   ├── address.service.ts
│   │   │   │   ├── cart.service.spec.ts
│   │   │   │   ├── cart.service.ts
│   │   │   │   ├── category.service.spec.ts
│   │   │   │   ├── category.service.ts
│   │   │   │   ├── order.service.spec.ts
│   │   │   │   ├── order.service.ts
│   │   │   │   ├── product.service.spec.ts
│   │   │   │   ├── product.service.ts
│   │   │   │   ├── toast.service.spec.ts
│   │   │   │   └── toast.service.ts
│   │   ├── app.component.html
│   │   ├── app.component.sass
│   │   ├── app.component.spec.ts
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   └── environments/
│   │   ├── environment.development.ts
│   │   └── environment.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.sass
├── angular.json
├── package.json
├── package-lock.json
├── README.md
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
└── tsconfig.spec.json
```
