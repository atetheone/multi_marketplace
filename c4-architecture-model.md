# Architecture C4 Model - Système E-commerce Multi-tenant

## Modèle C4 : Représentation Hiérarchique de l'Architecture

Le modèle C4 (Context, Containers, Components, Code) offre une approche structurée pour documenter l'architecture logicielle à différents niveaux d'abstraction, du contexte système jusqu'aux détails d'implémentation.

## Niveau 1 : Contexte Système

```plantuml
@startuml C4-Level1-Context

!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Context.puml

LAYOUT_WITH_LEGEND()

title System Context - Multi-tenant E-commerce Platform

Person(customer, "Customer", "End user browsing and purchasing products on marketplace")
Person(vendor, "Vendor/Merchant", "Tenant managing their product catalog and orders")  
Person(admin, "Platform Admin", "Super admin managing tenants and platform configuration")
Person(delivery_staff, "Delivery Personnel", "Staff handling logistics and deliveries")

System(ecommerce_platform, "Multi-tenant E-commerce Platform", "Modular e-commerce system with tenant isolation, product catalog, order management, and real-time notifications")

System_Ext(cloudinary, "Cloudinary", "Cloud-based image and file storage service")
System_Ext(smtp_service, "SMTP Server", "Email delivery service for notifications")
System_Ext(payment_gateway, "Payment Gateway", "External payment processing service")

Rel(customer, ecommerce_platform, "Browse products, place orders, track deliveries", "HTTPS/WebSocket")
Rel(vendor, ecommerce_platform, "Manage products, view orders, handle inventory", "HTTPS/WebSocket")
Rel(admin, ecommerce_platform, "Manage tenants, configure platform, monitor system", "HTTPS/WebSocket")
Rel(delivery_staff, ecommerce_platform, "View delivery assignments, update delivery status", "HTTPS/WebSocket")

Rel(ecommerce_platform, cloudinary, "Upload/retrieve product images", "HTTPS")
Rel(ecommerce_platform, smtp_service, "Send email notifications", "SMTP")
Rel(ecommerce_platform, payment_gateway, "Process payments and refunds", "HTTPS/API")

@enduml
```

## Niveau 2 : Conteneurs

```plantuml
@startuml C4-Level2-Containers

!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml

LAYOUT_WITH_LEGEND()

title Container Diagram - Multi-tenant E-commerce Platform

Person(users, "Users", "Customers, Vendors, Admins, Delivery Staff")

System_Boundary(ecommerce_boundary, "Multi-tenant E-commerce Platform") {
    Container(spa, "Single Page Application", "Angular 19, TypeScript", "Provides user interface for all platform functionality with real-time updates")
    
    Container(api_gateway, "API Gateway", "AdonisJS 6 Middleware", "Handles authentication, tenant resolution, and request routing")
    
    Container(modulith_app, "Modulith Application", "AdonisJS 6, Node.js", "Core business logic organized in domain modules with DDD principles")
    
    Container(database, "Database", "PostgreSQL", "Stores all application data with multi-tenant isolation")
    
    Container(real_time, "Real-time Service", "Socket.IO", "Handles real-time notifications and live updates")
}

System_Ext(cloudinary, "Cloudinary", "Image Storage")
System_Ext(smtp, "SMTP Server", "Email Service")
System_Ext(payment_gateway, "Payment Gateway", "Payment Processing")

Rel(users, spa, "Uses", "HTTPS")
Rel(spa, api_gateway, "API calls", "JSON/HTTPS")
Rel(spa, real_time, "Real-time updates", "WebSocket")

Rel(api_gateway, modulith_app, "Routes requests", "Internal calls")
Rel(modulith_app, database, "Reads from and writes to", "SQL/TCP")
Rel(modulith_app, real_time, "Triggers notifications", "Internal events")

Rel(modulith_app, cloudinary, "Uploads/downloads images", "HTTPS")
Rel(modulith_app, smtp, "Sends emails", "SMTP")
Rel(modulith_app, payment_gateway, "Processes payments", "HTTPS")

@enduml
```

## Niveau 3 : Composants - Modulith Application

```plantuml
@startuml C4-Level3-Components

!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Component.puml

LAYOUT_WITH_LEGEND()

title Component Diagram - Modulith Application (Domain Modules)

Container(api_gateway, "API Gateway", "AdonisJS Middleware", "Authentication & Tenant Resolution")
Container(database, "Database", "PostgreSQL", "Multi-tenant Data Storage")
Container(external_services, "External Services", "Cloudinary, SMTP", "External APIs")

System_Boundary(modulith_boundary, "Modulith Application") {
    
    Component(user_module, "User Management Module", "Controllers, Services, Models", "Handles authentication, authorization, and user management with RBAC")
    
    Component(tenant_module, "Tenant Module", "Controllers, Services, Models", "Manages multi-tenancy, tenant configuration, and isolation")
    
    Component(product_module, "Product Catalog Module", "Controllers, Services, Models", "Manages products, categories, inventory, and product images")
    
    Component(order_module, "Order Management Module", "Controllers, Services, Models", "Handles order lifecycle, cart management, and order processing")
    
    Component(payment_module, "Payment Module", "Controllers, Services, Models", "Processes payments, transactions, and financial operations")
    
    Component(delivery_module, "Delivery Module", "Controllers, Services, Models", "Manages addresses, delivery zones, and logistics")
    
    Component(notification_module, "Notification Module", "Services, Models", "Handles email, real-time notifications, and event broadcasting")
}

Rel(api_gateway, user_module, "Routes auth requests")
Rel(api_gateway, tenant_module, "Routes tenant requests")
Rel(api_gateway, product_module, "Routes product requests")
Rel(api_gateway, order_module, "Routes order requests")
Rel(api_gateway, payment_module, "Routes payment requests")
Rel(api_gateway, delivery_module, "Routes delivery requests")

' Inter-module communications (DDD)
Rel(order_module, product_module, "Checks inventory", "Domain events")
Rel(order_module, payment_module, "Processes payment", "Domain events")
Rel(order_module, delivery_module, "Manages shipping", "Domain events")
Rel(order_module, notification_module, "Sends order notifications", "Domain events")
Rel(payment_module, notification_module, "Sends payment notifications", "Domain events")
Rel(delivery_module, notification_module, "Sends delivery notifications", "Domain events")
Rel(user_module, tenant_module, "Validates tenant access", "Internal calls")

' Database connections
Rel(user_module, database, "User, roles, permissions data")
Rel(tenant_module, database, "Tenant configuration data")
Rel(product_module, database, "Product, inventory data")
Rel(order_module, database, "Order, cart data")
Rel(payment_module, database, "Payment, transaction data")
Rel(delivery_module, database, "Address, delivery data")
Rel(notification_module, database, "Notification data")

' External service connections
Rel(product_module, external_services, "Image upload/storage")
Rel(notification_module, external_services, "Email sending")

@enduml
```

## Niveau 4 : Code - Exemple Module Order

```plantuml
@startuml C4-Level4-Code-Order-Module

!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Component.puml

LAYOUT_LEFT_RIGHT()

title Code Diagram - Order Management Module Internal Structure

System_Boundary(order_module_boundary, "Order Management Module") {
    
    Component(order_controller, "OrderController", "AdonisJS Controller", "HTTP endpoints for order operations (create, show, update, cancel)")
    
    Component(order_service, "OrderService", "Business Logic", "Core order processing logic, validation, and orchestration")
    
    Component(cart_service, "CartService", "Business Logic", "Shopping cart management and validation")
    
    Component(order_repository, "OrderRepository", "Data Access", "Data persistence layer for orders using Lucid ORM")
    
    Component(order_model, "Order", "Domain Model", "Order aggregate root with business rules and validation")
    
    Component(order_item_model, "OrderItem", "Domain Model", "Order line item entity with product and pricing information")
    
    Component(order_validator, "OrderValidator", "Validation", "Input validation using VineJS schema validation")
    
    Component(order_events, "OrderEvents", "Domain Events", "Domain events for order lifecycle (created, updated, cancelled)")
}

Container(database, "PostgreSQL", "Database", "Persistent storage")
Container(external_modules, "Other Modules", "Product, Payment, Delivery", "External domain modules")

' Internal relations
Rel(order_controller, order_validator, "Validates input")
Rel(order_controller, order_service, "Delegates business logic")
Rel(order_service, cart_service, "Manages cart operations")
Rel(order_service, order_repository, "Persists data")
Rel(order_repository, order_model, "Maps to domain model")
Rel(order_repository, order_item_model, "Maps to domain model")
Rel(order_service, order_events, "Publishes domain events")

' External relations
Rel(order_repository, database, "SQL queries")
Rel(order_events, external_modules, "Notifies other modules")

@enduml
```

## Vue d'Ensemble - Architecture Layers C4

```plantuml
@startuml C4-Architecture-Layers

!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Context.puml

LAYOUT_WITH_LEGEND()

title C4 Model - Architecture Layers Overview

System_Boundary(level1, "Level 1 - System Context") {
    Person(stakeholders, "Stakeholders", "Users, Vendors, Admins")
    System(platform, "E-commerce Platform", "Multi-tenant marketplace")
    System_Ext(externals, "External Systems", "Cloudinary, SMTP, Payments")
}

System_Boundary(level2, "Level 2 - Containers") {
    Container(frontend, "Frontend SPA", "Angular 19")
    Container(backend, "Backend API", "AdonisJS 6")
    Container(database, "Database", "PostgreSQL")
}

System_Boundary(level3, "Level 3 - Components") {
    Component(modules, "Domain Modules", "7 Bounded Contexts")
    Component(middleware, "Middleware Stack", "Auth + Tenant + RBAC")
    Component(infrastructure, "Infrastructure", "ORM + Events + Services")
}

System_Boundary(level4, "Level 4 - Code") {
    Component(controllers, "Controllers", "HTTP Endpoints")
    Component(services, "Services", "Business Logic")
    Component(models, "Models", "Domain Entities")
    Component(repositories, "Repositories", "Data Access")
}

' Relationships between levels
Rel(level1, level2, "zooms into")
Rel(level2, level3, "zooms into")
Rel(level3, level4, "zooms into")

@enduml
```

## Avantages du Modèle C4 pour ce Système

### **🎯 Communication Hiérarchique**

- **Niveau 1 (Context)** : Vision business pour stakeholders non-techniques
- **Niveau 2 (Containers)** : Architecture technique pour architectes et leads
- **Niveau 3 (Components)** : Structure modulaire pour développeurs seniors
- **Niveau 4 (Code)** : Détails d'implémentation pour développeurs

### **📐 Abstraction Progressive**

- **Zoom-in contrôlé** : Détail progressif selon le besoin
- **Séparation des préoccupations** : Chaque niveau a son audience
- **Documentation vivante** : Évolution avec le système
- **Onboarding efficace** : Apprentissage par couches

### **🏗️ Mise en Valeur de l'Architecture**

- **Modulith DDD** : Bounded contexts clairement identifiés
- **Multi-tenancy** : Isolation et sécurité visibles
- **Event-driven** : Communications inter-modules explicites
- **Scalabilité** : Possibilité d'évolution vers microservices évidente

Le modèle C4 révèle parfaitement la sophistication de votre architecture modulith tout en maintenant la clarté nécessaire pour différents types d'audience technique.