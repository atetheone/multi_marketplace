# CHAPITRE 4 : RÉSULTATS OBTENUS

## Introduction

Ce chapitre présente les réalisations concrètes du stage de fin d'études effectué chez Insoft SAS. L'objectif était de développer un prototype de plateforme e-commerce multi-tenant pour expérimenter avec les défis techniques de ce type d'architecture et acquérir une expérience pratique des technologies web modernes.

Le projet visait à reproduire les fonctionnalités essentielles d'une marketplace existante en version multi-tenant, permettant d'explorer trois axes d'apprentissage : la réduction des coûts par mutualisation, la création d'un environnement commercial unifié, et l'implémentation de mécanismes de sécurité. Cette évaluation examine ce qui a été effectivement développé, testé et appris durant ces quatre mois.

## 4.1 Apprentissage de la réduction des coûts par mutualisation

Le premier objectif d'apprentissage portait sur la compréhension pratique des mécanismes de mutualisation dans une architecture multi-tenant.

### 4.1.1 Expérimentation avec l'architecture partagée

Le développement a permis d'expérimenter concrètement avec une architecture où plusieurs "commerçants virtuels" partagent la même infrastructure. L'approche choisie mutualise la base PostgreSQL, le serveur AdonisJS, le stockage Cloudinary et les ressources de calcul.

**Réalisations concrètes :**
- Configuration d'une base de données unique avec 15 tables interconnectées
- Mise en place d'un système de tenants avec isolation par clé étrangère
- Création de 3-4 espaces commerçants de test pour valider la séparation
- Développement d'un processus d'onboarding automatisé en 3 étapes

L'expérience montre qu'une fois l'architecture configurée, l'ajout d'un nouveau tenant de test ne nécessite que quelques minutes de configuration, validant théoriquement l'économie d'échelle.

### 4.1.2 Développement d'une interface de gestion unifiée

Un dashboard a été développé pour centraliser la gestion des fonctions essentielles. L'interface comprend 6 écrans principaux : tableau de bord avec métriques, gestion du catalogue produits, suivi des commandes, gestion clients, configuration des zones de livraison, et paramètres du compte.

**Caractéristiques de l'interface développée :**
- Design responsive adapté aux écrans mobiles et desktop
- Navigation entre les écrans testée en environnement de développement
- Formulaires en français avec validation côté client et serveur
- Système de drag-and-drop pour l'ajout d'images produits

Les tests internes montrent que l'interface reste cohérente même avec plusieurs tenants, chaque espace étant complètement isolé des autres.

### 4.1.3 Adaptation aux contraintes techniques locales

Le développement a intégré plusieurs adaptations pour simuler les contraintes du contexte sénégalais, bien que ces optimisations n'aient pas pu être testées en conditions réelles.

**Optimisations implémentées :**
- Compression automatique des images via l'API Cloudinary
- Interface allégée privilégiant la fonctionnalité sur les effets visuels
- Chargement progressif des listes de produits
- Support des formats locaux (FCFA, adresses en français)

## 4.2 Expérimentation avec un écosystème unifié

Le second axe d'apprentissage concernait les défis techniques de l'unification tout en préservant l'identité de chaque tenant.

### 4.2.1 Développement d'un catalogue global sécurisé

L'une des fonctionnalités les plus complexes à implémenter a été la recherche cross-tenant qui permet de découvrir tous les produits tout en maintenant l'isolation sécuritaire. Cette fonctionnalité reproduit le mécanisme des grandes marketplaces.

**Mécanismes techniques développés :**
- Système de recherche global avec filtrage par catégories et prix
- Génération automatique d'URLs pour chaque produit avec slug tenant
- Interface publique centralisée testée avec 50+ produits de démonstration
- Optimisation des requêtes avec index composites pour améliorer les performances

Les tests en local montrent que la navigation entre les espaces marchands fonctionne sans compromettre l'isolation des données.

### 4.2.2 Implémentation du panier multi-tenant

Le développement du panier multi-commerçants s'est révélé techniquement enrichissant. Cette fonctionnalité permet d'ajouter des produits de différents tenants dans un même panier, puis sépare automatiquement les commandes lors du checkout.

**Défis techniques rencontrés et résolus :**
- Synchronisation des données entre utilisateurs connectés et anonymes
- Gestion des cas d'erreur lors de la séparation des commandes
- Calcul séparé des frais de livraison par tenant
- Processus de checkout unifié avec redirection vers les bonnes commandes

Cette implémentation a nécessité l'apprentissage approfondi de la gestion d'état côté client et des transactions complexes côté serveur.

### 4.2.3 Système de sous-domaines et identité marchande

Pour préserver l'identité de chaque tenant, un système de sous-domaines personnalisés a été configuré. Bien que testé uniquement en local, ce mécanisme permet théoriquement à chaque commerçant de disposer de son propre espace (ex: tenant1.localhost:3000).

Le cycle de commande unifié développé comprend 5 états : En attente, Confirmée, Préparée, Expédiée, Livrée, avec possibilité d'annulation. Ce workflow standardisé facilite la gestion pour les commerçants tout en créant une expérience cohérente.

## 4.3 Apprentissage des mécanismes de sécurité et confiance

Le troisième objectif portait sur l'implémentation pratique de la sécurité dans un contexte multi-tenant.

### 4.3.1 Implémentation de l'authentification et des autorisations

Le développement d'un système d'authentification JWT avec contrôle d'accès basé sur les rôles a constitué un apprentissage technique majeur. Le système comprend 4 rôles de base : Super Admin, Admin Tenant, Gestionnaire, et Utilisateur.

**Mécanismes de sécurité implémentés :**
- Génération et validation de tokens JWT avec expiration
- Middleware de résolution automatique du contexte tenant
- Système de permissions granulaires avec vérification à chaque requête
- Validation des entrées utilisateur via VineJS côté serveur

Les tests d'isolation ont été effectués en créant plusieurs tenants de test et en vérifiant qu'aucun accès cross-tenant n'était possible. Sur l'ensemble des tests manuels effectués, aucune fuite de données n'a été détectée.

### 4.3.2 Simulation des spécificités de paiement locales

Le système intègre le paiement à la livraison avec un workflow complet, fonctionnalité essentielle pour le contexte sénégalais. L'architecture prépare également l'intégration future des services de paiement mobile comme Orange Money et Wave.

**Adaptations locales développées :**
- Gestion des zones de livraison configurables (14 quartiers de Dakar simulés)
- Interface entièrement en français avec terminologie adaptée
- Support des adresses informelles dans les formulaires
- Calcul automatique des frais de livraison par zone géographique

Ces fonctionnalités n'ont été testées qu'en environnement de développement avec des données fictives.

### 4.3.3 Système de traçabilité et notifications

Un système de traçabilité complète a été développé avec enregistrement horodaté de toutes les actions. Les notifications temps réel utilisent Socket.IO pour informer instantanément les parties concernées.

**Fonctionnalités de transparence développées :**
- Historique complet des modifications avec identification de l'auteur
- Notifications push automatiques pour les changements d'état des commandes
- Dashboard avec métriques temps réel (nombre de produits, commandes, revenus)
- Logs d'audit pour tracer les accès et modifications sensibles

## 4.4 Défis techniques rencontrés et apprentissages

Le développement a révélé plusieurs défis techniques qui ont enrichi l'apprentissage au-delà des objectifs initiaux.

### 4.4.1 Complexités de l'architecture multi-tenant

**Isolation des données plus complexe que prévu**
L'implémentation de l'isolation hermétique s'est révélée techniquement exigeante. Il a fallu maîtriser les middlewares AdonisJS, les Global Scopes de Lucid ORM, et développer une logique robuste de résolution du contexte tenant. Cette expérience a permis de comprendre concrètement pourquoi de nombreuses entreprises évitent le multi-tenant.

**Optimisation des performances cross-tenant**
Les requêtes de recherche globale qui préservent l'isolation ont nécessité l'apprentissage de l'optimisation de base de données. L'équilibrage entre performance et sécurité a demandé plusieurs iterations et l'étude approfondie des index composites PostgreSQL.

### 4.4.2 Limites du contexte de développement

**Tests de performance limités**
Les tests sont restés confinés à l'environnement local avec des données fictives. La scalabilité réelle avec de nombreux commerçants simultanés n'a pas pu être validée, limitant la portée des conclusions sur les performances.

**Intégrations externes non finalisées**
L'accès aux environnements de test d'Orange Money et Wave n'a pas été obtenu. L'architecture de paiement mobile reste donc préparatoire. De même, les optimisations pour connexions 3G n'ont pas pu être testées sans déploiement réel.

**Fonctionnalités non développées par manque de temps**
Plusieurs fonctionnalités prévues n'ont pas pu être implémentées :
- Outils d'analyse avancés pour les commerçants
- Système complet de gestion des retours
- Mécanismes de recommandation produits
- Interface d'administration avancée pour la gestion multi-tenant

## 4.5 Évaluation de l'architecture développée

### 4.5.1 Points forts de l'approche choisie

**Architecture modulaire facilitant l'apprentissage**
La séparation en modules distincts (auth, tenant, product, order, notification) a facilité la compréhension et le développement. Cette organisation reflète les bonnes pratiques de l'industrie et permet d'ajouter de nouvelles fonctionnalités sans impact sur l'existant.

**Sécurité by design**
L'isolation multi-tenant native et le système RBAC granulaire reproduisent les standards de sécurité des applications professionnelles. Cette approche a permis d'acquérir une expérience concrète des enjeux de sécurité dans le développement web.

**Préparation à la scalabilité**
L'architecture stateless et l'utilisation de CDN préparent théoriquement une montée en charge future. Ces choix techniques correspondent aux patterns modernes de développement web scalable.

### 4.5.2 Limites identifiées de l'approche

**Contraintes de l'architecture monolithique**
Malgré la modularité, l'architecture reste monolithique, limitant la scalabilité indépendante des composants. Cette limitation est acceptable pour un projet d'apprentissage mais poserait des défis en production.

**Complexité ajoutée par le multi-tenant**
L'isolation par tenant_id ajoute une complexité à chaque requête. Les index composites consomment plus d'espace disque. Cette expérience illustre concrètement pourquoi le multi-tenant nécessite une expertise technique approfondie.

**Dépendances entre tenants**
La base PostgreSQL partagée crée des interdépendances pour les opérations de maintenance. Cette architecture pose des risques opérationnels qui deviendraient critiques à grande échelle.

### 4.5.3 Enseignements pour une évolution future

L'expérience acquise suggère plusieurs évolutions nécessaires pour un déploiement professionnel :
- Migration vers des microservices pour une scalabilité granulaire
- Séparation des bases de données par domaine métier
- Implémentation de cache distribué pour les performances
- Containerisation avec Docker pour faciliter le déploiement

## Conclusion

Ce stage a permis de développer un prototype fonctionnel qui reproduit les mécanismes essentiels d'une marketplace multi-tenant. L'objectif d'apprentissage est atteint : comprendre concrètement les défis de la mutualisation, de l'unification et de la sécurisation dans ce type d'architecture.

Les réalisations concrètes incluent un système complet avec 15 migrations de base de données, 8 contrôleurs principaux, 12 composants Angular, et 45 routes API. Le prototype simule efficacement une marketplace avec gestion des tenants, catalogue unifié, panier multi-commerçants, et système de permissions granulaires.

Cependant, les limites du contexte académique sont importantes. L'absence de déploiement réel, de tests utilisateurs avec de vrais commerçants, et de validation de charge limite la portée des conclusions. Le projet reste un exercice d'apprentissage technique, sans prétention d'impact business réel.

L'expérience la plus enrichissante réside dans la compréhension pratique des défis du multi-tenant : complexité de l'isolation, optimisation des performances cross-tenant, et équilibrage entre sécurité et fonctionnalité. Ces apprentissages constituent une base solide pour aborder des projets professionnels similaires.

## CONCLUSION GÉNÉRALE

Ce stage de fin d'études chez Insoft SAS a constitué une expérience d'apprentissage technique intensive. L'objectif était de reproduire les mécanismes d'une marketplace existante en version multi-tenant pour acquérir une compréhension pratique de ce type d'architecture.

Le prototype développé valide les apprentissages visés. La mutualisation des ressources fonctionne techniquement, l'écosystème unifié preserve l'isolation sécuritaire, et les mécanismes de confiance reproduisent les standards professionnels. L'architecture multi-tenant, bien que complexe, s'est révélée techniquement réalisable avec les outils modernes.

Les principales difficultés rencontrées concernent la complexité de l'isolation des données, l'optimisation des performances cross-tenant, et la gestion des cas d'erreur dans un environnement partagé. Ces défis techniques illustrent concrètement pourquoi le multi-tenant reste un domaine d'expertise spécialisé.

Les limites du projet sont assumées : absence de déploiement réel, tests limités à l'environnement local, et validation avec des données fictives uniquement. Le contexte académique ne permettait pas d'évaluer l'impact business réel ni la réaction des utilisateurs finaux.

L'apprentissage le plus significatif porte sur l'importance de l'équilibre entre ambition technique et contraintes pratiques. Le développement logiciel, même dans un cadre d'apprentissage, nécessite des compromis constants entre fonctionnalités, performance, sécurité et maintenabilité.

Cette expérience chez Insoft SAS illustre l'intérêt pédagogique des projets techniques ambitieux : ils permettent d'acquérir une compréhension profonde des défis réels du développement web moderne, préparant efficacement à l'exercice professionnel de l'ingénierie logicielle.