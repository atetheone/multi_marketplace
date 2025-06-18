# Backend Structure
```
ace.js
Here is a potentially relevant text excerpt in `backend-adonis/ace.js` starting at line 0:
```js
/*
|--------------------------------------------------------------------------
| JavaScript entrypoint for running ace commands
|--------------------------------------------------------------------------
|
```

adonisrc.ts
Here is a potentially relevant text excerpt in `backend-adonis/adonisrc.ts` starting at line 0:
```ts
import { defineConfig } from '@adonisjs/core/app'

export default defineConfig({
  /*
  |--------------------------------------------------------------------------
```

app/
  exceptions/
    handler.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/exceptions/handler.ts` starting at line 0:
```ts
import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import { Exception } from '@adonisjs/core/exceptions'
import { ApiResponse } from '#utils/api_response'

```

  guard/
    config.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/guard/config.ts` starting at line 0:
```ts
import { GuardConfigProvider } from '@adonisjs/auth/types'
import type { HttpContext } from '@adonisjs/core/http'
import { JwtGuardUser, JwtUserProviderContract } from './jwt_types.js'
import { JwtGuard } from './jwt.js'
import { Secret } from '@adonisjs/core/helpers'
```

    jwt.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/guard/jwt.ts` starting at line 0:
```ts
import { symbols, errors } from '@adonisjs/auth'
import { AuthClientResponse, GuardContract } from '@adonisjs/auth/types'
import type { HttpContext } from '@adonisjs/core/http'
import jwt from 'jsonwebtoken'
import { JwtUserProviderContract, JwtGuardOptions } from './jwt_types.js'
```

    jwt_types.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/guard/jwt_types.ts` starting at line 0:
```ts
import { symbols } from '@adonisjs/auth'

/**
 * The bridge between the User provider and the
 * Guard
```

  mails/
    set_password_notification.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/mails/set_password_notification.ts` starting at line 0:
```ts
import { BaseMail } from '@adonisjs/mail'
import User from '#user/models/user'
import env from '#start/env'

export default class SetPasswordNotification extends BaseMail {
```

    verify_e_notification.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/mails/verify_e_notification.ts` starting at line 0:
```ts
import { BaseMail } from '@adonisjs/mail'
import User from '#user/models/user'
import env from '#start/env'

export default class VerifyENotification extends BaseMail {
```

  middleware/
    auth_middleware.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/middleware/auth_middleware.ts` starting at line 0:
```ts
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'

/**
```

    check_tenant_middleware.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/middleware/check_tenant_middleware.ts` starting at line 0:
```ts
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import Tenant from '#tenant/models/tenant'
import { Exception } from '@adonisjs/core/exceptions'
import { ApiResponse } from '#utils/api_response'
```

    container_bindings_middleware.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/middleware/container_bindings_middleware.ts` starting at line 0:
```ts
import { Logger } from '@adonisjs/core/logger'
import { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
```

    force_json_response_middleware.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/middleware/force_json_response_middleware.ts` starting at line 0:
```ts
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Updating the "Accept" header to always accept "application/json" response
```

    guest_middleware.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/middleware/guest_middleware.ts` starting at line 0:
```ts
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'

/**
```

    permission_middleware.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/middleware/permission_middleware.ts` starting at line 0:
```ts
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import User from '#user/models/user'
import Role from '#auth/models/role'
import { Exception } from '@adonisjs/core/exceptions'
```

    role_middleware.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/middleware/role_middleware.ts` starting at line 0:
```ts
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import User from '#user/models/user'
import Role from '#auth/models/role'

```

    silent_auth_middleware.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/middleware/silent_auth_middleware.ts` starting at line 0:
```ts
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Silent auth middleware can be used as a global middleware to silent check
```

  modules/
    address/
      controllers/
        address_controller.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/address/controllers/address_controller.ts` starting at line 0:
```ts
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import AddressService from '#address/services/address_service'
import { ApiResponse } from '#utils/api_response'
import {
```

        delivery_zone_controller.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/address/controllers/delivery_zone_controller.ts` starting at line 0:
```ts
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { DeliveryZoneService } from '#address/services/delivery_zone_service'
import { ApiResponse } from '#utils/api_response'
import { createZoneValidator, updateZoneValidator } from '#address/validators/zone_validator'
```

      models/
        address.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/address/models/address.ts` starting at line 0:
```ts
import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import User from '#user/models/user'

```

        delivery_zone.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/address/models/delivery_zone.ts` starting at line 0:
```ts
import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class DeliveryZone extends BaseModel {
  @column({ isPrimary: true })
```

      routes/
        address_routes.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/address/routes/address_routes.ts` starting at line 0:
```ts
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AddressController = () => import('#address/controllers/address_controller')

```

      services/
        address_service.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/address/services/address_service.ts` starting at line 0:
```ts
import type { TransactionClientContract } from '@adonisjs/lucid/types/database'
import Address from '#address/models/address'
import { CreateAddressDto, UpdateAddressDto } from '#address/types/address'
import { Exception } from '@adonisjs/core/exceptions'

```

        delivery_zone_service.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/address/services/delivery_zone_service.ts` starting at line 0:
```ts
import { inject } from '@adonisjs/core'
import { Exception } from '@adonisjs/core/exceptions'
import DeliveryZone from '#address/models/delivery_zone'
import type { CreateZoneDto, UpdateZoneDto } from '#address/types/delivery_zone'

```

      types/
        address.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/address/types/address.ts` starting at line 0:
```ts
export interface AddressDto {
  type: 'shipping' | 'billing'
  addressLine1: string
  addressLine2?: string
  city: string
```

        delivery_zone.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/address/types/delivery_zone.ts` starting at line 0:
```ts
export interface BaseZoneDto {
  name: string
  fee: number
}

```

      validators/
        address_validator.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/address/validators/address_validator.ts` starting at line 0:
```ts
import vine from '@vinejs/vine'

const addressBase = {
  type: vine.enum(['shipping', 'billing']),
  addressLine1: vine.string().trim(),
```

        zone_validator.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/address/validators/zone_validator.ts` starting at line 0:
```ts
import vine from '@vinejs/vine'

const zoneBase = {
  name: vine.string().trim().minLength(3).maxLength(100),
  fee: vine.number().positive()
```

    auth/
      controllers/
        auth_controller.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/auth/controllers/auth_controller.ts` starting at line 0:
```ts
import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { loginValidator } from '#auth/validators/login'
import AuthService from '#auth/services/auth_service'
import { LoginCredentialsDto } from '#auth/types/login_credentials'
```

        registration_controller.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/auth/controllers/registration_controller.ts` starting at line 0:
```ts
import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import {
  registerUserValidator,
  setPasswordValidator,
```

      models/
      routes/
        auth_routes.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/auth/routes/auth_routes.ts` starting at line 0:
```ts
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () => import('#auth/controllers/auth_controller')
const RegistrationController = () => import('#auth/controllers/registration_controller')
```

      services/
        auth_service.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/auth/services/auth_service.ts` starting at line 0:
```ts
import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import User from '#user/models/user'
import { LoginCredentialsDto } from '#auth/types/login_credentials'
import { Exception } from '@adonisjs/core/exceptions'
```

        registration_service.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/auth/services/registration_service.ts` starting at line 0:
```ts
import { RegistrationUserDto } from '#auth/types/registration_user'
import User from '#user/models/user'
import RoleService from '#role/services/role_service'
import { inject } from '@adonisjs/core'
import jwt from 'jsonwebtoken'
```

      types/
        login_credentials.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/auth/types/login_credentials.ts` starting at line 0:
```ts
export interface LoginCredentialsDto {
  email: string
  password: string
}
```

        registration_tenant.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/auth/types/registration_tenant.ts` starting at line 0:
```ts
export interface RegistrationTenantDto {
  name: string
  domain: string
}
```

        registration_user.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/auth/types/registration_user.ts` starting at line 0:
```ts
export interface RegistrationUserDto {
  username: string
  email: string
  password: string
  firstName: string
```

        token.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/auth/types/token.ts` starting at line 0:
```ts
export interface Token {
  type: string
  token: string
  expiresIn: string | number | undefined
}
```

      validators/
        login.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/auth/validators/login.ts` starting at line 0:
```ts
import vine from '@vinejs/vine'

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email().normalizeEmail(),
```

        registration.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/auth/validators/registration.ts` starting at line 0:
```ts
import vine from '@vinejs/vine'

const stringFormat = vine.string().trim()

export const registerUserValidator = vine.compile(
```

    cart/
      controllers/
        cart_controller.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/cart/controllers/cart_controller.ts` starting at line 0:
```ts
import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { CartService } from '#cart/services/cart_service'
import { ApiResponse } from '#utils/api_response'
import { createCartValidator } from '#cart/validators/cart'
```

        cart_item_controller.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/cart/controllers/cart_item_controller.ts` starting at line 0:
```ts
import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { CartService } from '#cart/services/cart_service'
import { addCartItemValidator, updateCartItemValidator } from '#cart/validators/cart'
import { ApiResponse } from '#utils/api_response'
```

      models/
        cart.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/cart/models/cart.ts` starting at line 0:
```ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#user/models/user'
import Tenant from '#tenant/models/tenant'
```

        cart_item.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/cart/models/cart_item.ts` starting at line 0:
```ts
// backend-adonis/app/modules/order/models/order_item.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Cart from './cart.js'
```

      routes/
        cart_routes.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/cart/routes/cart_routes.ts` starting at line 0:
```ts
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const CartController = () => import('#cart/controllers/cart_controller')
const CartItemController = () => import('#cart/controllers/cart_item_controller')
```

      services/
        cart_service.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/cart/services/cart_service.ts` starting at line 0:
```ts
import Cart from '#cart/models/cart'
import CartItem from '#cart/models/cart_item'
import Product from '#product/models/product'
import { CreateCartDto, CartItemDto, UpdateCartItemDto } from '#cart/types/cart'
import { Exception } from '@adonisjs/core/exceptions'
```

      types/
        cart.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/cart/types/cart.ts` starting at line 0:
```ts
export interface CartItemDto {
  productId: number
  quantity: number
}

```

      validators/
        cart.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/cart/validators/cart.ts` starting at line 0:
```ts
import vine from '@vinejs/vine'

export const addCartItemValidator = vine.compile(
  vine.object({
    productId: vine.number().positive(),
```

    navigation/
      contracts/
        request.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/navigation/contracts/request.ts` starting at line 0:
```ts
import '@adonisjs/core'

declare module '@adonisjs/core/http' {
  interface Request {
    tenant?: any
```

      controllers/
        menu_item_controller.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/navigation/controllers/menu_item_controller.ts` starting at line 0:
```ts
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import MenuItem from '#navigation/models/menu_item'
import MenuItemService from '#navigation/services/menu_item_service'
import {
```

      models/
        menu_item.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/navigation/models/menu_item.ts` starting at line 0:
```ts
// app/modules/navigation/models/menu_item.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Permission from '#role/models/permission'
```

      routes/
        menu_item_routes.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/navigation/routes/menu_item_routes.ts` starting at line 0:
```ts
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const MenuItemController = () => import('#navigation/controllers/menu_item_controller')

```

      services/
        menu_item_service.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/navigation/services/menu_item_service.ts` starting at line 0:
```ts
import MenuItem from '#navigation/models/menu_item'
import { CreateMenuItemDto, UpdateMenuItemDto } from '#navigation/types/menu_item'
import { Exception } from '@adonisjs/core/exceptions'

export default class MenuItemService {
```

      types/
        menu_item.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/navigation/types/menu_item.ts` starting at line 0:
```ts
export interface CreateMenuItemDto {
  label: string
  route?: string
  parentId?: number
  order: number
```

      validators/
        menu_item_validator.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/navigation/validators/menu_item_validator.ts` starting at line 0:
```ts
import vine from '@vinejs/vine'

export const createMenuItemValidator = vine.compile(
  vine.object({
    label: vine.string().trim(),
```

    order/
      controllers/
        order_controller.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/order/controllers/order_controller.ts` starting at line 0:
```ts
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { OrderService } from '#order/services/order_service'
import { createOrderValidator, updateOrderStatusValidator } from '#order/validators/order'
import { ApiResponse } from '#utils/api_response'
```

      models/
        order.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/order/models/order.ts` starting at line 0:
```ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#user/models/user'
import Address from '#address/models/address'
```

        order_item.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/order/models/order_item.ts` starting at line 0:
```ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Order from './order.js'
import Product from '#product/models/product'
```

      routes/
        order_routes.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/order/routes/order_routes.ts` starting at line 0:
```ts
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const OrderController = () => import('#order/controllers/order_controller')

```

      services/
        order_service.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/order/services/order_service.ts` starting at line 0:
```ts
import { inject } from '@adonisjs/core'
import { Exception } from '@adonisjs/core/exceptions'
import db from '@adonisjs/lucid/services/db'
import type { TransactionClientContract } from '@adonisjs/lucid/types/database'
import Order from '#order/models/order'
```

      types/
        order.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/order/types/order.ts` starting at line 0:
```ts
export interface OrderItemDto {
  productId: number
  quantity: number
  unitPrice: number
}
```

      validators/
        order.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/order/validators/order.ts` starting at line 0:
```ts
import vine from '@vinejs/vine'

export const createOrderValidator = vine.compile(
  vine.object({
    cartId: vine.number().positive(),
```

    payment/
      controllers/
      models/
        payment.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/payment/models/payment.ts` starting at line 0:
```ts
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon';
import Order from '#order/models/order';

```

      routes/
      services/
      types/
      validators/
    product/
      controllers/
        category_controller.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/product/controllers/category_controller.ts` starting at line 0:
```ts
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { CategoryService } from '#product/services/category_service'
import { createCategoryValidator, updateCategoryValidator } from '#product/validators/category'
import { ApiResponse } from '#utils/api_response'
```

        inventory_controller.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/product/controllers/inventory_controller.ts` starting at line 0:
```ts
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { InventoryService } from '#product/services/inventory_service'
import { ApiResponse } from '#utils/api_response'
import {
```

        product_controller.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/product/controllers/product_controller.ts` starting at line 0:
```ts
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { ProductService } from '#product/services/product_service'
import { createProductValidator, updateProductValidator, uploadImageValidator } from '#product/validators/product'
import { ApiResponse } from '#utils/api_response'
```

      models/
        category.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/product/models/category.ts` starting at line 0:
```ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Tenant from '#tenant/models/tenant'
import Product from './product.js'
```

        inventory.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/product/models/inventory.ts` starting at line 0:
```ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Tenant from '#tenant/models/tenant'
import Product from './product.js'
```

        product.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/product/models/product.ts` starting at line 0:
```ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany, manyToMany, hasOne } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany, HasOne } from '@adonisjs/lucid/types/relations'
import Tenant from '#tenant/models/tenant'
import ProductImage from './product_image.js'
```

        product_image.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/product/models/product_image.ts` starting at line 0:
```ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Product from './product.js'

```

      routes/
        category_routes.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/product/routes/category_routes.ts` starting at line 0:
```ts
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const CategoryController = () => import('#product/controllers/category_controller')

```

        product_routes.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/product/routes/product_routes.ts` starting at line 0:
```ts
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const ProductController = () => import('#product/controllers/product_controller')
const InventoryController = () => import('#product/controllers/inventory_controller')
```

      services/
        category_service.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/product/services/category_service.ts` starting at line 0:
```ts
import { inject } from '@adonisjs/core'
import Category from '#product/models/category'

@inject()
export class CategoryService {
```

        inventory_service.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/product/services/inventory_service.ts` starting at line 0:
```ts
import { inject } from '@adonisjs/core'
import Product from '#product/models/product'
import { Exception } from '@adonisjs/core/exceptions'

@inject()
```

        product_service.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/product/services/product_service.ts` starting at line 0:
```ts
import Product from '#product/models/product'
import { CreateProductDto, UpdateProductDto } from '#product/types/product'
import { Exception } from '@adonisjs/core/exceptions'
import { inject } from '@adonisjs/core'
import { CloudinaryService } from '#services/cloudinary_service'
```

      types/
        product.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/product/types/product.ts` starting at line 0:
```ts
export interface CreateProductDto {
  name: string
  description: string
  price: number
  sku: string
```

      validators/
        category.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/product/validators/category.ts` starting at line 0:
```ts
import vine from '@vinejs/vine'

export const createCategoryValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(100),
```

        inventory.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/product/validators/inventory.ts` starting at line 0:
```ts
import vine from '@vinejs/vine'

export const updateStockValidator = vine.compile(
  vine.object({
    stock: vine.number().min(0),
```

        product.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/product/validators/product.ts` starting at line 0:
```ts
import vine from '@vinejs/vine'
import { MultipartFile } from '@adonisjs/core/bodyparser'

interface ImageUploadData {
  file: MultipartFile
```

    role/
      controllers/
        permission_controller.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/role/controllers/permission_controller.ts` starting at line 0:
```ts
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import PermissionService from '#role/services/permission_service'
import {
  createPermissionValidator,
```

        role_controller.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/role/controllers/role_controller.ts` starting at line 0:
```ts
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import RoleService from '#role/services/role_service'
import {
  createRoleValidator,
```

      models/
        permission.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/role/models/permission.ts` starting at line 0:
```ts
import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Permission extends BaseModel {
  @column({ isPrimary: true })
```

        role.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/role/models/role.ts` starting at line 0:
```ts
// import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ExtractModelRelations, ManyToMany } from '@adonisjs/lucid/types/relations'
import Permission from './permission.js'
import { DateTime } from 'luxon'
```

      routes/
        permission_routes.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/role/routes/permission_routes.ts` starting at line 0:
```ts
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const PermissionController = () => import('#role/controllers/permission_controller')

```

        role_routes.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/role/routes/role_routes.ts` starting at line 0:
```ts
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const RoleController = () => import('#role/controllers/role_controller')

```

      services/
        permission_service.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/role/services/permission_service.ts` starting at line 0:
```ts
import Permission from '#role/models/permission'
import { Exception } from '@adonisjs/core/exceptions'
import { CreatePermissionDto, UpdatePermissionDto } from '#role/types/permission'

export default class PermissionService {
```

        role_service.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/role/services/role_service.ts` starting at line 0:
```ts
// import { inject } from '@adonisjs/core'
import Role from '#role/models/role'
import type { CreateRoleDto, UpdateRoleDto, AssignRoleDto } from '#role/types/role'
import User from '#user/models/user'
import { Exception } from '@adonisjs/core/exceptions'
```

      types/
        permission.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/role/types/permission.ts` starting at line 0:
```ts
export interface PermissionDto {
  action: string
  resource: string
}

```

        role.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/role/types/role.ts` starting at line 0:
```ts
import { PermissionDto } from './permission.js'

export enum Role {
  SUPER_ADMIN = 'super-admin',
  ADMIN = 'admin',
```

      validators/
        permission_validator.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/role/validators/permission_validator.ts` starting at line 0:
```ts
import vine from '@vinejs/vine'

export const createPermissionValidator = vine.compile(
  vine.object({
    action: vine.string().trim().minLength(3),
```

        role_validator.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/role/validators/role_validator.ts` starting at line 0:
```ts
import vine from '@vinejs/vine'

export const createRoleValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3),
```

    tenant/
      controllers/
        market_controller.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/tenant/controllers/market_controller.ts` starting at line 0:
```ts
import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { MarketService } from '#tenant/services/market_service'
import { ApiResponse } from '#utils/api_response'

```

        tenant_controller.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/tenant/controllers/tenant_controller.ts` starting at line 0:
```ts
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import TenantService from '#tenant/services/tenant_service'
import { createTenantValidator, updateTenantValidator } from '#tenant/validators/tenant_validator'
import { CreateTenantDto, UpdateTenantDto } from '#tenant/types/tenant'
```

      models/
        tenant.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/tenant/models/tenant.ts` starting at line 0:
```ts
import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, hasMany } from '@adonisjs/lucid/orm'
import type { ManyToMany, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#user/models/user'
import Role from '#role/models/role'
```

      routes/
        market_routes.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/tenant/routes/market_routes.ts` starting at line 0:
```ts
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const MarketController = () => import('#tenant/controllers/market_controller')

```

        tenant_routes.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/tenant/routes/tenant_routes.ts` starting at line 0:
```ts
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const TenantController = () => import('#tenant/controllers/tenant_controller')

```

      services/
        market_service.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/tenant/services/market_service.ts` starting at line 0:
```ts
import Tenant from '#tenant/models/tenant'
import Product from '#product/models/product'
import Category from '#product/models/category'
import { Exception } from '@adonisjs/core/exceptions'

```

        tenant_service.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/tenant/services/tenant_service.ts` starting at line 0:
```ts
import Tenant from '#tenant/models/tenant'
import { Exception } from '@adonisjs/core/exceptions'
import { CreateTenantDto, UpdateTenantDto } from '#tenant/types/tenant'

export default class TenantService {
```

      types/
        tenant.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/tenant/types/tenant.ts` starting at line 0:
```ts
export interface TenantDto {
  name: string
  domain: string
  description?: string
  slug: string
```

      validators/
        tenant_validator.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/tenant/validators/tenant_validator.ts` starting at line 0:
```ts
import vine from '@vinejs/vine'

export const createTenantValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3),
```

    user/
      controllers/
        user_controller.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/user/controllers/user_controller.ts` starting at line 0:
```ts
import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import UserService from '#user/services/user_service'
import { 
  createUserValidator,
```

      models/
        user.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/user/models/user.ts` starting at line 0:
```ts
import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, hasOne, manyToMany } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import type { ManyToMany, HasOne, HasMany } from '@adonisjs/lucid/types/relations'
```

        user_profile.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/user/models/user_profile.ts` starting at line 0:
```ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.js'

```

      routes/
        user_routes.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/user/routes/user_routes.ts` starting at line 0:
```ts
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const UserController = () => import('#user/controllers/user_controller')

```

      services/
        user_service.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/user/services/user_service.ts` starting at line 0:
```ts
import { CreateUserDto, UpdateUserDto, UpdateProfileDto } from '#user/types/user'
import User from '#user/models/user'
import { inject } from '@adonisjs/core'
import RegistrationService from '#auth/services/registration_service'
import { Exception } from '@adonisjs/core/exceptions'
```

      types/
        user.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/user/types/user.ts` starting at line 0:
```ts
export interface UserDto {
  email: string
  username: string
  password: string
  firstName: string
```

      validators/
        user_validator.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/modules/user/validators/user_validator.ts` starting at line 0:
```ts
import vine from '@vinejs/vine'

const userBase = {
  email: vine.string().trim().email(),
  username: vine.string().trim().minLength(3),
```

  services/
    cloudinary_service.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/services/cloudinary_service.ts` starting at line 0:
```ts
import cloudinary from '#config/cloudinary'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import { Exception } from '@adonisjs/core/exceptions'

export class CloudinaryService {
```

  utils/
    api_response.ts
Here is a potentially relevant text excerpt in `backend-adonis/app/utils/api_response.ts` starting at line 0:
```ts
import type { HttpContext } from '@adonisjs/core/http'

export interface ApiResponseType<T> {
  success: boolean
  message?: string
```

bin/
  console.ts
Here is a potentially relevant text excerpt in `backend-adonis/bin/console.ts` starting at line 0:
```ts
/*
|--------------------------------------------------------------------------
| Ace entry point
|--------------------------------------------------------------------------
|
```

  server.ts
Here is a potentially relevant text excerpt in `backend-adonis/bin/server.ts` starting at line 0:
```ts
/*
|--------------------------------------------------------------------------
| HTTP server entrypoint
|--------------------------------------------------------------------------
|
```

  test.ts
Here is a potentially relevant text excerpt in `backend-adonis/bin/test.ts` starting at line 0:
```ts
/*
|--------------------------------------------------------------------------
| Test runner entrypoint
|--------------------------------------------------------------------------
|
```

commands/
  make_module.ts
Here is a potentially relevant text excerpt in `backend-adonis/commands/make_module.ts` starting at line 0:
```ts
import { BaseCommand, args } from '@adonisjs/core/ace'
import { join } from 'node:path'
import { promises as fs } from 'node:fs'

export default class MakeModule extends BaseCommand {
```

config/
  app.ts
Here is a potentially relevant text excerpt in `backend-adonis/config/app.ts` starting at line 0:
```ts
import env from '#start/env'
import app from '@adonisjs/core/services/app'
import { Secret } from '@adonisjs/core/helpers'
import { defineConfig } from '@adonisjs/core/http'

```

  auth.ts
Here is a potentially relevant text excerpt in `backend-adonis/config/auth.ts` starting at line 0:
```ts
import { defineConfig } from '@adonisjs/auth'
import { InferAuthEvents, Authenticators } from '@adonisjs/auth/types'
import { sessionGuard, sessionUserProvider } from '@adonisjs/auth/session'
import { jwtGuard } from '#guard/config'
import { JwtGuardUser, BaseJwtContent } from '#guard/jwt_types'
```

  bodyparser.ts
Here is a potentially relevant text excerpt in `backend-adonis/config/bodyparser.ts` starting at line 0:
```ts
import { defineConfig } from '@adonisjs/core/bodyparser'

const bodyParserConfig = defineConfig({
  /**
   * The bodyparser middleware will parse the request body
```

  cloudinary.ts
Here is a potentially relevant text excerpt in `backend-adonis/config/cloudinary.ts` starting at line 0:
```ts
import { v2 as cloudinary } from 'cloudinary'
import env from '#start/env'

cloudinary.config({
  cloud_name: env.get('CLOUDINARY_CLOUD_NAME'),
```

  cors.ts
Here is a potentially relevant text excerpt in `backend-adonis/config/cors.ts` starting at line 0:
```ts
import { defineConfig } from '@adonisjs/cors'

/**
 * Configuration options to tweak the CORS policy. The following
 * options are documented on the official documentation website.
```

  database.ts
Here is a potentially relevant text excerpt in `backend-adonis/config/database.ts` starting at line 0:
```ts
import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: 'postgres',
```

  hash.ts
Here is a potentially relevant text excerpt in `backend-adonis/config/hash.ts` starting at line 0:
```ts
import { defineConfig, drivers } from '@adonisjs/core/hash'

const hashConfig = defineConfig({
  default: 'scrypt',

```

  logger.ts
Here is a potentially relevant text excerpt in `backend-adonis/config/logger.ts` starting at line 0:
```ts
import env from '#start/env'
import app from '@adonisjs/core/services/app'
import { defineConfig, targets } from '@adonisjs/core/logger'

const loggerConfig = defineConfig({
```

  mail.ts
Here is a potentially relevant text excerpt in `backend-adonis/config/mail.ts` starting at line 0:
```ts
import env from '#start/env'
import { defineConfig, transports } from '@adonisjs/mail'

const mailConfig = defineConfig({
  default: 'smtp',
```

database/
  factories/
    category_factory.ts
Here is a potentially relevant text excerpt in `backend-adonis/database/factories/category_factory.ts` starting at line 0:
```ts
import Factory from '@adonisjs/lucid/factories'
import Category from '#product/models/category'

export const CategoryFactory = Factory.define(Category, ({ faker }) => {
  const name = `${faker.commerce.department()} ${faker.number.int({ min: 1000, max: 9999 })}`
```

    permission_factory.ts
Here is a potentially relevant text excerpt in `backend-adonis/database/factories/permission_factory.ts` starting at line 0:
```ts
import Factory from '@adonisjs/lucid/factories'
import Permission from '#role/models/permission'

export const PermissionFactory = Factory.define(Permission, ({ faker }) => {
  const resources = ['tenants', 'products', 'orders', 'users', 'roles', 'permissions']
```

    product_factory.ts
Here is a potentially relevant text excerpt in `backend-adonis/database/factories/product_factory.ts` starting at line 0:
```ts
import Factory from '@adonisjs/lucid/factories'
import Product from '#product/models/product'
import { ProductImageFactory } from './product_image_factory.js'
import { CategoryFactory } from './category_factory.js'

```

    product_image_factory.ts
Here is a potentially relevant text excerpt in `backend-adonis/database/factories/product_image_factory.ts` starting at line 0:
```ts
import Factory from '@adonisjs/lucid/factories'
import ProductImage from '#product/models/product_image'

export const ProductImageFactory = Factory.define(ProductImage, ({ faker }) => {
  return {
```

    role_factory.ts
Here is a potentially relevant text excerpt in `backend-adonis/database/factories/role_factory.ts` starting at line 0:
```ts
import Factory from '@adonisjs/lucid/factories'
import Role from '#role/models/role'
import { PermissionFactory } from './permission_factory.js'

export const RoleFactory = Factory.define(Role, ({ faker }) => {
```

    tenant_factory.ts
Here is a potentially relevant text excerpt in `backend-adonis/database/factories/tenant_factory.ts` starting at line 0:
```ts
import Factory from '@adonisjs/lucid/factories'
import Tenant from '#tenant/models/tenant'

export const TenantFactory = Factory.define(Tenant, ({ faker }) => {
  const companyName = faker.company.name()
```

    user_factory.ts
Here is a potentially relevant text excerpt in `backend-adonis/database/factories/user_factory.ts` starting at line 0:
```ts
import Factory from '@adonisjs/lucid/factories'
import User from '#user/models/user'
import hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'
import { RoleFactory } from './role_factory.js'
```

  migrations/
    1731933440045_create_users_table.ts
Here is a potentially relevant text excerpt in `backend-adonis/database/migrations/1731933440045_create_users_table.ts` starting at line 0:
```ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

```

    1731933445045_create_tenants_table.ts
Here is a potentially relevant text excerpt in `backend-adonis/database/migrations/1731933445045_create_tenants_table.ts` starting at line 0:
```ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tenants'

```

    1731933450060_create_user_tenants_table.ts
Here is a potentially relevant text excerpt in `backend-adonis/database/migrations/1731933450060_create_user_tenants_table.ts` starting at line 0:
```ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_tenants'

```

    1731934399743_create_roles_table.ts
Here is a potentially relevant text excerpt in `backend-adonis/database/migrations/1731934399743_create_roles_table.ts` starting at line 0:
```ts
// database/migrations/1731933588252_create_roles_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'roles'
```

    1731934414554_create_permissions_table.ts
Here is a potentially relevant text excerpt in `backend-adonis/database/migrations/1731934414554_create_permissions_table.ts` starting at line 0:
```ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'permissions'

```

    1731934432328_create_role_permissions_table.ts
Here is a potentially relevant text excerpt in `backend-adonis/database/migrations/1731934432328_create_role_permissions_table.ts` starting at line 0:
```ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'role_permission'

```

    1731947302488_create_user_roles_table.ts
Here is a potentially relevant text excerpt in `backend-adonis/database/migrations/1731947302488_create_user_roles_table.ts` starting at line 0:
```ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_roles'

```

    1733142614520_create_menu_items_table.ts
Here is a potentially relevant text excerpt in `backend-adonis/database/migrations/1733142614520_create_menu_items_table.ts` starting at line 0:
```ts
// database/migrations/[timestamp]_create_menu_items_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'menu_items'
```

    1733143757044_create_menu_item_permissions_table.ts
Here is a potentially relevant text excerpt in `backend-adonis/database/migrations/1733143757044_create_menu_item_permissions_table.ts` starting at line 0:
```ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'menu_item_permissions'

```

    1734432987657_create_products_table.ts
Here is a potentially relevant text excerpt in `backend-adonis/database/migrations/1734432987657_create_products_table.ts` starting at line 0:
```ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

```

    1734433008833_create_categories_table.ts
Here is a potentially relevant text excerpt in `backend-adonis/database/migrations/1734433008833_create_categories_table.ts` starting at line 0:
```ts
// database/migrations/1734433008833_create_categories_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'categories'
```

    1734434417062_create_user_profiles_table.ts
Here is a potentially relevant text excerpt in `backend-adonis/database/migrations/1734434417062_create_user_profiles_table.ts` starting at line 0:
```ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users_profile'

```

    1734435594908_create_delivery_zones_table.ts
Here is a potentially relevant text excerpt in `backend-adonis/database/migrations/1734435594908_create_delivery_zones_table.ts` starting at line 0:
```ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'delivery_zones'

```

    1734435594909_create_addresses_table.ts
Here is a potentially relevant text excerpt in `backend-adonis/database/migrations/1734435594909_create_addresses_table.ts` starting at line 0:
```ts
// database/migrations/1734434417062_create_addresses_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'addresses'
```

    1734439732278_create_product_images_table.ts
Here is a potentially relevant text excerpt in `backend-adonis/database/migrations/1734439732278_create_product_images_table.ts` starting at line 0:
```ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'product_images'

```

    1734440945400_create_users_addresses_table.ts
Here is a potentially relevant text excerpt in `backend-adonis/database/migrations/1734440945400_create_users_addresses_table.ts` starting at line 0:
```ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users_addresses'

```

    1734446941562_create_category_products_table.ts
Here is a potentially relevant text excerpt in `backend-adonis/database/migrations/1734446941562_create_category_products_table.ts` starting at line 0:
```ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'category_products'

```

    1735302870119_create_inventory_table.ts
Here is a potentially relevant text excerpt in `backend-adonis/database/migrations/1735302870119_create_inventory_table.ts` starting at line 0:
```ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'inventory'

```

    1735647020770_create_orders_table.ts
Here is a potentially relevant text excerpt in `backend-adonis/database/migrations/1735647020770_create_orders_table.ts` starting at line 0:
```ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

```

    1735647020775_create_payments_table.ts
Here is a potentially relevant text excerpt in `backend-adonis/database/migrations/1735647020775_create_payments_table.ts` starting at line 0:
```ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'payments'

```

    1735647493506_create_order_items_table.ts
Here is a potentially relevant text excerpt in `backend-adonis/database/migrations/1735647493506_create_order_items_table.ts` starting at line 0:
```ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'order_items'

```

    1735819892757_create_carts_table.ts
Here is a potentially relevant text excerpt in `backend-adonis/database/migrations/1735819892757_create_carts_table.ts` starting at line 0:
```ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'carts'

```

    1735821040845_create_cart_items_table.ts
Here is a potentially relevant text excerpt in `backend-adonis/database/migrations/1735821040845_create_cart_items_table.ts` starting at line 0:
```ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cart_items'

```

  seeders/
    main_seeder.ts
Here is a potentially relevant text excerpt in `backend-adonis/database/seeders/main_seeder.ts` starting at line 0:
```ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import TenantSeeder from '#database/seeders/tenant_seeder'
import RoleSeeder from '#database/seeders/role_seeder'
import PermissionSeeder from '#database/seeders/permission_seeder'
import UserSeeder from '#database/seeders/user_seeder'
```

    menu_item_seeder.ts
Here is a potentially relevant text excerpt in `backend-adonis/database/seeders/menu_item_seeder.ts` starting at line 0:
```ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import MenuItem from '#navigation/models/menu_item'
import Permission from '#role/models/permission'

export default class MenuItemSeeder extends BaseSeeder {
```

    permission_seeder.ts
Here is a potentially relevant text excerpt in `backend-adonis/database/seeders/permission_seeder.ts` starting at line 0:
```ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Permission from '#role/models/permission'

export default class PermissionSeeder extends BaseSeeder {
  async run() {
```

    product_seeder.ts
Here is a potentially relevant text excerpt in `backend-adonis/database/seeders/product_seeder.ts` starting at line 0:
```ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'

import { ProductFactory } from '#database/factories/product_factory'
import { CategoryFactory } from '#database/factories/category_factory'

```

    role_seeder.ts
Here is a potentially relevant text excerpt in `backend-adonis/database/seeders/role_seeder.ts` starting at line 0:
```ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '#role/models/role'
import Permission from '#role/models/permission'

export default class RoleSeeder extends BaseSeeder {
```

    tenant_seeder.ts
Here is a potentially relevant text excerpt in `backend-adonis/database/seeders/tenant_seeder.ts` starting at line 0:
```ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Tenant from '#tenant/models/tenant'
import Role from '#role/models/role'
import User from '#user/models/user'
import hash from '@adonisjs/core/services/hash'
```

    user_seeder.ts
Here is a potentially relevant text excerpt in `backend-adonis/database/seeders/user_seeder.ts` starting at line 0:
```ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#user/models/user'
import Role from '#role/models/role'
import hash from '@adonisjs/core/services/hash'
import { UserFactory } from '#database/factories/user_factory'
```

    zone_seeder.ts
Here is a potentially relevant text excerpt in `backend-adonis/database/seeders/zone_seeder.ts` starting at line 0:
```ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import DeliveryZone from '#address/models/delivery_zone'
import Tenant from '#tenant/models/tenant'

export default class ZoneSeeder extends BaseSeeder {
```

eslint.config.js
Here is a potentially relevant text excerpt in `backend-adonis/eslint.config.js` starting at line 0:
```js
import { configApp } from '@adonisjs/eslint-config'
export default configApp()
```

features.md
Here is a potentially relevant text excerpt in `backend-adonis/features.md` starting at line 0:
```md
# Plan de mise en œuvre de la première fonctionnalité

1. Créer la structure de la base de données pour les tenants, les utilisateurs, les rôles et les permissions.
2. Mettre en place un serveur d'authentification (par exemple, OAuth 2.0 avec JWT).
3. Implémenter l'inscription des tenants et l'ajout des utilisateurs associés.
```

package.json
Here is a potentially relevant text excerpt in `backend-adonis/package.json` starting at line 0:
```json
{
  "name": "multi-tenant-ecommerce-system",
  "version": "0.0.0",
  "private": true,
  "type": "module",
```

package-lock.json
Here is a potentially relevant text excerpt in `backend-adonis/package-lock.json` starting at line 0:
```json
{
  "name": "multi-tenant-ecommerce-system",
  "version": "0.0.0",
  "lockfileVersion": 3,
  "requires": true,
```

start/
  env.ts
Here is a potentially relevant text excerpt in `backend-adonis/start/env.ts` starting at line 0:
```ts
/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
```

  kernel.ts
Here is a potentially relevant text excerpt in `backend-adonis/start/kernel.ts` starting at line 0:
```ts
/*
|--------------------------------------------------------------------------
| HTTP kernel file
|--------------------------------------------------------------------------
|
```

  routes.ts
Here is a potentially relevant text excerpt in `backend-adonis/start/routes.ts` starting at line 0:
```ts
/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
```

tests/
  bootstrap.ts
Here is a potentially relevant text excerpt in `backend-adonis/tests/bootstrap.ts` starting at line 0:
```ts
import { assert } from '@japa/assert'
import { apiClient } from '@japa/api-client'
import app from '@adonisjs/core/services/app'
import type { Config } from '@japa/runner/types'
import { pluginAdonisJS } from '@japa/plugin-adonisjs'
```

  functional/
    auth/
      current_user.spec.ts
Here is a potentially relevant text excerpt in `backend-adonis/tests/functional/auth/current_user.spec.ts` starting at line 0:
```ts
import { test } from '@japa/runner'

test.group('Auth current user', () => {
  test('example test', async ({ assert }) => {
  })
```

      login_user.spec.ts
Here is a potentially relevant text excerpt in `backend-adonis/tests/functional/auth/login_user.spec.ts` starting at line 0:
```ts
import { test } from '@japa/runner'
import User from '#user/models/user'
import hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'

```

      register_user.spec.ts
Here is a potentially relevant text excerpt in `backend-adonis/tests/functional/auth/register_user.spec.ts` starting at line 0:
```ts
import { test } from '@japa/runner'
import User from '#user/models/user'
import Role from '#role/models/role'

const REGISTER_ROUTE = '/api/v1/auth/register-user'
```

    permissions/
      create.spec.ts
Here is a potentially relevant text excerpt in `backend-adonis/tests/functional/permissions/create.spec.ts` starting at line 0:
```ts
import { test } from '@japa/runner'

test.group('Permissions create', () => {
  test('example test', async ({ assert }) => {
  })
```

    roles/
      create.spec.ts
Here is a potentially relevant text excerpt in `backend-adonis/tests/functional/roles/create.spec.ts` starting at line 0:
```ts
import { test } from '@japa/runner'

test.group('Roles create', () => {
  test('example test', async ({ assert }) => {
  })
```

      delete.spec.ts
Here is a potentially relevant text excerpt in `backend-adonis/tests/functional/roles/delete.spec.ts` starting at line 0:
```ts
import { test } from '@japa/runner'

test.group('Roles delete', () => {
  test('example test', async ({ assert }) => {
  })
```

      get.spec.ts
Here is a potentially relevant text excerpt in `backend-adonis/tests/functional/roles/get.spec.ts` starting at line 0:
```ts
import { test } from '@japa/runner'

test.group('Roles get', () => {
  test('example test', async ({ assert }) => {
  })
```

      update.spec.ts
Here is a potentially relevant text excerpt in `backend-adonis/tests/functional/roles/update.spec.ts` starting at line 0:
```ts
import { test } from '@japa/runner'

test.group('Roles update', () => {
  test('example test', async ({ assert }) => {
  })
```

    tenant/
tsconfig.json
Here is a potentially relevant text excerpt in `backend-adonis/tsconfig.json` starting at line 0:
```json
{
  "extends": "@adonisjs/tsconfig/tsconfig.app.json",
  "compilerOptions": {
    "rootDir": "./",
    "outDir": "./build"
```

```

# Client Structure
```
.vscode/
  extensions.json
Here is a potentially relevant text excerpt in `client/.vscode/extensions.json` starting at line 0:
```json
{
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=827846
  "recommendations": ["angular.ng-template"]
}
```

  launch.json
Here is a potentially relevant text excerpt in `client/.vscode/launch.json` starting at line 0:
```json
{
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
```

  tasks.json
Here is a potentially relevant text excerpt in `client/.vscode/tasks.json` starting at line 0:
```json
{
  // For more information, visit: https://go.microsoft.com/fwlink/?LinkId=733558
  "version": "2.0.0",
  "tasks": [
    {
```

angular.json
Here is a potentially relevant text excerpt in `client/angular.json` starting at line 0:
```json
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
```

package.json
Here is a potentially relevant text excerpt in `client/package.json` starting at line 0:
```json
{
  "name": "jelfjel-client",
  "version": "0.0.0",
  "scripts": {
    "ng": "ng",
```

package-lock.json
Here is a potentially relevant text excerpt in `client/package-lock.json` starting at line 0:
```json
{
  "name": "jelfjel-client",
  "version": "0.0.0",
  "lockfileVersion": 3,
  "requires": true,
```

public/
  assets/
    images/
README.md
Here is a potentially relevant text excerpt in `client/README.md` starting at line 0:
```md
# Client

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.0.2.

## Development server
```

src/
  app/
    app.component.html
Here is a potentially relevant text excerpt in `client/src/app/app.component.html` starting at line 0:
```html
<router-outlet/>
```

    app.component.sass
Here is a potentially relevant text excerpt in `client/src/app/app.component.sass` starting at line 0:
```sass
```

    app.component.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/app.component.spec.ts` starting at line 0:
```ts
import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
```

    app.component.ts
Here is a potentially relevant text excerpt in `client/src/app/app.component.ts` starting at line 0:
```ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
```

    app.config.ts
Here is a potentially relevant text excerpt in `client/src/app/app.config.ts` starting at line 0:
```ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http'
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
```

    app.routes.ts
Here is a potentially relevant text excerpt in `client/src/app/app.routes.ts` starting at line 0:
```ts
import { Routes } from '@angular/router';

import { LoginComponent } from '#features/auth/login/login.component';
import { RegisterComponent } from '#features/auth/register/register.component';
import { SetPasswordComponent } from '#features/auth/set-password/set-password.component';
```

    core/
      guards/
        admin.guard.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/core/guards/admin.guard.spec.ts` starting at line 0:
```ts
import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { adminGuard } from './admin.guard';

```

        admin.guard.ts
Here is a potentially relevant text excerpt in `client/src/app/core/guards/admin.guard.ts` starting at line 0:
```ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '#services/auth.service'

export const adminGuard: CanActivateFn = (route, state) => {
```

        auth.guard.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/core/guards/auth.guard.spec.ts` starting at line 0:
```ts
import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authGuard } from './auth.guard';

```

        auth.guard.ts
Here is a potentially relevant text excerpt in `client/src/app/core/guards/auth.guard.ts` starting at line 0:
```ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '#services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
```

        permission.guard.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/core/guards/permission.guard.spec.ts` starting at line 0:
```ts
import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { permissionGuard } from './permission.guard';

```

        permission.guard.ts
Here is a potentially relevant text excerpt in `client/src/app/core/guards/permission.guard.ts` starting at line 0:
```ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '#services/auth.service';

export const permissionGuard = (requiredPermissions: string[]): CanActivateFn => {
```

      interceptors/
        auth.interceptor.ts
Here is a potentially relevant text excerpt in `client/src/app/core/interceptors/auth.interceptor.ts` starting at line 0:
```ts
import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '#env/environment'

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
```

        tenant.interceptor.ts
Here is a potentially relevant text excerpt in `client/src/app/core/interceptors/tenant.interceptor.ts` starting at line 0:
```ts
import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '#env/environment'

export const tenantInterceptor: HttpInterceptorFn = (req, next) => {
  const tenant = /*window.location.hostname.split('.')[0] ?? */environment.defaultTenant;
```

      services/
        auth.service.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/core/services/auth.service.spec.ts` starting at line 0:
```ts
import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
```

        auth.service.ts
Here is a potentially relevant text excerpt in `client/src/app/core/services/auth.service.ts` starting at line 0:
```ts
import { HttpClient  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '#env/environment';
import { BehaviorSubject, map, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
```

        menu.service.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/core/services/menu.service.spec.ts` starting at line 0:
```ts
import { TestBed } from '@angular/core/testing';

import { MenuService } from './menu.service';

describe('MenuService', () => {
```

        menu.service.ts
Here is a potentially relevant text excerpt in `client/src/app/core/services/menu.service.ts` starting at line 0:
```ts
import { Injectable } from '@angular/core';
import { MenuItem, MenuResponse } from '#types/menu'
import { Observable, BehaviorSubject, of, map } from 'rxjs';
import { catchError } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http'
```

        permission.service.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/core/services/permission.service.spec.ts` starting at line 0:
```ts
import { TestBed } from '@angular/core/testing';

import { PermissionService } from './permission.service';

describe('PermissionService', () => {
```

        permission.service.ts
Here is a potentially relevant text excerpt in `client/src/app/core/services/permission.service.ts` starting at line 0:
```ts
import { Injectable } from '@angular/core';
import { environment } from '#env/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, throwError } from 'rxjs';
import { PermissionResponse } from '#types/permission';
```

        role.service.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/core/services/role.service.spec.ts` starting at line 0:
```ts
import { TestBed } from '@angular/core/testing';

import { RoleService } from './role.service';

describe('RoleService', () => {
```

        role.service.ts
Here is a potentially relevant text excerpt in `client/src/app/core/services/role.service.ts` starting at line 0:
```ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '#env/environment';
import { Observable } from 'rxjs';
```

      types/
        address.ts
Here is a potentially relevant text excerpt in `client/src/app/core/types/address.ts` starting at line 0:
```ts
export interface Address {
  id: number;
  type: 'shipping' | 'billing';
  addressLine1: string;
  addressLine2?: string;
```

        api_response.ts
Here is a potentially relevant text excerpt in `client/src/app/core/types/api_response.ts` starting at line 0:
```ts
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}```

        cart.ts
Here is a potentially relevant text excerpt in `client/src/app/core/types/cart.ts` starting at line 0:
```ts
import { ProductResponse } from './product'

export interface Cart {
  items: CartItem[];
}
```

        data_state.ts
Here is a potentially relevant text excerpt in `client/src/app/core/types/data_state.ts` starting at line 0:
```ts
export type DataState<T> = {
  status: 'idle' | 'loading' | 'success' | 'error';
  data?: T;
  error: string | null;
};```

        inventory.ts
Here is a potentially relevant text excerpt in `client/src/app/core/types/inventory.ts` starting at line 0:
```ts
export interface InventorySettings {
  reorderPoint: number
  reorderQuantity: number
  lowStockThreshold: number
}
```

        login_request.ts
Here is a potentially relevant text excerpt in `client/src/app/core/types/login_request.ts` starting at line 0:
```ts
export interface LoginRequest {
  email: string;
  password: string;
}
```

        login_response.ts
Here is a potentially relevant text excerpt in `client/src/app/core/types/login_response.ts` starting at line 0:
```ts
import { ApiResponse } from './api_response';
import { UserResponse } from './user';

export interface LoginResponseData {
  user: UserResponse
```

        market.ts
Here is a potentially relevant text excerpt in `client/src/app/core/types/market.ts` starting at line 0:
```ts
export interface Market {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
```

        marketplace.ts
Here is a potentially relevant text excerpt in `client/src/app/core/types/marketplace.ts` starting at line 0:
```ts
export interface Market {
  id: number;
  slug: string;
  name: string;
  domain: string;
```

        menu.ts
Here is a potentially relevant text excerpt in `client/src/app/core/types/menu.ts` starting at line 0:
```ts
import { ApiResponse } from './api_response';

export interface MenuItem {
  id: number;
  label: string;
```

        order.ts
Here is a potentially relevant text excerpt in `client/src/app/core/types/order.ts` starting at line 0:
```ts
import { Address, AddressRequest } from './address';
import { CartItem } from './cart';
import { UserResponse } from './user';
import { ApiResponse } from './api_response';

```

        paginated_response.ts
Here is a potentially relevant text excerpt in `client/src/app/core/types/paginated_response.ts` starting at line 0:
```ts
export interface PaginatedResponse<T> {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
```

        permission.ts
Here is a potentially relevant text excerpt in `client/src/app/core/types/permission.ts` starting at line 0:
```ts
export interface Permission {
  resource: string
  action: string
}

```

        product.ts
Here is a potentially relevant text excerpt in `client/src/app/core/types/product.ts` starting at line 0:
```ts
import { ApiResponse } from './api_response';
import { InventoryResponse } from './inventory'

interface BaseProduct {
  name: string
```

        role.ts
Here is a potentially relevant text excerpt in `client/src/app/core/types/role.ts` starting at line 0:
```ts
import { Permission, PermissionResponse } from './permission'

export interface Role {
  name: string
  permissions: Permission[]
```

        tenant.ts
Here is a potentially relevant text excerpt in `client/src/app/core/types/tenant.ts` starting at line 0:
```ts
export interface Tenant {
  name: string
  slug: string
  domain: string
  description?: string
```

        user.ts
Here is a potentially relevant text excerpt in `client/src/app/core/types/user.ts` starting at line 0:
```ts
import { Role, RoleResponse } from './role'

export interface User {
  id: number
  username: string
```

        user_registration_response.ts
Here is a potentially relevant text excerpt in `client/src/app/core/types/user_registration_response.ts` starting at line 0:
```ts
import { User } from './user';
import { ApiResponse } from './api_response';
import { Role } from './role';

export interface UserData {
```

    features/
      auth/
        login/
          login.component.html
Here is a potentially relevant text excerpt in `client/src/app/features/auth/login/login.component.html` starting at line 0:
```html
<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <mat-card class="w-full max-w-md bg-white shadow-lg rounded-lg">
    <div class="p-8">
      <mat-card-title class="text-center text-2xl font-bold mb-8">Login</mat-card-title>
      <mat-card-content>
```

          login.component.sass
Here is a potentially relevant text excerpt in `client/src/app/features/auth/login/login.component.sass` starting at line 0:
```sass
.login-container
  display: flex
  justify-content: center
  align-items: center
  height: 100vh
```

          login.component.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/features/auth/login/login.component.spec.ts` starting at line 0:
```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
```

          login.component.ts
Here is a potentially relevant text excerpt in `client/src/app/features/auth/login/login.component.ts` starting at line 0:
```ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '#shared/material/material.module'
```

        password-forgotten/
          password-forgotten.component.html
Here is a potentially relevant text excerpt in `client/src/app/features/auth/password-forgotten/password-forgotten.component.html` starting at line 0:
```html
<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <mat-card class="w-full max-w-md bg-white shadow-lg rounded-lg">
    <div class="p-8">
      <mat-card-title class="text-center text-2xl font-bold mb-8">
        Reset Password
```

          password-forgotten.component.sass
Here is a potentially relevant text excerpt in `client/src/app/features/auth/password-forgotten/password-forgotten.component.sass` starting at line 0:
```sass
:host
  display: block

.mat-mdc-form-field
  width: 100%
```

          password-forgotten.component.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/features/auth/password-forgotten/password-forgotten.component.spec.ts` starting at line 0:
```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordForgottenComponent } from './password-forgotten.component';

describe('PasswordForgottenComponent', () => {
```

          password-forgotten.component.ts
Here is a potentially relevant text excerpt in `client/src/app/features/auth/password-forgotten/password-forgotten.component.ts` starting at line 0:
```ts
// src/app/features/auth/password-forgotten/password-forgotten.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
```

        register/
          register.component.html
Here is a potentially relevant text excerpt in `client/src/app/features/auth/register/register.component.html` starting at line 0:
```html
<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <mat-card class="w-full max-w-md bg-white shadow-lg rounded-lg">
    <div class="p-8">
      <mat-card-title class="text-center text-2xl font-bold mb-8">Register</mat-card-title>
      <mat-card-content>
```

          register.component.sass
Here is a potentially relevant text excerpt in `client/src/app/features/auth/register/register.component.sass` starting at line 0:
```sass
.register-container
  display: flex
  justify-content: center
  align-items: center
  height: 100vh
```

          register.component.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/features/auth/register/register.component.spec.ts` starting at line 0:
```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
```

          register.component.ts
Here is a potentially relevant text excerpt in `client/src/app/features/auth/register/register.component.ts` starting at line 0:
```ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '#shared/material/material.module';
```

        set-password/
          set-password.component.html
Here is a potentially relevant text excerpt in `client/src/app/features/auth/set-password/set-password.component.html` starting at line 0:
```html
<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <mat-card class="w-full max-w-md bg-white shadow-lg rounded-lg">
    <div class="p-8">
      <mat-card-title class="text-center text-2xl font-bold mb-8">Reset your password</mat-card-title>
      <mat-card-content>
```

          set-password.component.sass
Here is a potentially relevant text excerpt in `client/src/app/features/auth/set-password/set-password.component.sass` starting at line 0:
```sass
```

          set-password.component.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/features/auth/set-password/set-password.component.spec.ts` starting at line 0:
```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetPasswordComponent } from './set-password.component';

describe('SetPasswordComponent', () => {
```

          set-password.component.ts
Here is a potentially relevant text excerpt in `client/src/app/features/auth/set-password/set-password.component.ts` starting at line 0:
```ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
```

        verify-account/
          verify-account.component.html
Here is a potentially relevant text excerpt in `client/src/app/features/auth/verify-account/verify-account.component.html` starting at line 0:
```html
<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <mat-card class="w-full max-w-md">
    <mat-card-content class="p-6">
      @if (isLoading) {
        <div class="text-center">
```

          verify-account.component.sass
Here is a potentially relevant text excerpt in `client/src/app/features/auth/verify-account/verify-account.component.sass` starting at line 0:
```sass
```

          verify-account.component.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/features/auth/verify-account/verify-account.component.spec.ts` starting at line 0:
```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyAccountComponent } from './verify-account.component';

describe('VerifyAccountComponent', () => {
```

          verify-account.component.ts
Here is a potentially relevant text excerpt in `client/src/app/features/auth/verify-account/verify-account.component.ts` starting at line 0:
```ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '#shared/material/material.module';
import { Observable } from 'rxjs';
```

      cart/
        cart-item/
          cart-item.component.html
Here is a potentially relevant text excerpt in `client/src/app/features/cart/cart-item/cart-item.component.html` starting at line 0:
```html
<mat-card class="p-4 mb-4">
  <div class="flex items-center gap-6">
    <!-- Product Image -->
    <img [src]="item.product.images?.[0]?.url || 'assets/placeholder.jpg'" 
         [alt]="item.product.name"
```

          cart-item.component.sass
Here is a potentially relevant text excerpt in `client/src/app/features/cart/cart-item/cart-item.component.sass` starting at line 0:
```sass
```

          cart-item.component.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/features/cart/cart-item/cart-item.component.spec.ts` starting at line 0:
```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartItemComponent } from './cart-item.component';

describe('CartItemComponent', () => {
```

          cart-item.component.ts
Here is a potentially relevant text excerpt in `client/src/app/features/cart/cart-item/cart-item.component.ts` starting at line 0:
```ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '#shared/material/material.module';
import { CartItem } from '#types/cart';
```

        cart-overview/
          cart-overview.component.html
Here is a potentially relevant text excerpt in `client/src/app/features/cart/cart-overview/cart-overview.component.html` starting at line 0:
```html
<div class="max-w-4xl mx-auto p-4">
  @if (cart$ | async; as cart) {
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Shopping Cart</h1>
      <button mat-raised-button 
```

          cart-overview.component.sass
Here is a potentially relevant text excerpt in `client/src/app/features/cart/cart-overview/cart-overview.component.sass` starting at line 0:
```sass
```

          cart-overview.component.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/features/cart/cart-overview/cart-overview.component.spec.ts` starting at line 0:
```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartOverviewComponent } from './cart-overview.component';

describe('CartOverviewComponent', () => {
```

          cart-overview.component.ts
Here is a potentially relevant text excerpt in `client/src/app/features/cart/cart-overview/cart-overview.component.ts` starting at line 0:
```ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { MaterialModule } from '#shared/material/material.module';
import { RouterModule, Router } from '@angular/router';
```

        services/
      checkout/
        checkout.component.html
Here is a potentially relevant text excerpt in `client/src/app/features/checkout/checkout.component.html` starting at line 0:
```html
<div class="max-w-4xl mx-auto p-4">
  <h1 class="text-2xl font-bold mb-6">Checkout</h1>

  @if (cart$ | async; as cart) {
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
```

        checkout.component.sass
Here is a potentially relevant text excerpt in `client/src/app/features/checkout/checkout.component.sass` starting at line 0:
```sass
```

        checkout.component.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/features/checkout/checkout.component.spec.ts` starting at line 0:
```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutComponent } from './checkout.component';

describe('CheckoutComponent', () => {
```

        checkout.component.ts
Here is a potentially relevant text excerpt in `client/src/app/features/checkout/checkout.component.ts` starting at line 0:
```ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '#shared/material/material.module';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { RouterModule, Router } from '@angular/router';
```

        services/
          checkout.service.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/features/checkout/services/checkout.service.spec.ts` starting at line 0:
```ts
import { TestBed } from '@angular/core/testing';

import { CheckoutService } from './checkout.service';

describe('CheckoutService', () => {
```

          checkout.service.ts
Here is a potentially relevant text excerpt in `client/src/app/features/checkout/services/checkout.service.ts` starting at line 0:
```ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '#env/environment';
import { ApiResponse } from '#types/api_response';
```

      dashboard/
        components/
          profile/
            profile.component.html
Here is a potentially relevant text excerpt in `client/src/app/features/dashboard/components/profile/profile.component.html` starting at line 0:
```html
<div class="container mx-auto p-6 max-w-2xl">
  <mat-card class="mb-6">
    <mat-card-header>
      <mat-card-title class="text-2xl font-bold">
        User Profile
```

            profile.component.sass
Here is a potentially relevant text excerpt in `client/src/app/features/dashboard/components/profile/profile.component.sass` starting at line 0:
```sass
```

            profile.component.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/features/dashboard/components/profile/profile.component.spec.ts` starting at line 0:
```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponent } from './profile.component';

describe('ProfileComponent', () => {
```

            profile.component.ts
Here is a potentially relevant text excerpt in `client/src/app/features/dashboard/components/profile/profile.component.ts` starting at line 0:
```ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MaterialModule } from '#shared/material/material.module';
```

        dashboard.component.html
Here is a potentially relevant text excerpt in `client/src/app/features/dashboard/dashboard.component.html` starting at line 0:
```html

<div class="dashboard-container">
  @if (currentUser$ | async; as user) {
    <!-- Welcome Section -->
    <mat-card class="mb-6">
```

        dashboard.component.sass
Here is a potentially relevant text excerpt in `client/src/app/features/dashboard/dashboard.component.sass` starting at line 0:
```sass
.dashboard
  padding: 20px

  .dashboard-grid
    display: grid
```

        dashboard.component.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/features/dashboard/dashboard.component.spec.ts` starting at line 0:
```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
```

        dashboard.component.ts
Here is a potentially relevant text excerpt in `client/src/app/features/dashboard/dashboard.component.ts` starting at line 0:
```ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '#shared/material/material.module';
import { Observable } from 'rxjs';
import { AuthService } from '#services/auth.service';
```

      marketplace/
        components/
          marketplace-product-card/
            marketplace-product-card.component.html
Here is a potentially relevant text excerpt in `client/src/app/features/marketplace/components/marketplace-product-card/marketplace-product-card.component.html` starting at line 0:
```html
<mat-card class="product-card">
  <img mat-card-image 
       [src]="product.images && product.images[0] ? product.images[0].url : 'assets/images/placeholder.jpg'" 
       [alt]="product.name">
  <mat-card-content>
```

            marketplace-product-card.component.sass
Here is a potentially relevant text excerpt in `client/src/app/features/marketplace/components/marketplace-product-card/marketplace-product-card.component.sass` starting at line 0:
```sass
.product-card
  transition: transform 0.2s ease-in-out
  &:hover
    transform: translateY(-4px)
  
```

            marketplace-product-card.component.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/features/marketplace/components/marketplace-product-card/marketplace-product-card.component.spec.ts` starting at line 0:
```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketplaceProductCardComponent } from './marketplace-product-card.component';

describe('MarketplaceProductCardComponent', () => {
```

            marketplace-product-card.component.ts
Here is a potentially relevant text excerpt in `client/src/app/features/marketplace/components/marketplace-product-card/marketplace-product-card.component.ts` starting at line 0:
```ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '#shared/material/material.module';
import { RouterModule } from '@angular/router';
```

          product-details/
            product-details.component.html
Here is a potentially relevant text excerpt in `client/src/app/features/marketplace/components/product-details/product-details.component.html` starting at line 0:
```html
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  @if (product$ | async; as vm) {
    @switch (vm.status) {
      @case ('loading') {
        <div class="flex justify-center items-center p-8">
```

            product-details.component.sass
Here is a potentially relevant text excerpt in `client/src/app/features/marketplace/components/product-details/product-details.component.sass` starting at line 0:
```sass
```

            product-details.component.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/features/marketplace/components/product-details/product-details.component.spec.ts` starting at line 0:
```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailsComponent } from './product-details.component';

describe('ProductDetailsComponent', () => {
```

            product-details.component.ts
Here is a potentially relevant text excerpt in `client/src/app/features/marketplace/components/product-details/product-details.component.ts` starting at line 0:
```ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '#shared/material/material.module';
import { RouterModule, ActivatedRoute } from '@angular/router';
```

        market-details/
          market-details.component.html
Here is a potentially relevant text excerpt in `client/src/app/features/marketplace/market-details/market-details.component.html` starting at line 0:
```html
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  @if (market$ | async; as vm) {
    @switch (vm.status) {
      @case ('loading') {
        <div class="flex justify-center items-center p-8">
```

          market-details.component.sass
Here is a potentially relevant text excerpt in `client/src/app/features/marketplace/market-details/market-details.component.sass` starting at line 0:
```sass
.product-card
  transition: transform 0.2s ease-in-out
  &:hover
    transform: translateY(-4px)
    
```

          market-details.component.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/features/marketplace/market-details/market-details.component.spec.ts` starting at line 0:
```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketDetailsComponent } from './market-details.component';

describe('MarketDetailsComponent', () => {
```

          market-details.component.ts
Here is a potentially relevant text excerpt in `client/src/app/features/marketplace/market-details/market-details.component.ts` starting at line 0:
```ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '#shared/material/material.module';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MarketService } from '../services/market.service';
```

        marketplace.component.html
Here is a potentially relevant text excerpt in `client/src/app/features/marketplace/marketplace.component.html` starting at line 0:
```html
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <!-- Hero Section -->
  <section class="mb-12">
    <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg">
      <div class="px-8 py-12 text-center text-white">
```

        marketplace.component.sass
Here is a potentially relevant text excerpt in `client/src/app/features/marketplace/marketplace.component.sass` starting at line 0:
```sass
.marketplace-discovery-container
  max-width: 1200px
  margin: 0 auto
  padding: 20px

```

        marketplace.component.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/features/marketplace/marketplace.component.spec.ts` starting at line 0:
```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketplaceComponent } from './marketplace.component';

describe('MarketplaceComponent', () => {
```

        marketplace.component.ts
Here is a potentially relevant text excerpt in `client/src/app/features/marketplace/marketplace.component.ts` starting at line 0:
```ts
import { MaterialModule } from '#shared/material/material.module';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
```

        marketplace.routes.ts
Here is a potentially relevant text excerpt in `client/src/app/features/marketplace/marketplace.routes.ts` starting at line 0:
```ts
import { Routes } from '@angular/router';
import { MarketplaceComponent } from './marketplace.component';
import { MarketsComponent } from './markets/markets.component';
import { MarketDetailsComponent } from './market-details/market-details.component';
import { MarketplaceProductDetailsComponent } from './components/product-details/product-details.component';
```

        markets/
          markets.component.html
Here is a potentially relevant text excerpt in `client/src/app/features/marketplace/markets/markets.component.html` starting at line 0:
```html
<p>markets works!</p>
```

          markets.component.sass
Here is a potentially relevant text excerpt in `client/src/app/features/marketplace/markets/markets.component.sass` starting at line 0:
```sass
```

          markets.component.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/features/marketplace/markets/markets.component.spec.ts` starting at line 0:
```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketsComponent } from './markets.component';

describe('MarketsComponent', () => {
```

          markets.component.ts
Here is a potentially relevant text excerpt in `client/src/app/features/marketplace/markets/markets.component.ts` starting at line 0:
```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-markets',
  imports: [],
```

        services/
          market.service.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/features/marketplace/services/market.service.spec.ts` starting at line 0:
```ts
import { TestBed } from '@angular/core/testing';

import { MarketService } from './market.service';

describe('MarketService', () => {
```

          market.service.ts
Here is a potentially relevant text excerpt in `client/src/app/features/marketplace/services/market.service.ts` starting at line 0:
```ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { 
  MarketResponse,
```

      orders/
        orders.component.html
Here is a potentially relevant text excerpt in `client/src/app/features/orders/orders.component.html` starting at line 0:
```html
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  <h1 class="text-2xl font-bold mb-6">My Orders</h1>

  @if (orders$ | async; as vm) {
    @switch (vm.status) {
```

        orders.component.sass
Here is a potentially relevant text excerpt in `client/src/app/features/orders/orders.component.sass` starting at line 0:
```sass
```

        orders.component.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/features/orders/orders.component.spec.ts` starting at line 0:
```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersComponent } from './orders.component';

describe('OrdersComponent', () => {
```

        orders.component.ts
Here is a potentially relevant text excerpt in `client/src/app/features/orders/orders.component.ts` starting at line 0:
```ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '#shared/material/material.module';
import { RouterModule } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
```

      products/
        create-product/
          create-product.component.html
Here is a potentially relevant text excerpt in `client/src/app/features/products/create-product/create-product.component.html` starting at line 0:
```html
<div class="container mx-auto p-4">
  <div class="max-w-2xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">{{ isEditMode ? 'Edit' : 'Create New' }} Product</h1>
      <button mat-button color="primary" (click)="goBack()">
```

          create-product.component.sass
Here is a potentially relevant text excerpt in `client/src/app/features/products/create-product/create-product.component.sass` starting at line 0:
```sass
:host
  .image-preview
    position: relative
    img
      transition: opacity 0.2s
```

          create-product.component.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/features/products/create-product/create-product.component.spec.ts` starting at line 0:
```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProductComponent } from './create-product.component';

describe('CreateProductComponent', () => {
```

          create-product.component.ts
Here is a potentially relevant text excerpt in `client/src/app/features/products/create-product/create-product.component.ts` starting at line 0:
```ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { 
```

        product-card/
          product-card.component.html
Here is a potentially relevant text excerpt in `client/src/app/features/products/product-card/product-card.component.html` starting at line 0:
```html
<mat-card class="product-card hover:shadow-lg transition-shadow">
  <img 
    [src]="product.images?.[0]?.url || 'assets/images/placeholder.png'"
    [alt]="product.name"
    class="w-full h-48 object-cover"
```

          product-card.component.sass
Here is a potentially relevant text excerpt in `client/src/app/features/products/product-card/product-card.component.sass` starting at line 0:
```sass
.product-card
  transition: transform 0.2s ease-in-out
  &:hover 
    transform: translateY(-4px)
  
```

          product-card.component.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/features/products/product-card/product-card.component.spec.ts` starting at line 0:
```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCardComponent } from './product-card.component';

describe('ProductCardComponent', () => {
```

          product-card.component.ts
Here is a potentially relevant text excerpt in `client/src/app/features/products/product-card/product-card.component.ts` starting at line 0:
```ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '#shared/material/material.module';
import { RouterModule } from '@angular/router';
import { ProductResponse } from '#types/product';
```

        product-details/
          product-details.component.html
Here is a potentially relevant text excerpt in `client/src/app/features/products/product-details/product-details.component.html` starting at line 0:
```html
```

          product-details.component.sass
Here is a potentially relevant text excerpt in `client/src/app/features/products/product-details/product-details.component.sass` starting at line 0:
```sass
.product-container
  padding: 20px
  max-width: 1200px
  margin: 0 auto

```

          product-details.component.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/features/products/product-details/product-details.component.spec.ts` starting at line 0:
```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsDetailsComponent } from './products-details.component';

describe('ProductsDetailsComponent', () => {
```

          product-details.component.ts
Here is a potentially relevant text excerpt in `client/src/app/features/products/product-details/product-details.component.ts` starting at line 0:
```ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialModule } from '#shared/material/material.module';
import { ConfirmDialogComponent } from '#shared/components/confirm-dialog/confirm-dialog.component';
import { ProductService } from '#shared/services/product.service';
```

        products.component.html
Here is a potentially relevant text excerpt in `client/src/app/features/products/products.component.html` starting at line 0:
```html
<div class="container mx-auto p-4">
  <!-- Header with Actions -->
  <div class="flex flex-wrap gap-4 items-center justify-between mb-6">
    <h1 class="text-2xl font-bold">Products</h1>
    <div class="flex items-center gap-4">
```

        products.component.sass
Here is a potentially relevant text excerpt in `client/src/app/features/products/products.component.sass` starting at line 0:
```sass
```

        products.component.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/features/products/products.component.spec.ts` starting at line 0:
```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsComponent } from './products.component';

describe('ProductsComponent', () => {
```

        products.component.ts
Here is a potentially relevant text excerpt in `client/src/app/features/products/products.component.ts` starting at line 0:
```ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '#shared/material/material.module';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
```

        products.routes.ts
Here is a potentially relevant text excerpt in `client/src/app/features/products/products.routes.ts` starting at line 0:
```ts
import { Routes } from '@angular/router';
import { ProductsComponent } from './products.component';
import { permissionGuard } from '#guards/permission.guard';

export const PRODUCTS_ROUTES: Routes = [
```

        products-list/
          products-list.component.html
Here is a potentially relevant text excerpt in `client/src/app/features/products/products-list/products-list.component.html` starting at line 0:
```html
<p>products-list works!</p>
```

          products-list.component.sass
Here is a potentially relevant text excerpt in `client/src/app/features/products/products-list/products-list.component.sass` starting at line 0:
```sass
```

          products-list.component.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/features/products/products-list/products-list.component.spec.ts` starting at line 0:
```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsListComponent } from './products-list.component';

describe('ProductsListComponent', () => {
```

          products-list.component.ts
Here is a potentially relevant text excerpt in `client/src/app/features/products/products-list/products-list.component.ts` starting at line 0:
```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-products-list',
  imports: [],
```

      roles/
        create-role/
          create-role.component.html
Here is a potentially relevant text excerpt in `client/src/app/features/roles/create-role/create-role.component.html` starting at line 0:
```html
<div class="container mx-auto p-4">
  <div class="max-w-2xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Create New Role</h1>
      <button mat-button color="primary" routerLink="/admin/roles">
```

          create-role.component.sass
Here is a potentially relevant text excerpt in `client/src/app/features/roles/create-role/create-role.component.sass` starting at line 0:
```sass
```

          create-role.component.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/features/roles/create-role/create-role.component.spec.ts` starting at line 0:
```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRoleComponent } from './create-role.component';

describe('CreateRoleComponent', () => {
```

          create-role.component.ts
Here is a potentially relevant text excerpt in `client/src/app/features/roles/create-role/create-role.component.ts` starting at line 0:
```ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MaterialModule } from '#shared/material/material.module';
import { RoleService } from '#services/role.service';
```

        role-details/
          role-details.component.html
Here is a potentially relevant text excerpt in `client/src/app/features/roles/role-details/role-details.component.html` starting at line 0:
```html
<div class="container mx-auto p-4">
  <div class="max-w-2xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Role Details</h1>
      <button mat-button color="primary" routerLink="/dashboard/roles">
```

          role-details.component.sass
Here is a potentially relevant text excerpt in `client/src/app/features/roles/role-details/role-details.component.sass` starting at line 0:
```sass
.permission-list
  display: flex
  flex-direction: column
  gap: 8px
  padding: 16px
```

          role-details.component.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/features/roles/role-details/role-details.component.spec.ts` starting at line 0:
```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleDetailsComponent } from './role-details.component';

describe('RoleDetailsComponent', () => {
```

          role-details.component.ts
Here is a potentially relevant text excerpt in `client/src/app/features/roles/role-details/role-details.component.ts` starting at line 0:
```ts
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaterialModule } from '#shared/material/material.module';
import { CommonModule } from '@angular/common';
```

        roles.component.html
Here is a potentially relevant text excerpt in `client/src/app/features/roles/roles.component.html` starting at line 0:
```html
<div class="container mx-auto p-4">
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-2xl font-bold">Roles & Permissions</h1>
    <button mat-raised-button color="primary" routerLink="/dashboard/roles/create">
      <mat-icon>add</mat-icon>
```

        roles.component.sass
Here is a potentially relevant text excerpt in `client/src/app/features/roles/roles.component.sass` starting at line 0:
```sass
.cdk-column-name
  width: 17%
  max-width: 150px
```

        roles.component.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/features/roles/roles.component.spec.ts` starting at line 0:
```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesComponent } from './roles.component';

describe('RolesComponent', () => {
```

        roles.component.ts
Here is a potentially relevant text excerpt in `client/src/app/features/roles/roles.component.ts` starting at line 0:
```ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
```

        roles.routes.ts
Here is a potentially relevant text excerpt in `client/src/app/features/roles/roles.routes.ts` starting at line 0:
```ts
import { Routes } from '@angular/router';
import { RolesComponent } from './roles.component';
import { permissionGuard } from '#guards/permission.guard';

export const ROLES_ROUTES: Routes = [
```

        roles-list/
          roles-list.component.html
Here is a potentially relevant text excerpt in `client/src/app/features/roles/roles-list/roles-list.component.html` starting at line 0:
```html
<p>roles-list works!</p>
```

          roles-list.component.sass
Here is a potentially relevant text excerpt in `client/src/app/features/roles/roles-list/roles-list.component.sass` starting at line 0:
```sass
```

          roles-list.component.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/features/roles/roles-list/roles-list.component.spec.ts` starting at line 0:
```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesListComponent } from './roles-list.component';

describe('RolesListComponent', () => {
```

          roles-list.component.ts
Here is a potentially relevant text excerpt in `client/src/app/features/roles/roles-list/roles-list.component.ts` starting at line 0:
```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-roles-list',
  imports: [],
```

      tenants/
        create-tenant/
          create-tenant.component.html
Here is a potentially relevant text excerpt in `client/src/app/features/tenants/create-tenant/create-tenant.component.html` starting at line 0:
```html
<div class="container mx-auto p-4">
  <div class="max-w-2xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">{{ isEditMode ? 'Edit' : 'Create New' }}  Tenant</h1>
      <button mat-button color="primary" routerLink="/dashboard/tenants">
```

          create-tenant.component.sass
Here is a potentially relevant text excerpt in `client/src/app/features/tenants/create-tenant/create-tenant.component.sass` starting at line 0:
```sass
```

          create-tenant.component.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/features/tenants/create-tenant/create-tenant.component.spec.ts` starting at line 0:
```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTenantComponent } from './create-tenant.component';

describe('CreateTenantComponent', () => {
```

          create-tenant.component.ts
Here is a potentially relevant text excerpt in `client/src/app/features/tenants/create-tenant/create-tenant.component.ts` starting at line 0:
```ts
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { 
  FormBuilder, 
  FormGroup, 
```

        services/
          tenant.service.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/features/tenants/services/tenant.service.spec.ts` starting at line 0:
```ts
import { TestBed } from '@angular/core/testing';

import { TenantService } from './tenant.service';

describe('TenantService', () => {
```

          tenant.service.ts
Here is a potentially relevant text excerpt in `client/src/app/features/tenants/services/tenant.service.ts` starting at line 0:
```ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '#env/environment';
import { 
```

        tenant-details/
          tenant-details.component.html
Here is a potentially relevant text excerpt in `client/src/app/features/tenants/tenant-details/tenant-details.component.html` starting at line 0:
```html
<div class="container mx-auto p-4">
  @if (tenantDetails$ | async; as tenantDetails) {
    @switch (tenantDetails.status) {
      @case ('loading') {
        <div class="flex justify-center items-center p-1">
```

          tenant-details.component.sass
Here is a potentially relevant text excerpt in `client/src/app/features/tenants/tenant-details/tenant-details.component.sass` starting at line 0:
```sass
.tenant-header
  margin-bottom: 20px

.tenant-avatar 
  width: 60px
```

          tenant-details.component.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/features/tenants/tenant-details/tenant-details.component.spec.ts` starting at line 0:
```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantDetailsComponent } from './tenant-details.component';

describe('TenantDetailsComponent', () => {
```

          tenant-details.component.ts
Here is a potentially relevant text excerpt in `client/src/app/features/tenants/tenant-details/tenant-details.component.ts` starting at line 0:
```ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '#shared/material/material.module';
import { MatDialog } from '@angular/material/dialog';
```

        tenants.component.html
Here is a potentially relevant text excerpt in `client/src/app/features/tenants/tenants.component.html` starting at line 0:
```html
<div class="container mx-auto p-4">
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-2xl font-bold">Tenant Management</h1>
    <button mat-raised-button color="primary" routerLink="/dashboard/tenants/create">
      <mat-icon>add</mat-icon>
```

        tenants.component.sass
Here is a potentially relevant text excerpt in `client/src/app/features/tenants/tenants.component.sass` starting at line 0:
```sass
```

        tenants.component.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/features/tenants/tenants.component.spec.ts` starting at line 0:
```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantsComponent } from './tenants.component';

describe('TenantsComponent', () => {
```

        tenants.component.ts
Here is a potentially relevant text excerpt in `client/src/app/features/tenants/tenants.component.ts` starting at line 0:
```ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
```

        tenants.routes.ts
Here is a potentially relevant text excerpt in `client/src/app/features/tenants/tenants.routes.ts` starting at line 0:
```ts
import { Routes } from '@angular/router';
import { TenantsComponent } from './tenants.component';
import { permissionGuard } from '#guards/permission.guard';

export const TENANTS_ROUTES: Routes = [
```

        tenants-list/
          tenants-list.component.html
Here is a potentially relevant text excerpt in `client/src/app/features/tenants/tenants-list/tenants-list.component.html` starting at line 0:
```html
<p>tenants-list works!</p>
```

          tenants-list.component.sass
Here is a potentially relevant text excerpt in `client/src/app/features/tenants/tenants-list/tenants-list.component.sass` starting at line 0:
```sass
```

          tenants-list.component.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/features/tenants/tenants-list/tenants-list.component.spec.ts` starting at line 0:
```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantsListComponent } from './tenants-list.component';

describe('TenantsListComponent', () => {
```

          tenants-list.component.ts
Here is a potentially relevant text excerpt in `client/src/app/features/tenants/tenants-list/tenants-list.component.ts` starting at line 0:
```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-tenants-list',
  imports: [],
```

      users/
        create-user/
          create-user.component.html
Here is a potentially relevant text excerpt in `client/src/app/features/users/create-user/create-user.component.html` starting at line 0:
```html
<div class="container mx-auto p-4">
  <div class="max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Create New User</h1>
    
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="space-y-6">
```

          create-user.component.sass
Here is a potentially relevant text excerpt in `client/src/app/features/users/create-user/create-user.component.sass` starting at line 0:
```sass
```

          create-user.component.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/features/users/create-user/create-user.component.spec.ts` starting at line 0:
```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUserComponent } from './create-user.component';

describe('CreateUserComponent', () => {
```

          create-user.component.ts
Here is a potentially relevant text excerpt in `client/src/app/features/users/create-user/create-user.component.ts` starting at line 0:
```ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { 
  ReactiveFormsModule, 
  FormBuilder, 
```

        services/
          user.service.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/features/users/services/user.service.spec.ts` starting at line 0:
```ts
import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';

describe('UserService', () => {
```

          user.service.ts
Here is a potentially relevant text excerpt in `client/src/app/features/users/services/user.service.ts` starting at line 0:
```ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '#env/environment';
import { Observable } from 'rxjs';
```

        user-details/
          user-details.component.html
Here is a potentially relevant text excerpt in `client/src/app/features/users/user-details/user-details.component.html` starting at line 0:
```html
<div class="container mx-auto p-4">
  <div class="max-w-2xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">User Details</h1>
      <button mat-button color="primary" routerLink="/dashboard/users">
```

          user-details.component.sass
Here is a potentially relevant text excerpt in `client/src/app/features/users/user-details/user-details.component.sass` starting at line 0:
```sass
```

          user-details.component.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/features/users/user-details/user-details.component.spec.ts` starting at line 0:
```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailsComponent } from './user-details.component';

describe('UserDetailsComponent', () => {
```

          user-details.component.ts
Here is a potentially relevant text excerpt in `client/src/app/features/users/user-details/user-details.component.ts` starting at line 0:
```ts
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
```

        users.component.html
Here is a potentially relevant text excerpt in `client/src/app/features/users/users.component.html` starting at line 0:
```html
<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4">User Management</h1>

  <!-- Button to open the user creation dialog -->
  <div class="flex flex-wrap justify-between items-center gap-2">
```

        users.component.sass
Here is a potentially relevant text excerpt in `client/src/app/features/users/users.component.sass` starting at line 0:
```sass
:host ::ng-deep
  .mat-mdc-row
    &:hover
      background-color: rgba(0, 0, 0, 0.04)
      cursor: pointer
```

        users.component.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/features/users/users.component.spec.ts` starting at line 0:
```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersComponent } from './users.component';

describe('UsersComponent', () => {
```

        users.component.ts
Here is a potentially relevant text excerpt in `client/src/app/features/users/users.component.ts` starting at line 0:
```ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
```

        users.routes.ts
Here is a potentially relevant text excerpt in `client/src/app/features/users/users.routes.ts` starting at line 0:
```ts
import { Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import { permissionGuard } from '#guards/permission.guard';

export const USER_ROUTES: Routes = [
```

        users-list/
          users-list.component.html
Here is a potentially relevant text excerpt in `client/src/app/features/users/users-list/users-list.component.html` starting at line 0:
```html
<p>users-list works!</p>
```

          users-list.component.sass
Here is a potentially relevant text excerpt in `client/src/app/features/users/users-list/users-list.component.sass` starting at line 0:
```sass
```

          users-list.component.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/features/users/users-list/users-list.component.spec.ts` starting at line 0:
```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersListComponent } from './users-list.component';

describe('UsersListComponent', () => {
```

          users-list.component.ts
Here is a potentially relevant text excerpt in `client/src/app/features/users/users-list/users-list.component.ts` starting at line 0:
```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-users-list',
  imports: [],
```

    layouts/
      admin-layout/
        admin-layout.component.html
Here is a potentially relevant text excerpt in `client/src/app/layouts/admin-layout/admin-layout.component.html` starting at line 0:
```html
<div class="admin-layout-container">
  <app-admin-navbar (toggleSidenav)="toggleSidenav()"></app-admin-navbar>
  
  <mat-sidenav-container class="admin-sidenav-container">
    <mat-sidenav 
```

        admin-layout.component.sass
Here is a potentially relevant text excerpt in `client/src/app/layouts/admin-layout/admin-layout.component.sass` starting at line 0:
```sass
.admin-layout-container
  height: 100vh
  display: flex
  flex-direction: column

```

        admin-layout.component.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/layouts/admin-layout/admin-layout.component.spec.ts` starting at line 0:
```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLayoutComponent } from './admin-layout.component';

describe('AdminLayoutComponent', () => {
```

        admin-layout.component.ts
Here is a potentially relevant text excerpt in `client/src/app/layouts/admin-layout/admin-layout.component.ts` starting at line 0:
```ts
import { Component, signal, computed } from '@angular/core';
import { RouterOutlet, Router, RouterModule } from '@angular/router'
import { MaterialModule } from '#shared/material/material.module'
import { AuthService } from '#services/auth.service'
import { SidenavComponent } from './sidenav/sidenav.component'
```

        admin-navbar/
          admin-navbar.component.html
Here is a potentially relevant text excerpt in `client/src/app/layouts/admin-layout/admin-navbar/admin-navbar.component.html` starting at line 0:
```html
<mat-toolbar color="primary" class="flex justify-between items-center">
  <div class="flex items-center">
    <button mat-icon-button (click)="toggleSidenav.emit()">
      <mat-icon>menu</mat-icon>
    </button>
```

          admin-navbar.component.sass
Here is a potentially relevant text excerpt in `client/src/app/layouts/admin-layout/admin-navbar/admin-navbar.component.sass` starting at line 0:
```sass
mat-toolbar 
  position: sticky
  top: 0
  z-index: 1000
  display: flex
```

          admin-navbar.component.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/layouts/admin-layout/admin-navbar/admin-navbar.component.spec.ts` starting at line 0:
```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNavbarComponent } from './admin-navbar.component';

describe('AdminNavbarComponent', () => {
```

          admin-navbar.component.ts
Here is a potentially relevant text excerpt in `client/src/app/layouts/admin-layout/admin-navbar/admin-navbar.component.ts` starting at line 0:
```ts
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { MaterialModule } from '#shared/material/material.module';
import { AuthService } from '#core/services/auth.service';

```

        sidenav/
          sidenav.component.html
Here is a potentially relevant text excerpt in `client/src/app/layouts/admin-layout/sidenav/sidenav.component.html` starting at line 0:
```html
<mat-nav-list>
  @for (item of menuItems$ | async; track item.id) {
    <mat-list-item 
      [routerLink]="item.route"
      routerLinkActive="active-link"
```

          sidenav.component.sass
Here is a potentially relevant text excerpt in `client/src/app/layouts/admin-layout/sidenav/sidenav.component.sass` starting at line 0:
```sass
.mat-nav-list
  width: 100%

.active-link
  background-color: rgba(0, 0, 0, 0.1)
```

          sidenav.component.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/layouts/admin-layout/sidenav/sidenav.component.spec.ts` starting at line 0:
```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavComponent } from './sidenav.component';

describe('SidenavComponent', () => {
```

          sidenav.component.ts
Here is a potentially relevant text excerpt in `client/src/app/layouts/admin-layout/sidenav/sidenav.component.ts` starting at line 0:
```ts
import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common'
import { Router, RouterModule } from '@angular/router'
import { BehaviorSubject, Observable } from 'rxjs';
import { MaterialModule } from '#shared/material/material.module'
```

      default-layout/
        default-layout.component.html
Here is a potentially relevant text excerpt in `client/src/app/layouts/default-layout/default-layout.component.html` starting at line 0:
```html


<div class="marketplace-container">
  <app-navbar />
  <app-breadcrumb />
```

        default-layout.component.sass
Here is a potentially relevant text excerpt in `client/src/app/layouts/default-layout/default-layout.component.sass` starting at line 0:
```sass
.marketplace-container
  display: flex
  flex-direction: column
  min-height: 100vh

```

        default-layout.component.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/layouts/default-layout/default-layout.component.spec.ts` starting at line 0:
```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultLayoutComponent } from './default-layout.component';

describe('DefaultLayoutComponent', () => {
```

        default-layout.component.ts
Here is a potentially relevant text excerpt in `client/src/app/layouts/default-layout/default-layout.component.ts` starting at line 0:
```ts
import { Component } from '@angular/core';
import { RouterOutlet} from '@angular/router';
import { NavbarComponent } from "#shared/components/navbar/navbar.component";
import { FooterComponent } from '#shared/components/footer/footer.component'
import { BreadcrumbComponent } from '#shared/components/breadcrumb/breadcrumb.component';
```

    shared/
      components/
        breadcrumb/
          breadcrumb.component.html
Here is a potentially relevant text excerpt in `client/src/app/shared/components/breadcrumb/breadcrumb.component.html` starting at line 0:
```html
@if (breadcrumbs$ | async; as breadcrumbs) {
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      @for (breadcrumb of breadcrumbs; track breadcrumb.label; let last = $last) {
        <li 
```

          breadcrumb.component.sass
Here is a potentially relevant text excerpt in `client/src/app/shared/components/breadcrumb/breadcrumb.component.sass` starting at line 0:
```sass
.breadcrumb
  display: flex
  align-items: center
  list-style: none
  padding: 0.75rem 1rem
```

          breadcrumb.component.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/shared/components/breadcrumb/breadcrumb.component.spec.ts` starting at line 0:
```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadcrumbComponent } from './breadcrumb.component';

describe('BreadcrumbComponent', () => {
```

          breadcrumb.component.ts
Here is a potentially relevant text excerpt in `client/src/app/shared/components/breadcrumb/breadcrumb.component.ts` starting at line 0:
```ts
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
```

          breadcrumb.service.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/shared/components/breadcrumb/breadcrumb.service.spec.ts` starting at line 0:
```ts
import { TestBed } from '@angular/core/testing';

import { BreadcrumbService } from './breadcrumb.service';

describe('BreadcrumbService', () => {
```

          breadcrumb.service.ts
Here is a potentially relevant text excerpt in `client/src/app/shared/components/breadcrumb/breadcrumb.service.ts` starting at line 0:
```ts
import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, distinctUntilChanged, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

```

        confirm-dialog/
          confirm-dialog.component.html
Here is a potentially relevant text excerpt in `client/src/app/shared/components/confirm-dialog/confirm-dialog.component.html` starting at line 0:
```html
<h2 mat-dialog-title>{{ data.title }}</h2>
<mat-dialog-content>
  <p>{{ data.message }}</p>
</mat-dialog-content>
<mat-dialog-actions align="end">
```

          confirm-dialog.component.sass
Here is a potentially relevant text excerpt in `client/src/app/shared/components/confirm-dialog/confirm-dialog.component.sass` starting at line 0:
```sass
:host
  display: block
  padding: 16px
  max-width: 400px

```

          confirm-dialog.component.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/shared/components/confirm-dialog/confirm-dialog.component.spec.ts` starting at line 0:
```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
```

          confirm-dialog.component.ts
Here is a potentially relevant text excerpt in `client/src/app/shared/components/confirm-dialog/confirm-dialog.component.ts` starting at line 0:
```ts
import { Component, Inject } from '@angular/core';
import { MaterialModule } from '#shared/material/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface ConfirmDialogData {
```

        footer/
          footer.component.html
Here is a potentially relevant text excerpt in `client/src/app/shared/components/footer/footer.component.html` starting at line 0:
```html
<footer class="marketplace-footer">
  <div class="footer-content">
    <div class="footer-column">
      <h4>Quick Links</h4>
      <ul>
```

          footer.component.sass
Here is a potentially relevant text excerpt in `client/src/app/shared/components/footer/footer.component.sass` starting at line 0:
```sass
.marketplace-footer
  background-color: #f4f4f4
  padding: 50px
  margin-top: auto

```

          footer.component.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/shared/components/footer/footer.component.spec.ts` starting at line 0:
```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
```

          footer.component.ts
Here is a potentially relevant text excerpt in `client/src/app/shared/components/footer/footer.component.ts` starting at line 0:
```ts
import { Component } from '@angular/core';
import { MaterialModule } from '#shared/material/material.module'

@Component({
  selector: 'app-footer',
```

        navbar/
          navbar.component.html
Here is a potentially relevant text excerpt in `client/src/app/shared/components/navbar/navbar.component.html` starting at line 0:
```html
<!-- <mat-toolbar color="primary">
  <span class="text-xl font-bold cursor-pointer" routerLink="/">JEFJEL</span> -->

    <!-- Navigation Links -->
    <!-- <div class="flex-1 ml-8 hidden md:flex space-x-4">
```

          navbar.component.sass
Here is a potentially relevant text excerpt in `client/src/app/shared/components/navbar/navbar.component.sass` starting at line 0:
```sass
mat-toolbar
  display: flex
  justify-content: space-between
  align-items: center
  padding: 0 16px
```

          navbar.component.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/shared/components/navbar/navbar.component.spec.ts` starting at line 0:
```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
```

          navbar.component.ts
Here is a potentially relevant text excerpt in `client/src/app/shared/components/navbar/navbar.component.ts` starting at line 0:
```ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { MaterialModule } from '#shared/material/material.module';
```

      material/
        material.module.ts
Here is a potentially relevant text excerpt in `client/src/app/shared/material/material.module.ts` starting at line 0:
```ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Material Form Controls
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
```

      services/
        address.service.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/shared/services/address.service.spec.ts` starting at line 0:
```ts
import { TestBed } from '@angular/core/testing';

import { AddressService } from './address.service';

describe('AddressService', () => {
```

        address.service.ts
Here is a potentially relevant text excerpt in `client/src/app/shared/services/address.service.ts` starting at line 0:
```ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '#env/environment';
import { ApiResponse } from '#types/api_response';
```

        cart.service.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/shared/services/cart.service.spec.ts` starting at line 0:
```ts
import { TestBed } from '@angular/core/testing';

import { CartService } from './cart.service';

describe('CartService', () => {
```

        cart.service.ts
Here is a potentially relevant text excerpt in `client/src/app/shared/services/cart.service.ts` starting at line 0:
```ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, take, switchMap } from 'rxjs/operators';
import { AuthService } from '#services/auth.service';
```

        category.service.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/shared/services/category.service.spec.ts` starting at line 0:
```ts
import { TestBed } from '@angular/core/testing';

import { CategoryService } from './category.service';

describe('CategoryService', () => {
```

        category.service.ts
Here is a potentially relevant text excerpt in `client/src/app/shared/services/category.service.ts` starting at line 0:
```ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '#env/environment';
import { CategoryResponse } from '#types/product';
```

        order.service.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/shared/services/order.service.spec.ts` starting at line 0:
```ts
import { TestBed } from '@angular/core/testing';

import { OrderService } from './order.service';

describe('OrderService', () => {
```

        order.service.ts
Here is a potentially relevant text excerpt in `client/src/app/shared/services/order.service.ts` starting at line 0:
```ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '#env/environment';
import { ApiResponse } from '#types/api_response';
```

        product.service.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/shared/services/product.service.spec.ts` starting at line 0:
```ts
import { TestBed } from '@angular/core/testing';

import { ProductService } from './product.service';

describe('ProductService', () => {
```

        product.service.ts
Here is a potentially relevant text excerpt in `client/src/app/shared/services/product.service.ts` starting at line 0:
```ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { environment } from '#env/environment';
```

        toast.service.spec.ts
Here is a potentially relevant text excerpt in `client/src/app/shared/services/toast.service.spec.ts` starting at line 0:
```ts
import { TestBed } from '@angular/core/testing';

import { ToastService } from './toast.service';

describe('ToastService', () => {
```

        toast.service.ts
Here is a potentially relevant text excerpt in `client/src/app/shared/services/toast.service.ts` starting at line 0:
```ts
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
```

  environments/
    environment.development.ts
Here is a potentially relevant text excerpt in `client/src/environments/environment.development.ts` starting at line 0:
```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3333/api/v1',
  defaultTenant: 'default'
};```

    environment.ts
Here is a potentially relevant text excerpt in `client/src/environments/environment.ts` starting at line 0:
```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3333/api/v1',
  defaultTenant: 'default'
};
```

  index.html
Here is a potentially relevant text excerpt in `client/src/index.html` starting at line 0:
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Jefjel</title>
```

  main.ts
Here is a potentially relevant text excerpt in `client/src/main.ts` starting at line 0:
```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
```

  styles.sass
Here is a potentially relevant text excerpt in `client/src/styles.sass` starting at line 0:
```sass
/* You can add global styles to this file, and also import other style files */
@import '@angular/material/prebuilt-themes/indigo-pink.css'

// Tailwind CSS 
@tailwind base
```

tailwind.config.js
Here is a potentially relevant text excerpt in `client/tailwind.config.js` starting at line 0:
```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
```

tsconfig.app.json
Here is a potentially relevant text excerpt in `client/tsconfig.app.json` starting at line 0:
```json
/* To learn more about Typescript configuration file: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html. */
/* To learn more about Angular compiler options: https://angular.dev/reference/configs/angular-compiler-options. */
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
```

tsconfig.json
Here is a potentially relevant text excerpt in `client/tsconfig.json` starting at line 0:
```json
/* To learn more about Typescript configuration file: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html. */
/* To learn more about Angular compiler options: https://angular.dev/reference/configs/angular-compiler-options. */
{
  "compileOnSave": false,
  "compilerOptions": {
```

tsconfig.spec.json
Here is a potentially relevant text excerpt in `client/tsconfig.spec.json` starting at line 0:
```json
/* To learn more about Typescript configuration file: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html. */
/* To learn more about Angular compiler options: https://angular.dev/reference/configs/angular-compiler-options. */
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
```

```
