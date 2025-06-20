# Diagramme de Classes - Création de Commande (Create Order)

```mermaid
classDiagram
    %% Classes Métiers Principales
    class User {
        +id: number
        +tenantId: number
    }

    class Tenant {
        +id: number
        +name: string
    }

    class Order {
        +id: number
        +userId: number
        +tenantId: number
        +addressId: number
        +status: OrderStatus
        +paymentMethod: string
        +subtotal: number
        +deliveryFee: number
        +total: number
    }

    class OrderItem {
        +id: number
        +orderId: number
        +productId: number
        +quantity: number
        +unitPrice: number
        +totalPrice: number
    }

    class Product {
        +id: number
        +name: string
        +price: number
        +tenantId: number
    }

    class Inventory {
        +id: number
        +productId: number
        +quantity: number
        +reservedQuantity: number
        +reserveStock()
        +releaseReservedStock()
    }

    class Cart {
        +id: number
        +userId: number
        +tenantId: number
        +status: CartStatus
    }

    class CartItem {
        +id: number
        +cartId: number
        +productId: number
        +quantity: number
    }

    class Address {
        +id: number
        +street: string
        +city: string
        +zoneId: number
    }

    class DeliveryZone {
        +id: number
        +name: string
        +fee: number
        +tenantId: number
    }

    class Payment {
        +id: number
        +orderId: number
        +paymentMethod: string
        +amount: number
        +status: PaymentStatus
    }

    %% Services Essentiels
    class OrderService {
        +createOrderFromCart(cartId, addressId, paymentMethod) Order
        +calculateOrderTotal(cartItems, deliveryFee) number
        -validateCartItems(cartItems) boolean
        -calculateDeliveryFee(addressId) number
    }

    class InventoryService {
        +reserveStock(productId, quantity) boolean
        +checkAvailability(productId, quantity) boolean
    }

    %% Controller et Sécurité
    class OrderController {
        +create(request, response) Response
    }

    class AuthMiddleware {
        +handle(ctx, next, options) void
    }

    class CheckTenantMiddleware {
        +handle(ctx, next) void
    }

    class CreateOrderValidator {
        +cartId: number
        +shippingAddress: object
        +paymentMethod: string
        +validate(request) object
    }

    %% Relations Métiers
    User "1" --> "*" Order : "passe"
    User "1" --> "*" Cart : "possède"
    Tenant "1" --> "*" Order : "contient"
    Tenant "1" --> "*" Product : "vend"
    
    Order "1" --> "*" OrderItem : "contient"
    Order "1" --> "1" Payment : "associé à"
    Order "*" --> "1" Address : "livré à"
    
    Product "1" --> "1" Inventory : "stock"
    Product "1" --> "*" CartItem : "dans panier"
    Cart "1" --> "*" CartItem : "contient"
    Address "*" --> "1" DeliveryZone : "dans zone"
    
    %% Flux de Création de Commande
    AuthMiddleware --> CheckTenantMiddleware
    CheckTenantMiddleware --> OrderController
    OrderController ..> CreateOrderValidator : "valide"
    OrderController ..> OrderService : "utilise"
    OrderService ..> InventoryService : "utilise"
    
    OrderService ..> Order : "crée"
    OrderService ..> OrderItem : "crée"
    OrderService ..> Payment : "initialise"
    InventoryService ..> Inventory : "réserve stock"

    %% Enums
    class OrderStatus {
        <<enumeration>>
        PENDING
        PROCESSING
        SHIPPED
        DELIVERED
        CANCELLED
        RETURNED
    }

    class CartStatus {
        <<enumeration>>
        ACTIVE
        ORDERED
        ARCHIVE
    }

    class PaymentStatus {
        <<enumeration>>
        PENDING
        COMPLETED
        FAILED
        REFUNDED
    }

    Order ..> OrderStatus
    Cart ..> CartStatus
    Payment ..> PaymentStatus
```

## Description du Flux de Création de Commande

### 1. **Authentification et Sécurité**

- **AuthMiddleware** : Authentification de l'utilisateur
- **CheckTenantMiddleware** : Résolution du **Tenant** multi-tenant
- **CreateOrderValidator** : Validation des données de commande

### 2. **Création de Commande**

- **User** authentifié transforme son **Cart** en **Order**
- **OrderService** coordonne la création avec validation métier
- **InventoryService** réserve le stock des **Products**

### 3. **Finalisation**

- Création des **OrderItems** pour chaque produit
- Calcul des frais de livraison via **DeliveryZone**
- Initialisation du **Payment** 
- Mise à jour du statut du **Cart**

Le diagramme simplifié se concentre sur les classes essentielles au processus de création de commande, éliminant les composants techniques non critiques tout en préservant la logique métier et la sécurité multi-tenant.
