# Diagramme de Classes de Conception - Création de Commande

## Vue d'ensemble
Ce diagramme de classes de conception représente l'architecture des classes impliquées dans le processus de création de commande, basé sur l'implémentation AdonisJS du backend.

## Diagramme de Classes

```mermaid
classDiagram
    %% Middleware Classes
    class AuthMiddleware {
        +handle(ctx, next, options)
    }
    
    class CheckTenantMiddleware {
        +handle(ctx, next)
    }

    %% Controller Classes
    class OrderController {
        -orderService: OrderService
        +create(request, auth, response)
    }

    %% Service Classes
    class OrderService {
        -cartService: CartService
        -addressService: AddressService
        -inventoryService: InventoryService
        -notificationService: NotificationService
        +createOrderFromCart(userId, tenantId, orderData)
    }

    class CartService {
        +getUserCartById(cartId, userId, tenantId)
    }

    class InventoryService {
        +reserveStock(productId, quantityToReserve, tenantId)
    }

    class AddressService {
        +createAddress(userId, tenantId, data, trx)
    }

    class NotificationService {
        +createNotification(dto)
    }

    %% Model Classes
    class Order {
        +id: number
        +userId: number
        +tenantId: number
        +addressId: number
        +status: string
        +paymentMethod: string
        +subtotal: number
        +total: number
        +deliveryFee: number
    }

    class OrderItem {
        +id: number
        +orderId: number
        +productId: number
        +quantity: number
        +unitPrice: number
    }

    class Cart {
        +id: number
        +userId: number
        +tenantId: number
        +status: string
    }

    class CartItem {
        +id: number
        +cartId: number
        +productId: number
        +quantity: number
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
        +tenantId: number
    }

    class User {
        +id: number
        +email: string
    }

    class Tenant {
        +id: string
        +slug: string
    }

    class Address {
        +id: number
        +addressLine1: string
        +city: string
        +country: string
        +tenantId: number
        +zoneId: number
    }

    class DeliveryZone {
        +id: number
        +deliveryFee: number
        +tenantId: number
    }

    class Notification {
        +id: number
        +type: string
        +title: string
        +message: string
        +userId: number
        +tenantId: number
    }

    %% Service Dependencies
    OrderController --> OrderService
    OrderService --> CartService
    OrderService --> InventoryService
    OrderService --> AddressService
    OrderService --> NotificationService

    %% Model Associations
    Order "1" --> "1..*" OrderItem
    Order "1" --> "1" User
    Order "1" --> "1" Tenant
    Order "1" --> "1" Address

    Cart "1" --> "1..*" CartItem
    Cart "1" --> "1" User
    Cart "1" --> "1" Tenant

    OrderItem "1" --> "1" Product
    CartItem "1" --> "1" Product
    
    Product "1" --> "1" Inventory
    Product "1" --> "1" Tenant

    Address "1" --> "1" DeliveryZone
    Address "1" --> "1" Tenant

    Notification "1" --> "1" User
    Notification "1" --> "1" Tenant

    %% Middleware Flow
    CheckTenantMiddleware --> Tenant
    AuthMiddleware --> User
```

## Responsabilités des Classes

### **Couche Middleware**
- **AuthMiddleware**: Authentification JWT des utilisateurs
- **CheckTenantMiddleware**: Résolution du contexte tenant via X-Tenant-Slug

### **Couche Contrôleur**
- **OrderController**: Gestion des requêtes HTTP pour les commandes

### **Couche Service (Logique Métier)**
- **OrderService**: Orchestrateur principal du processus de commande
- **CartService**: Gestion des paniers d'achat
- **InventoryService**: Gestion des stocks et réservations
- **AddressService**: Gestion des adresses de livraison
- **NotificationService**: Notifications utilisateur
- **NotificationRolesService**: Notifications basées sur les rôles

### **Couche Modèle (Persistance)**
- **Order/OrderItem**: Représentation des commandes
- **Cart/CartItem**: Représentation des paniers
- **Product/Inventory**: Gestion des produits et stocks
- **User/Tenant**: Entités multi-tenant
- **Address/DeliveryZone**: Gestion géographique
- **Notification**: Système de notifications

## Patterns de Conception Utilisés

1. **Dependency Injection**: Services injectés dans OrderService
2. **Repository Pattern**: Séparation modèles/services
3. **Multi-Tenant Pattern**: Isolation par tenantId 
4. **Transaction Script**: OrderService.createOrderFromCart()
5. **Observer Pattern**: Système de notifications
6. **Strategy Pattern**: Différents types de notifications

## Points Clés de l'Architecture

- **Séparation des responsabilités** entre middleware, contrôleurs et services
- **Architecture multi-tenant** avec isolation par tenant
- **Gestion transactionnelle** pour la cohérence des données  
- **Système de notifications dual** (utilisateur + rôles)
- **Gestion d'inventaire à 3 niveaux** (total, réservé, disponible)