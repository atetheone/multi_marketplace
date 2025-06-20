# Architecture Globale - Système E-commerce Multi-tenant

## Figure 3 : Architecture en couches avec stack technologique

Ce diagramme présente l'architecture globale du système e-commerce multi-tenant, organisée en couches avec les technologies et frameworks utilisés à chaque niveau. L'architecture suit le pattern en couches avec séparation claire des responsabilités entre présentation, logique métier, et persistance.

```mermaid
graph TB
    subgraph "🌐 Couche Présentation"
        direction TB
        subgraph "Frontend - Angular 19.0.0"
            A1[fa:fa-desktop Client Web]
            A2[fa:fa-mobile-alt Client Mobile]
            A3[fa:fa-tablet-alt Tablet]
        end
        
        subgraph "Technologies Frontend"
            F1[Angular Material 19.0.1<br/>Components UI]
            F2[Tailwind CSS 3.4.15<br/>Styling]
            F3[RxJS 7.8.0<br/>State Management]
            F4[Socket.IO Client 4.8.1<br/>Real-time]
            F5[TypeScript 5.6<br/>Type Safety]
        end
    end

    subgraph "🔗 Couche Communication"
        direction LR
        HTTP[fa:fa-exchange-alt HTTP/HTTPS<br/>REST API]
        WS[fa:fa-plug WebSocket<br/>Socket.IO 4.8.1]
    end

    subgraph "🚪 Couche Middleware & Sécurité"
        direction LR
        MW1[fa:fa-shield-alt Auth Middleware<br/>JWT]
        MW2[fa:fa-building Tenant Middleware<br/>Multi-tenant]
        MW3[fa:fa-lock Permission Middleware<br/>RBAC]
        MW4[fa:fa-check-circle Validation<br/>VineJS]
    end

    subgraph "🏗️ Couche Application - AdonisJS 6.14.1"
        direction TB
        
        subgraph "Controllers"
            C1[fa:fa-user User Controller]
            C2[fa:fa-shopping-cart Order Controller] 
            C3[fa:fa-box Product Controller]
            C4[fa:fa-building Tenant Controller]
        end
        
        subgraph "Services Métier"
            S1[fa:fa-cogs Order Service]
            S2[fa:fa-warehouse Inventory Service]
            S3[fa:fa-credit-card Payment Service]
            S4[fa:fa-bell Notification Service]
            S5[fa:fa-truck Delivery Service]
        end
        
        subgraph "Modules Domaine"
            M1[fa:fa-users Auth Module]
            M2[fa:fa-store Marketplace Module]
            M3[fa:fa-shopping-bag E-commerce Module]
            M4[fa:fa-shield-alt RBAC Module]
        end
    end

    subgraph "💾 Couche Persistance"
        direction LR
        
        subgraph "Base de Données"
            DB[(fa:fa-database PostgreSQL<br/>Lucid ORM 21.3.0)]
        end
        
        subgraph "Services Externes"
            CLOUD[fa:fa-cloud Cloudinary<br/>Stockage Images]
            MAIL[fa:fa-envelope SMTP<br/>Email Service]
        end
    end

    subgraph "🔧 Technologies Transversales"
        direction LR
        T1[fa:fa-code TypeScript 5.6]
        T2[fa:fa-key JWT Auth]
        T3[fa:fa-sync-alt Real-time Socket.IO]
        T4[fa:fa-server Node.js Runtime]
    end

    %% Connexions principales
    A1 & A2 & A3 --> HTTP
    A1 & A2 & A3 -.-> WS
    
    HTTP --> MW1
    WS --> MW1
    MW1 --> MW2
    MW2 --> MW3
    MW3 --> MW4
    MW4 --> C1 & C2 & C3 & C4
    
    C1 & C2 & C3 & C4 --> S1 & S2 & S3 & S4 & S5
    S1 & S2 & S3 & S4 & S5 --> M1 & M2 & M3 & M4
    
    M1 & M2 & M3 & M4 --> DB
    S3 --> CLOUD
    S4 --> MAIL

    %% Styles
    classDef frontend fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef backend fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef database fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px
    classDef middleware fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef external fill:#fce4ec,stroke:#880e4f,stroke-width:2px

    class A1,A2,A3,F1,F2,F3,F4,F5 frontend
    class C1,C2,C3,C4,S1,S2,S3,S4,S5,M1,M2,M3,M4 backend
    class DB database
    class MW1,MW2,MW3,MW4 middleware
    class CLOUD,MAIL external
```

## Architecture Multi-tenant

### **Isolation des Données**
- **Tenant Resolution**: Header `X-Tenant-Slug` pour identification
- **Database Isolation**: Clé `tenant_id` sur toutes les entités
- **Context Injection**: Middleware enrichit le contexte avec tenant

### **Sécurité Multicouche**
- **Authentication**: JWT avec expiration 10h
- **Authorization**: RBAC avec permissions granulaires
- **Tenant Validation**: Vérification appartenance utilisateur-tenant
- **Input Validation**: VineJS pour validation des données

## Stack Technologique Principal

### **Frontend (Angular 19)**
- **Framework**: Angular 19.0.0 avec TypeScript
- **UI/UX**: Angular Material + Tailwind CSS
- **State**: RxJS pour programmation réactive
- **Real-time**: Socket.IO client pour notifications live

### **Backend (AdonisJS 6)**
- **Framework**: AdonisJS 6.14.1 sur Node.js
- **ORM**: Lucid ORM avec migrations
- **Authentication**: JWT + RBAC custom
- **Real-time**: Socket.IO serveur intégré

### **Base de Données**
- **SGBD**: PostgreSQL avec driver pg
- **Schema**: Multi-tenant avec isolation par tenant_id
- **Migrations**: Versioning schema automatisé

### **Services Externes**
- **Stockage**: Cloudinary pour images/fichiers
- **Email**: SMTP pour notifications
- **Real-time**: WebSocket pour mises à jour live

## Avantages Architecturaux

- **Scalabilité**: Architecture modulaire et multi-tenant
- **Maintenabilité**: Séparation claire des responsabilités
- **Sécurité**: Validation multicouche et isolation tenant
- **Performance**: Real-time avec Socket.IO, ORM optimisé
- **Flexibilité**: Stack moderne avec TypeScript end-to-end