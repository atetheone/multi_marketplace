# Diagramme de Classes d'Analyse - Système E-commerce Multi-tenant

```mermaid
classDiagram
    %% ===================================
    %% CLASSES MÉTIER CENTRALES
    %% ===================================
    
    class Tenant {
        +id: number
        +slug: string
        +name: string
        +domain: string
        +description: string
        +status: TenantStatus
        +rating: number
        +logo: string
        +coverImage: string
        +productCount: number
        +isFeatured: boolean
        +createdAt: DateTime
        +updatedAt: DateTime
        ---
        +activate(): void
        +suspend(): void
        +deactivate(): void
        +updateRating(rating: number): void
    }

    class User {
        +id: number
        +username: string
        +email: string
        +firstName: string
        +lastName: string
        +phoneNumber: string
        +status: UserStatus
        +emailVerifiedAt: DateTime
        +isActive: boolean
        +lastLoginAt: DateTime
        +createdAt: DateTime
        +updatedAt: DateTime
        ---
        +hasRole(role: string): boolean
        +hasPermission(permission: string): boolean
        +hasAllPermissions(permissions: string[]): boolean
        +belongsToTenant(tenantId: number): boolean
        +getFullName(): string
        +activate(): void
        +deactivate(): void
    }

    class Product {
        +id: number
        +tenantId: number
        +name: string
        +description: string
        +price: number
        +sku: string
        +weight: number
        +dimensions: string
        +isActive: boolean
        +isMarketplaceVisible: boolean
        +stockQuantity: number
        +minimumStock: number
        +createdAt: DateTime
        +updatedAt: DateTime
        ---
        +activate(): void
        +deactivate(): void
        +setMarketplaceVisibility(visible: boolean): void
        +updateStock(quantity: number): void
        +isInStock(): boolean
        +calculateTotalPrice(quantity: number): number
    }

    class Category {
        +id: number
        +tenantId: number
        +name: string
        +description: string
        +parentId: number
        +isActive: boolean
        +sortOrder: number
        +imageUrl: string
        +createdAt: DateTime
        +updatedAt: DateTime
        ---
        +activate(): void
        +deactivate(): void
        +hasSubcategories(): boolean
        +getPath(): string
    }

    class Order {
        +id: number
        +userId: number
        +tenantId: number
        +orderNumber: string
        +status: OrderStatus
        +subtotal: number
        +taxAmount: number
        +discountAmount: number
        +deliveryFee: number
        +total: number
        +paymentMethod: string
        +paymentStatus: PaymentStatus
        +notes: string
        +shippingAddressId: number
        +billingAddressId: number
        +estimatedDeliveryDate: DateTime
        +deliveredAt: DateTime
        +createdAt: DateTime
        +updatedAt: DateTime
        ---
        +calculateTotal(): number
        +updateStatus(status: OrderStatus): void
        +canBeCancelled(): boolean
        +canBeReturned(): boolean
        +addOrderItem(item: OrderItem): void
        +removeOrderItem(itemId: number): void
    }

    class OrderItem {
        +id: number
        +orderId: number
        +productId: number
        +quantity: number
        +unitPrice: number
        +totalPrice: number
        +discountAmount: number
        +notes: string
        +createdAt: DateTime
        +updatedAt: DateTime
        ---
        +calculateTotalPrice(): number
        +applyDiscount(amount: number): void
    }

    class Cart {
        +id: number
        +userId: number
        +tenantId: number
        +status: CartStatus
        +sessionId: string
        +total: number
        +itemCount: number
        +lastActivityAt: DateTime
        +createdAt: DateTime
        +updatedAt: DateTime
        ---
        +addItem(productId: number, quantity: number): void
        +removeItem(itemId: number): void
        +updateItemQuantity(itemId: number, quantity: number): void
        +clear(): void
        +calculateTotal(): number
        +isEmpty(): boolean
        +convertToOrder(): Order
    }

    class CartItem {
        +id: number
        +cartId: number
        +productId: number
        +quantity: number
        +unitPrice: number
        +addedAt: DateTime
        +updatedAt: DateTime
        ---
        +calculateSubtotal(): number
        +updateQuantity(quantity: number): void
    }

    class Address {
        +id: number
        +street: string
        +city: string
        +state: string
        +postalCode: string
        +country: string
        +zoneId: number
        +isDefault: boolean
        +addressType: AddressType
        +firstName: string
        +lastName: string
        +phoneNumber: string
        +instructions: string
        +createdAt: DateTime
        +updatedAt: DateTime
        ---
        +getFormattedAddress(): string
        +setAsDefault(): void
        +validatePostalCode(): boolean
    }

    class DeliveryZone {
        +id: number
        +tenantId: number
        +name: string
        +description: string
        +fee: number
        +minimumOrderAmount: number
        +estimatedDeliveryTime: string
        +isActive: boolean
        +createdAt: DateTime
        +updatedAt: DateTime
        ---
        +calculateDeliveryFee(orderAmount: number): number
        +isOrderEligible(orderAmount: number): boolean
        +activate(): void
        +deactivate(): void
    }

    class Delivery {
        +id: number
        +orderId: number
        +deliveryPersonId: number
        +zoneId: number
        +status: DeliveryStatus
        +scheduledDate: DateTime
        +deliveredAt: DateTime
        +estimatedArrival: DateTime
        +trackingNumber: string
        +notes: string
        +createdAt: DateTime
        +updatedAt: DateTime
        ---
        +updateStatus(status: DeliveryStatus): void
        +assignDeliveryPerson(personId: number): void
        +markAsDelivered(): void
        +getEstimatedArrival(): DateTime
    }

    class DeliveryPerson {
        +id: number
        +tenantId: number
        +firstName: string
        +lastName: string
        +phoneNumber: string
        +email: string
        +vehicleType: string
        +licenseNumber: string
        +isActive: boolean
        +isAvailable: boolean
        +currentLocation: string
        +rating: number
        +totalDeliveries: number
        +createdAt: DateTime
        +updatedAt: DateTime
        ---
        +markAvailable(): void
        +markUnavailable(): void
        +updateLocation(location: string): void
        +getFullName(): string
        +updateRating(rating: number): void
    }

    class Inventory {
        +id: number
        +productId: number
        +quantity: number
        +reservedQuantity: number
        +minimumStock: number
        +lastRestockedAt: DateTime
        +updatedAt: DateTime
        ---
        +reserveStock(quantity: number): boolean
        +releaseReservedStock(quantity: number): void
        +commitReservedStock(quantity: number): void
        +addStock(quantity: number): void
        +reduceStock(quantity: number): boolean
        +isInStock(quantity: number): boolean
        +needsRestock(): boolean
    }

    class Payment {
        +id: number
        +orderId: number
        +amount: number
        +paymentMethod: string
        +paymentProvider: string
        +transactionId: string
        +status: PaymentStatus
        +gatewayResponse: string
        +refundAmount: number
        +paidAt: DateTime
        +refundedAt: DateTime
        +createdAt: DateTime
        +updatedAt: DateTime
        ---
        +process(): boolean
        +refund(amount: number): boolean
        +markAsPaid(): void
        +markAsFailed(): void
        +isSuccessful(): boolean
        +canBeRefunded(): boolean
    }

    class Notification {
        +id: number
        +userId: number
        +tenantId: number
        +type: NotificationType
        +title: string
        +message: string
        +data: string
        +readAt: DateTime
        +sentAt: DateTime
        +channel: NotificationChannel
        +isRead: boolean
        +createdAt: DateTime
        ---
        +markAsRead(): void
        +markAsUnread(): void
        +send(): void
        +canBeSent(): boolean
    }

    %% ===================================
    %% CLASSES D'ASSOCIATION
    %% ===================================

    class UserTenant {
        +userId: number
        +tenantId: number
        +joinedAt: DateTime
        +isActive: boolean
        ---
        +activate(): void
        +deactivate(): void
    }

    class UserRole {
        +userId: number
        +roleId: number
        +tenantId: number
        +assignedAt: DateTime
        +assignedBy: number
        +isActive: boolean
        ---
        +activate(): void
        +deactivate(): void
    }

    class UserAddress {
        +userId: number
        +addressId: number
        +addressType: AddressType
        +isDefault: boolean
        +createdAt: DateTime
        ---
        +setAsDefault(): void
    }

    class ProductCategory {
        +productId: number
        +categoryId: number
        +isPrimary: boolean
        +createdAt: DateTime
        ---
        +setAsPrimary(): void
    }

    %% ===================================
    %% CLASSES DE CONTRÔLE & SERVICES
    %% ===================================

    class AuthService {
        -jwtService: JwtService
        -userService: UserService
        -hashService: HashService
        ---
        +login(credentials: LoginCredentials): AuthResponse
        +logout(token: string): void
        +register(userData: RegisterData): User
        +refreshToken(refreshToken: string): AuthResponse
        +verifyToken(token: string): boolean
        +resetPassword(email: string): void
        +changePassword(userId: number, oldPassword: string, newPassword: string): boolean
        +checkPermission(userId: number, permission: string): boolean
    }

    class OrderService {
        -inventoryService: InventoryService
        -paymentService: PaymentService
        -notificationService: NotificationService
        ---
        +createOrderFromCart(cartId: number, shippingAddressId: number, paymentMethod: string): Order
        +updateOrderStatus(orderId: number, status: OrderStatus): Order
        +cancelOrder(orderId: number, reason: string): boolean
        +calculateOrderTotal(cartItems: CartItem[], deliveryFee: number): number
        +processPayment(orderId: number): boolean
        +handleInventoryReservation(orderItems: OrderItem[]): boolean
        +sendOrderConfirmation(orderId: number): void
        -validateOrderItems(items: OrderItem[]): boolean
        -calculateDeliveryFee(zoneId: number, orderAmount: number): number
    }

    class CartService {
        -productService: ProductService
        -inventoryService: InventoryService
        ---
        +addItemToCart(cartId: number, productId: number, quantity: number): CartItem
        +removeItemFromCart(cartId: number, itemId: number): void
        +updateItemQuantity(cartId: number, itemId: number, quantity: number): CartItem
        +clearCart(cartId: number): void
        +getCartTotal(cartId: number): number
        +validateCartItems(cartId: number): boolean
        +mergeGuestCart(guestCartId: string, userCartId: number): void
    }

    class InventoryService {
        -notificationService: NotificationService
        ---
        +checkAvailability(productId: number, quantity: number): boolean
        +reserveStock(productId: number, quantity: number): boolean
        +releaseReservedStock(productId: number, quantity: number): void
        +commitReservedStock(productId: number, quantity: number): void
        +restockProduct(productId: number, quantity: number): void
        +getLowStockProducts(tenantId: number): Product[]
        +sendLowStockAlert(productId: number): void
        -updateProductStockStatus(productId: number): void
    }

    class PaymentService {
        -paymentGateway: PaymentGateway
        -orderService: OrderService
        ---
        +processPayment(orderId: number, paymentData: PaymentData): Payment
        +refundPayment(paymentId: number, amount: number, reason: string): boolean
        +verifyPaymentStatus(transactionId: string): PaymentStatus
        +handlePaymentWebhook(webhookData: object): void
        +getPaymentMethods(tenantId: number): PaymentMethod[]
        -validatePaymentData(paymentData: PaymentData): boolean
    }

    class NotificationService {
        -emailService: EmailService
        -smsService: SmsService
        -pushService: PushNotificationService
        ---
        +sendOrderConfirmation(orderId: number): void
        +sendDeliveryUpdate(deliveryId: number): void
        +sendLowStockAlert(productId: number): void
        +sendPaymentConfirmation(paymentId: number): void
        +sendCustomNotification(userId: number, notification: NotificationData): void
        +markNotificationAsRead(notificationId: number): void
        +getUserNotifications(userId: number, unreadOnly: boolean): Notification[]
    }

    class TenantService {
        -userService: UserService
        -roleService: RoleService
        ---
        +createTenant(tenantData: TenantData): Tenant
        +updateTenant(tenantId: number, updateData: object): Tenant
        +activateTenant(tenantId: number): void
        +suspendTenant(tenantId: number, reason: string): void
        +getTenantBySlug(slug: string): Tenant
        +getTenantUsers(tenantId: number): User[]
        +addUserToTenant(userId: number, tenantId: number): void
        +removeUserFromTenant(userId: number, tenantId: number): void
    }

    %% ===================================
    %% CONTRÔLEURS API
    %% ===================================

    class OrderController {
        -orderService: OrderService
        -cartService: CartService
        ---
        +create(request: Request, response: Response): Promise~Response~
        +show(request: Request, response: Response): Promise~Response~
        +index(request: Request, response: Response): Promise~Response~
        +update(request: Request, response: Response): Promise~Response~
        +cancel(request: Request, response: Response): Promise~Response~
        +track(request: Request, response: Response): Promise~Response~
        -validateCreateOrderRequest(request: Request): void
    }

    class ProductController {
        -productService: ProductService
        -categoryService: CategoryService
        ---
        +index(request: Request, response: Response): Promise~Response~
        +show(request: Request, response: Response): Promise~Response~
        +create(request: Request, response: Response): Promise~Response~
        +update(request: Request, response: Response): Promise~Response~
        +destroy(request: Request, response: Response): Promise~Response~
        +search(request: Request, response: Response): Promise~Response~
        +getByCategory(request: Request, response: Response): Promise~Response~
    }

    class CartController {
        -cartService: CartService
        ---
        +show(request: Request, response: Response): Promise~Response~
        +addItem(request: Request, response: Response): Promise~Response~
        +updateItem(request: Request, response: Response): Promise~Response~
        +removeItem(request: Request, response: Response): Promise~Response~
        +clear(request: Request, response: Response): Promise~Response~
        +checkout(request: Request, response: Response): Promise~Response~
    }

    class AuthController {
        -authService: AuthService
        ---
        +login(request: Request, response: Response): Promise~Response~
        +register(request: Request, response: Response): Promise~Response~
        +logout(request: Request, response: Response): Promise~Response~
        +refreshToken(request: Request, response: Response): Promise~Response~
        +forgotPassword(request: Request, response: Response): Promise~Response~
        +resetPassword(request: Request, response: Response): Promise~Response~
        +me(request: Request, response: Response): Promise~Response~
    }

    %% ===================================
    %% MIDDLEWARE & SÉCURITÉ
    %% ===================================

    class AuthMiddleware {
        -jwtService: JwtService
        ---
        +handle(ctx: HttpContext, next: NextFn, options: AuthOptions): Promise~void~
        -extractTokenFromHeader(header: string): string
        -validateToken(token: string): boolean
        -setUserContext(ctx: HttpContext, user: User): void
    }

    class CheckTenantMiddleware {
        -tenantService: TenantService
        ---
        +handle(ctx: HttpContext, next: NextFn): Promise~void~
        -extractTenantFromHeader(header: string): string
        -validateTenant(tenantSlug: string): Tenant
        -setTenantContext(ctx: HttpContext, tenant: Tenant): void
    }

    class PermissionMiddleware {
        -roleService: RoleService
        ---
        +handle(ctx: HttpContext, next: NextFn, permissions: string[]): Promise~void~
        -checkUserPermissions(user: User, permissions: string[]): boolean
        -handleUnauthorized(response: Response): void
    }

    class RoleMiddleware {
        -roleService: RoleService
        ---
        +handle(ctx: HttpContext, next: NextFn, roles: string[]): Promise~void~
        -checkUserRoles(user: User, roles: string[]): boolean
    }

    %% ===================================
    %% VALIDATORS
    %% ===================================

    class CreateOrderValidator {
        +cartId: number @required
        +shippingAddressId: number @required
        +billingAddressId: number
        +paymentMethod: string @required
        +notes: string @optional
        ---
        +validate(request: Request): ValidationResult
        -validateCartExists(cartId: number): boolean
        -validateAddressExists(addressId: number): boolean
        -validatePaymentMethod(method: string): boolean
    }

    class CreateProductValidator {
        +name: string @required
        +description: string @required
        +price: number @required @min(0)
        +sku: string @required @unique
        +categoryIds: number[] @required
        +weight: number @optional
        +dimensions: string @optional
        ---
        +validate(request: Request): ValidationResult
        -validateCategoriesExist(categoryIds: number[]): boolean
        -validateSkuUniqueness(sku: string, tenantId: number): boolean
    }

    class UpdateCartValidator {
        +productId: number @required
        +quantity: number @required @min(1)
        ---
        +validate(request: Request): ValidationResult
        -validateProductExists(productId: number): boolean
        -validateProductInStock(productId: number, quantity: number): boolean
    }

    %% ===================================
    %% ÉNUMÉRATIONS
    %% ===================================

    class TenantStatus {
        <<enumeration>>
        ACTIVE
        INACTIVE
        SUSPENDED
        PENDING
        CLOSED
    }

    class UserStatus {
        <<enumeration>>
        ACTIVE
        INACTIVE
        PENDING_VERIFICATION
        SUSPENDED
        BANNED
    }

    class OrderStatus {
        <<enumeration>>
        PENDING
        CONFIRMED
        PROCESSING
        SHIPPED
        OUT_FOR_DELIVERY
        DELIVERED
        CANCELLED
        RETURNED
        REFUNDED
    }

    class CartStatus {
        <<enumeration>>
        ACTIVE
        ORDERED
        ABANDONED
        ARCHIVED
    }

    class PaymentStatus {
        <<enumeration>>
        PENDING
        PROCESSING
        COMPLETED
        FAILED
        CANCELLED
        REFUNDED
        PARTIALLY_REFUNDED
    }

    class DeliveryStatus {
        <<enumeration>>
        PENDING
        ASSIGNED
        PICKED_UP
        IN_TRANSIT
        OUT_FOR_DELIVERY
        DELIVERED
        FAILED
        RETURNED
    }

    class NotificationType {
        <<enumeration>>
        ORDER_CONFIRMATION
        ORDER_STATUS_UPDATE
        DELIVERY_UPDATE
        PAYMENT_CONFIRMATION
        LOW_STOCK_ALERT
        SYSTEM_NOTIFICATION
        MARKETING
    }

    class NotificationChannel {
        <<enumeration>>
        EMAIL
        SMS
        PUSH_NOTIFICATION
        IN_APP
    }

    class AddressType {
        <<enumeration>>
        SHIPPING
        BILLING
        BOTH
    }

    %% ===================================
    %% RELATIONS MÉTIER PRINCIPALES
    %% ===================================

    %% Relations Tenant
    Tenant "1" --> "*" User : "contains"
    Tenant "1" --> "*" Product : "owns"
    Tenant "1" --> "*" Order : "processes"
    Tenant "1" --> "*" Cart : "manages"
    Tenant "1" --> "*" Category : "organizes"
    Tenant "1" --> "*" DeliveryZone : "defines"
    Tenant "1" --> "*" DeliveryPerson : "employs"
    Tenant "1" --> "*" Notification : "sends"

    %% Relations User
    User "1" --> "*" Order : "places"
    User "1" --> "*" Cart : "owns"
    User "1" --> "*" Notification : "receives"
    User "*" --> "*" Tenant : "belongs to"
    User "*" --> "*" Address : "has"

    %% Relations Product
    Product "1" --> "1" Inventory : "has stock"
    Product "1" --> "*" CartItem : "added to cart"
    Product "1" --> "*" OrderItem : "ordered"
    Product "*" --> "*" Category : "belongs to"

    %% Relations Order
    Order "1" --> "*" OrderItem : "contains"
    Order "1" --> "1" Payment : "paid by"
    Order "1" --> "1" Delivery : "shipped via"
    Order "*" --> "1" Address : "shipped to"
    Order "*" --> "1" Address : "billed to"
    Order "*" --> "1" DeliveryZone : "delivered in"

    %% Relations Cart
    Cart "1" --> "*" CartItem : "contains"

    %% Relations Delivery
    Delivery "*" --> "1" DeliveryPerson : "assigned to"
    Delivery "*" --> "1" DeliveryZone : "within"

    %% Relations Address
    Address "*" --> "1" DeliveryZone : "located in"

    %% Relations d'association
    UserTenant "1" --> "1" User : "user"
    UserTenant "1" --> "1" Tenant : "tenant"
    UserRole "1" --> "1" User : "user"
    UserAddress "1" --> "1" User : "user"
    UserAddress "1" --> "1" Address : "address"
    ProductCategory "1" --> "1" Product : "product"
    ProductCategory "1" --> "1" Category : "category"

    %% ===================================
    %% RELATIONS DE CONTRÔLE
    %% ===================================

    %% Flux d'authentification et autorisation
    AuthMiddleware --> CheckTenantMiddleware : "chain"
    CheckTenantMiddleware --> PermissionMiddleware : "chain"
    PermissionMiddleware --> RoleMiddleware : "chain"

    %% Contrôleurs vers Services
    OrderController ..> OrderService : "uses"
    OrderController ..> CartService : "uses"
    ProductController ..> ProductService : "uses"
    CartController ..> CartService : "uses"
    AuthController ..> AuthService : "uses"

    %% Services vers Services
    OrderService ..> InventoryService : "uses"
    OrderService ..> PaymentService : "uses"
    OrderService ..> NotificationService : "uses"
    CartService ..> InventoryService : "uses"
    PaymentService ..> OrderService : "uses"
    InventoryService ..> NotificationService : "uses"

    %% Validators
    OrderController ..> CreateOrderValidator : "validates with"
    ProductController ..> CreateProductValidator : "validates with"
    CartController ..> UpdateCartValidator : "validates with"

    %% Services vers Entités
    AuthService ..> User : "manages"
    OrderService ..> Order : "creates/manages"
    OrderService ..> OrderItem : "creates"
    OrderService ..> Payment : "initiates"
    CartService ..> Cart : "manages"
    CartService ..> CartItem : "manages"
    InventoryService ..> Inventory : "updates"
    TenantService ..> Tenant : "manages"
    NotificationService ..> Notification : "creates/sends"

    %% Énumérations
    Tenant ..> TenantStatus : "has status"
    User ..> UserStatus : "has status"
    Order ..> OrderStatus : "has status"
    Cart ..> CartStatus : "has status"
    Payment ..> PaymentStatus : "has status"
    Delivery ..> DeliveryStatus : "has status"
    Notification ..> NotificationType : "has type"
    Notification ..> NotificationChannel : "sent via"
    Address ..> AddressType : "has type"
```

## Description du Diagramme

Ce diagramme de classes d'analyse représente l'architecture complète du système e-commerce multi-tenant avec :

### 🏢 **Entités Métier Centrales**
- **Tenant** : Entité centrale gérant l'isolation multi-tenant
- **User** : Utilisateurs avec appartenance multi-tenant et système RBAC
- **Product/Category** : Catalogue de produits avec catégorisation
- **Order/OrderItem** : Système de commandes avec gestion d'état complexe
- **Cart/CartItem** : Panier d'achat avec persistance
- **Inventory** : Gestion des stocks avec réservation
- **Payment** : Système de paiement avec support multi-gateway
- **Delivery** : Gestion des livraisons avec assignation aux livreurs

### 🔧 **Services Applicatifs**
- **Services métier** : OrderService, CartService, InventoryService, PaymentService
- **Services transversaux** : AuthService, NotificationService, TenantService
- **Gestion centralisée** des règles métier et orchestration des opérations

### 🎯 **Couche de Contrôle**
- **Contrôleurs REST** pour exposition API
- **Middleware** de sécurité (Auth, Tenant, Permissions)
- **Validators** pour validation des données d'entrée

### 🔗 **Relations et Multiplicités**
- **Isolation multi-tenant** : Chaque entité métier liée à un tenant
- **Gestion des utilisateurs** : Relations M:N entre User/Tenant avec rôles
- **Intégrité référentielle** : Relations définies avec multiplicités appropriées

### 📊 **Énumérations**
- **Statuts d'entités** : OrderStatus, PaymentStatus, DeliveryStatus
- **Types fonctionnels** : NotificationType, AddressType, etc.

Ce diagramme couvre l'ensemble des besoins identifiés dans l'analyse du système et fournit une base solide pour l'implémentation.