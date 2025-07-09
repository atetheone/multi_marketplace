# CHAPITRE 4 : RÉSULTATS OBTENUS

## Introduction

Ce chapitre présente les réalisations concrètes issues de l'implémentation de l'architecture définie au chapitre précédent. L'exposition des résultats couvre successivement les modules fonctionnels développés, les interfaces utilisateur implémentées et la validation technique effectuée.

## 4.1 Modules fonctionnels implémentés

Le cœur métier de la plateforme repose sur trois modules essentiels qui gèrent l'ensemble du cycle commercial : la gestion des produits avec inventaire, le processus de commande multi-tenant et le système de notifications temps réel. Ces modules interagissent pour former un écosystème e-commerce complet.

### 4.1.1 Gestion des produits

Le module permet la création, modification et suppression de produits avec upload multiple d'images via Cloudinary. Le système de catégorisation organise les catalogues et la gestion d'inventaire avec quantités disponibles, réservées et points de réapprovisionnement. L'API CRUD complète permet la gestion des images avec endpoints de suppression.

### 4.1.2 Processus de commande

Le workflow de commande gère les états avec modèles Order et OrderItems. Le panier multi-tenants traite les achats croisés avec persistance pour utilisateurs authentifiés et localStorage pour invités. L'historique complet des transactions assure la traçabilité via audit trail.

*[Figure 4.1 : Interface de gestion des commandes]*

### 4.1.3 Système de notifications

L'implémentation WebSocket via Socket.IO délivre les notifications temps réel aux utilisateurs connectés avec authentification JWT. Le service de notifications backend gère les templates et l'envoi selon les rôles utilisateur. Les notifications couvrent les nouvelles commandes, changements de statut et alertes système.

## 4.2 Interfaces utilisateur développées

Les interfaces développées se structurent en deux catégories distinctes selon les profils utilisateur : les interfaces client pour la marketplace publique et les interfaces d'administration différenciées par rôle. Chaque interface est optimisée pour son usage spécifique.

### 4.2.1 Interfaces client (marketplace publique)

L'interface client couvre l'ensemble du parcours d'achat depuis la découverte des tenants jusqu'au suivi des commandes. Cette section présente les cinq pages principales développées pour l'expérience client sur la marketplace.

**Page d'accueil marketplace** : L'interface publique Angular présente les tenants avec système de recherche global et filtrage par catégories/prix. Les cards de tenants affichent informations commerciales et produits phares.

**Pages produits** : L'affichage détaillé intègre visuels Cloudinary optimisés, descriptions complète, informations tenant et bouton d'ajout au panier. La navigation entre produits facilite la découverte.

**Panier multi-tenant** : L'interface de panier regroupe les articles par tenant avec calcul séparé des frais. La synchronisation guest/auth permet la persistance des sélections lors de la connexion.

**Page de commande** : Le processus de checkout guide l'utilisateur avec sélection d'adresse de livraison, choix du mode de paiement (cash/mobile money) et récapitulatif détaillé par tenant. La validation finale génère la commande avec notifications automatiques.

**Suivi des commandes** : L'interface client permet le suivi des commandes avec historique complet, statuts en temps réel et détails de livraison.

*[Figure 4.2 : Page d'accueil marketplace]*

### 4.2.2 Interfaces d'administration (accès rôle-spécifique)

Les interfaces d'administration se composent de plusieurs pages spécialisées protégées par un système RBAC qui filtre les accès et les actions disponibles selon les permissions resource:action assignées. Cette section détaille les différentes interfaces développées pour chaque profil administratif.

**Gestion de produits** : Interface de gestion des produits avec fonctionnalités CRUD, upload d'images, catégorisation et gestion d'inventaire.

**Gestion de tenants** : Interface accessible aux super-admin pour la supervision globale, création et configuration des tenants, gestion des utilisateurs et permissions.

**Interface Livreur** : Dashboard dédié avec liste des livraisons assignées, mise à jour des statuts de livraison et gestion des zones d'intervention. Interface mobile-first pour usage terrain.

**Interface Gestionnaire Zones** : Outils de configuration des zones de livraison, assignment des livreurs, tarification dynamique et analyse des performances logistiques.

**Gestion RBAC** : Interface de configuration des rôles et permissions avec format resource:action, assignment des utilisateurs aux rôles et permissions, audit des accès.

## 4.3 Tests et validation effectués

La validation du système s'appuie sur une stratégie de tests multi-niveaux couvrant l'isolation multi-tenant, les performances techniques et les workflows fonctionnels. Cette approche garantit la fiabilité et la sécurité de la plateforme développée.

### 4.3.1 Tests d'isolation

La validation multi-tenant s'est effectuée avec trois environnements simulés via tests fonctionnels AdonisJS, confirmant l'étanchéité des données entre espaces tenant. Les middleware CheckTenant et contrôles automatiques empêchent les accès cross-tenant.

### 4.3.2 Tests de performance

Les mesures indiquent des temps de réponse PostgreSQL inférieurs à 200ms pour requêtes simples et 500ms pour recherches complexes. Les tests de charge avec 10 utilisateurs simultanés maintiennent la stabilité système avec index multi-tenant optimisés.

### 4.3.3 Tests fonctionnels

L'ensemble des workflows a été testé via suite de tests automatisés : inscription tenants, ajout produits, processus d'achat, gestion des commandes et notifications Socket.IO. Les intégrations Cloudinary et authentification JWT fonctionnent selon les spécifications.

## Conclusion

Les réalisations présentées concrétisent l'implémentation de l'architecture définie. Le prototype fonctionnel valide la faisabilité technique des objectifs avec modules opérationnels backend/frontend, interfaces utilisateur Angular Material complètes et adaptations locales intégrées. Cette base solide constitue un fondement pour les phases de finalisation et de déploiement.
