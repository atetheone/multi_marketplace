# Diagramme de Séquence - Création de Commande (Create Order)

Ce diagramme illustre le processus de création d'une commande e-commerce depuis la réception de la requête HTTP jusqu'à la réponse client. Le flux se décompose en cinq phases principales :

**Phase d'authentification et validation** : Les middlewares d'authentification et de tenant vérifient les droits d'accès et valident les données de la requête.

**Phase de traitement métier** : Le service orchestrateur récupère le panier, valide et réserve le stock via le service d'inventaire, puis traite l'adresse de livraison via le service d'adresse.

**Phase de persistance transactionnelle** : Une transaction garantit la cohérence lors de la création de la commande, de ses lignes, et du traitement du paiement via le service de paiement.

**Phase de notification** : Le système enregistre puis diffuse les notifications à tous les acteurs (client, admin, logistique) via des canaux multiples.

**Phase de réponse** : Le contrôleur formate la réponse API et la retourne via la chaîne de middlewares jusqu'au client avec le statut 201 Created.

L'architecture respecte le principe de séparation des responsabilités avec des services spécialisés orchestrés par le service principal OrderService.

```mermaid
sequenceDiagram
    participant Client
    participant AuthMW as AuthMiddleware
    participant TenantMW as CheckTenantMiddleware
    participant Validator as CreateOrderValidator
    participant Controller as OrderController
    participant OrderService
    participant InventoryService
    participant CartService
    participant AddressService
    participant PaymentService
    participant NotificationService
    participant DB as Database

    Note over Client,DB: Processus de création de commande multi-tenant

    Client->>+AuthMW: POST /api/v1/orders<br/>{cartId, shippingAddress, paymentMethod}
    
    Note over AuthMW,TenantMW: Pipeline de Middlewares
    AuthMW->>AuthMW: Authentification JWT
    AuthMW->>DB: Vérifier utilisateur
    DB-->>AuthMW: Utilisateur authentifié
    AuthMW->>+TenantMW: next() avec auth.user
    
    TenantMW->>TenantMW: Extraire X-Tenant-Slug header
    TenantMW->>DB: findBy('slug', tenantSlug)
    DB-->>TenantMW: Tenant résolu
    TenantMW->>+Validator: next() avec request.tenant

    Note over Validator,Controller: Validation et Contrôleur
    Validator->>Validator: Valider cartId, address, paymentMethod
    Validator->>+Controller: create() avec données validées
    
    Controller->>Controller: Extraire userId, tenantId du contexte
    Controller->>+OrderService: createOrderFromCart(userId, tenantId, orderData)

    Note over OrderService,DB: Logique Métier de Création
    
    OrderService->>+CartService: getUserCartById(cartId, userId)
    CartService->>DB: SELECT cart + cart_items + products
    DB-->>CartService: Panier avec articles
    CartService-->>-OrderService: Cart validé avec items
    
    OrderService->>OrderService: validateCartItems(cartItems)
    
    OrderService->>+InventoryService: validateAndReserveStock(cartItems)
    loop Pour chaque CartItem
        InventoryService->>DB: CHECK disponibilité produit
        DB-->>InventoryService: Stock disponible
        InventoryService->>DB: UPDATE inventory SET reservedQuantity += quantity
        DB-->>InventoryService: Stock réservé
    end
    InventoryService-->>-OrderService: Réservation réussie
    
    OrderService->>+AddressService: handleShippingAddress(addressData, userId)
    AddressService->>DB: CREATE/VALIDATE shipping address
    DB-->>AddressService: Adresse validée/créée
    AddressService-->>-OrderService: Address avec deliveryZone
    
    OrderService->>OrderService: calculateOrderTotal(cartItems, deliveryFee)

    Note over OrderService,DB: Transaction de Création
    OrderService->>DB: BEGIN TRANSACTION
    
    OrderService->>DB: INSERT INTO orders (userId, tenantId, addressId, ...)
    DB-->>OrderService: Order créée (id)
    
    loop Pour chaque CartItem
        OrderService->>DB: INSERT INTO order_items (orderId, productId, quantity, ...)
        DB-->>OrderService: OrderItem créé
    end
    
    OrderService->>+PaymentService: initializePayment(order, paymentMethod)
    PaymentService->>DB: INSERT INTO payments (orderId, method, amount, status='PENDING')
    DB-->>PaymentService: Payment record créé
    PaymentService-->>-OrderService: Payment initialisé
    
    OrderService->>+CartService: updateCartStatus(cartId, 'ORDERED')
    CartService->>DB: UPDATE carts SET status = 'ORDERED'
    DB-->>CartService: Status mis à jour
    CartService-->>-OrderService: Cart marqué comme commandé
    
    OrderService->>DB: COMMIT TRANSACTION
    DB-->>OrderService: Transaction validée

    Note over OrderService,NotificationService: Notifications Post-Création
    OrderService->>+NotificationService: notifyOrderCreated(order, user, tenant)
    
    par Stockage et envoi notifications
        NotificationService->>DB: INSERT notification client (type='order_created')
        DB-->>NotificationService: Notification stockée
        NotificationService->>NotificationService: Envoyer email si user connecté
    and
        NotificationService->>DB: INSERT notification admin (type='new_order')
        DB-->>NotificationService: Notification stockée
        NotificationService->>NotificationService: Notifier admin/vendeur
    and
        NotificationService->>DB: INSERT notification logistique (type='order_to_process')
        DB-->>NotificationService: Notification stockée
        NotificationService->>NotificationService: Notifier équipe logistique
    end
    
    NotificationService-->>-OrderService: Notifications stockées et envoyées

    OrderService-->>-Controller: Order créée avec succès
    Controller->>Controller: Formatter réponse API
    Controller-->>-Validator: 201 Created + order data
    Validator-->>-TenantMW: Response
    TenantMW-->>-AuthMW: Response
    AuthMW-->>-Client: 201 - Commande créée avec succès

    Note over Client,DB: Commande créée avec isolation tenant et stock réservé
```

## Description du Flux

### 1. **Pipeline de Sécurité**

- Authentification JWT de l'utilisateur
- Résolution du tenant via header `X-Tenant-Slug`
- Validation des données de commande

### 2. **Validation et Contrôle**

- Validation des paramètres (cartId, address, paymentMethod)
- Extraction du contexte utilisateur/tenant
- Délégation au service métier

### 3. **Logique Métier**

- Récupération et validation du panier
- Réservation du stock pour tous les produits
- Validation/création de l'adresse de livraison
- Calcul du total avec frais de livraison

### 4. **Transaction de Création**

- Transaction atomique pour créer Order + OrderItems
- Initialisation du Payment en statut PENDING
- Mise à jour du statut du Cart à "ORDERED"

### 5. **Notifications**

- **Stockage BD** : Toutes les notifications sont persistées pour traçabilité
- **Notifications parallèles** : Client, admin et logistique
- **Cohérence** : Users déconnectés reçoivent les notifications à la reconnexion
- **Multi-canal** : Email + notifications in-app

## Points Clés

- **Multi-tenant** : Isolation stricte par tenant
- **Atomicité** : Transaction pour garantir la cohérence
- **Réservation stock** : Évite la survente
- **Sécurité** : Authentification + validation à chaque étape
- **Notifications** : Stockage BD pour cohérence + communication multi-canal
