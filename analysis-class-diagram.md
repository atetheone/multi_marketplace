# Diagramme de Classes d'Analyse - Système E-commerce Multi-tenant

```mermaid
classDiagram
    %% ===================================
    %% ENTITÉS MÉTIER ESSENTIELLES
    %% ===================================
    
    class Tenant {
        +nom
        +statut: TenantStatus
    }

    class Utilisateur {
        +nom
        +email
        +statut: UtilisateurStatus
    }

    class Produit {
        +nom
        +prix
        +statut: ProduitStatus
    }

    class Commande {
        +numero
        +statut: CommandeStatus
        +total
    }

    class ArticleCommande {
        +quantite
        +prixUnitaire
    }

    class Panier {
        +statut: PanierStatus
    }

    class ArticlePanier {
        +quantite
    }

    class Adresse {
        +ville
        +codePostal
        +type: TypeAdresse
    }

    class Paiement {
        +montant
        +statut: StatutPaiement
    }

    class Livraison {
        +statut: StatutLivraison
        +dateEstimee
    }

    class Stock {
        +quantiteDisponible
        +quantiteReservee
    }

    %% ===================================
    %% ÉNUMÉRATIONS SIMPLIFIÉES
    %% ===================================

    class TenantStatus {
        <<enumeration>>
        ACTIF
        SUSPENDU
    }

    class UtilisateurStatus {
        <<enumeration>>
        ACTIF
        INACTIF
    }

    class ProduitStatus {
        <<enumeration>>
        DISPONIBLE
        INDISPONIBLE
    }

    class CommandeStatus {
        <<enumeration>>
        EN_ATTENTE
        CONFIRMEE
        EXPEDIEE
        LIVREE
        ANNULEE
    }

    class PanierStatus {
        <<enumeration>>
        ACTIF
        COMMANDE
    }

    class StatutPaiement {
        <<enumeration>>
        EN_ATTENTE
        PAYE
        ECHEC
    }

    class StatutLivraison {
        <<enumeration>>
        EN_PREPARATION
        EN_COURS
        LIVREE
    }

    class TypeAdresse {
        <<enumeration>>
        LIVRAISON
        FACTURATION
    }

    %% ===================================
    %% RELATIONS MÉTIER ESSENTIELLES
    %% ===================================

    %% Isolation multi-tenant
    Tenant "1" --> "*" Utilisateur : contient
    Tenant "1" --> "*" Produit : possède
    Tenant "1" --> "*" Commande : traite

    %% Cycle de commande principal
    Utilisateur "1" --> "*" Panier : possède
    Utilisateur "1" --> "*" Commande : passe
    Utilisateur "1" --> "*" Adresse : a

    %% Gestion des produits
    Produit "1" --> "1" Stock : a
    Produit "1" --> "*" ArticlePanier : ajouté à
    Produit "1" --> "*" ArticleCommande : commandé

    %% Composition des commandes
    Panier "1" --> "*" ArticlePanier : contient
    Commande "1" --> "*" ArticleCommande : contient
    Commande "1" --> "1" Paiement : payée par
    Commande "1" --> "0..1" Livraison : expédiée via
    Commande "*" --> "1" Adresse : livrée à

    %% Relations avec énumérations
    Tenant ..> TenantStatus
    Utilisateur ..> UtilisateurStatus
    Produit ..> ProduitStatus
    Commande ..> CommandeStatus
    Panier ..> PanierStatus
    Paiement ..> StatutPaiement
    Livraison ..> StatutLivraison
    Adresse ..> TypeAdresse
```

## Description Simplifiée

Ce diagramme d'analyse capture les **concepts métier essentiels** du système e-commerce multi-tenant :

### 🏢 **Isolation Multi-tenant**

- **Tenant** : Marchand isolé avec ses propres données
- Chaque entité appartient à un tenant spécifique

### 👤 **Acteurs Principaux**

- **Utilisateur** : Client qui passe des commandes
- **Produit** : Article vendable avec son stock

### 🛒 **Processus de Commande**

- **Panier** → **Commande** → **Paiement** → **Livraison**
- **ArticlePanier** / **ArticleCommande** : Détails des articles
- **Stock** : Gestion des quantités disponibles

### 📍 **Support**

- **Adresse** : Livraison et facturation
- **Statuts** : États des entités métier principales

Ce diagramme épuré se concentre sur l'essentiel métier sans détails techniques prématurés.
