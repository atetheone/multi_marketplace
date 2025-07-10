# Architecture Minimaliste - Système E-commerce Multi-tenant

## Figure 4 : Architecture DDD Modulith - Vue Simplifiée

Cette représentation minimaliste capture l'essence de l'architecture modulith multi-tenant en se concentrant sur les concepts fondamentaux : les domaines métier, leurs interactions, et l'infrastructure technique.

```plantuml
@startuml Architecture-Minimale-DDD-Modulith

skinparam packageStyle rectangle
skinparam monochrome false
skinparam backgroundColor white

!define PRIMARY #2563eb
!define SECONDARY #64748b
!define SUCCESS #059669
!define WARNING #d97706
!define DANGER #dc2626

' Client Layer
rectangle "Client Angular 19" as client #lightblue

' Infrastructure
rectangle "Infrastructure\n(Auth + Tenant + API)" as infra #orange

' Domain Modules
package "Domain Modules (Modulith)" as domains #lightgray {
    rectangle "👤 User\nAuth + RBAC" as user_domain PRIMARY
    rectangle "🏢 Tenant\nMulti-tenancy" as tenant_domain SUCCESS  
    rectangle "📦 Product\nCatalog + Stock" as product_domain WARNING
    rectangle "🛒 Order\nCommandes + Cart" as order_domain DANGER
    rectangle "💳 Payment\nTransactions" as payment_domain #lightsteelblue
    rectangle "🚚 Delivery\nLogistique + Zones" as delivery_domain #lightcoral
    rectangle "🔔 Notification\nEvents + Comm" as notification_domain #plum
}

' External Services
rectangle "External\nDB + Cloud + SMTP" as external #lavender

' Connections
client --> infra : "HTTP/WS"
infra --> domains : "Secure Access"

' Inter-domain communications (DDD)
order_domain --> product_domain : "Stock Check"
order_domain --> payment_domain : "Process Payment"
order_domain --> delivery_domain : "Shipping"
order_domain --> notification_domain : "Events"
payment_domain --> notification_domain : "Payment Events"
delivery_domain --> notification_domain : "Delivery Events"
user_domain --> tenant_domain : "Tenant Validation"

' External connections
domains --> external : "Persistence + Services"

' Annotations
note right of domains : **DDD Bounded Contexts**\n• Autonomous modules\n• Domain-driven design\n• Event-driven communication
note right of external : **Tech Stack**\n• PostgreSQL + Lucid ORM\n• Cloudinary (Images)\n• SMTP (Email)\n• Socket.IO (Real-time)
note top of client : **Frontend**\n• Angular 19 + TypeScript\n• Material Design\n• Real-time WebSocket

@enduml
```

## Architecture C4 Model - Niveau Contexte

```plantuml
@startuml C4-Context-Level

!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Context.puml

LAYOUT_WITH_LEGEND()

title System Context - E-commerce Multi-tenant Platform

Person(customer, "Customer", "End user shopping on marketplace")
Person(vendor, "Vendor", "Tenant managing products/orders")  
Person(admin, "Platform Admin", "Super admin managing tenants")

System(ecommerce, "E-commerce Platform", "Multi-tenant marketplace with DDD modulith architecture")

System_Ext(cloudinary, "Cloudinary", "Image & file storage service")
System_Ext(smtp, "SMTP Server", "Email delivery service")
System_Ext(payment_gateway, "Payment Gateway", "External payment processing")

Rel(customer, ecommerce, "Browse, order products")
Rel(vendor, ecommerce, "Manage products, view orders")
Rel(admin, ecommerce, "Manage tenants, configure platform")

Rel(ecommerce, cloudinary, "Store/retrieve images")
Rel(ecommerce, smtp, "Send notifications")
Rel(ecommerce, payment_gateway, "Process payments")

@enduml
```

## Vue Fonctionnelle Simplifiée

```plantuml
@startuml Functional-View-Simple

skinparam defaultTextAlignment center

rectangle "🌐 **Frontend SPA**\nAngular 19 + TypeScript" as frontend #lightblue

rectangle "🚪 **Security Layer**\nJWT + Multi-tenant + RBAC" as security #orange

package "**Business Core**" as business #lightgray {
    circle "Users" as users #lightcyan
    circle "Products" as products #lightyellow  
    circle "Orders" as orders #lightpink
    circle "Payments" as payments #lightsteelblue
}

rectangle "💾 **Data Layer**\nPostgreSQL + External APIs" as data #lightgreen

frontend --> security
security --> business
business --> data

users <--> products : "Browse"
products <--> orders : "Purchase"
orders <--> payments : "Pay"

note right of business : **Domain Logic**\n• Bounded contexts\n• Event-driven\n• Multi-tenant isolation

@enduml
```

## Diagramme de Flux Minimaliste

```plantuml
@startuml Minimal-Flow

skinparam activity {
  BackgroundColor #f8fafc
  BorderColor #64748b
  FontColor #1e293b
}

start
:👤 **User Request**;
:🔒 **Auth + Tenant Resolution**;
:🏗️ **Domain Module Processing**;
:💾 **Data Persistence**;
:🔔 **Event Notification**;
:📤 **Response**;
stop

note right : **Key Principles**\n• Multi-tenant security\n• Domain-driven design\n• Event-driven architecture\n• Modulith deployment

@enduml
```

## Avantages de la Représentation Minimaliste

### **🎯 Clarté Conceptuelle**

- **Vision d'ensemble** : Architecture globale en un coup d'œil
- **Concepts essentiels** : Focus sur les éléments architecturaux clés
- **Communication efficace** : Compréhension rapide pour stakeholders

### **📐 Abstraction Appropriée**

- **Détails techniques cachés** : Concentration sur les patterns architecturaux
- **Relations importantes** : Inter-dépendances entre domaines mises en évidence
- **Évolutivité visible** : Possibilité d'extension claire

### **🔄 Utilisations Pratiques**

- **Présentation exécutive** : Vision stratégique de l'architecture
- **Onboarding équipe** : Compréhension rapide pour nouveaux développeurs
- **Documentation vivante** : Évolution facile avec le système
- **Décisions architecturales** : Support pour choix techniques futurs

Cette approche minimaliste révèle **l'élégance de votre conception** : une architecture complexe rendue compréhensible par sa structure logique et ses patterns bien définis.
