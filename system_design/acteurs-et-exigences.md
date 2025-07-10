# Acteurs et Exigences du Système E-commerce Multi-tenant

## 🎭 Acteurs du Système

### **Acteurs Principaux**

#### 🛒 **Client**

- **Description** : Utilisateur final qui achète des produits
- **Responsabilités** :
  - Parcourir le catalogue de produits
  - Gérer son panier d'achat
  - Passer des commandes
  - Effectuer des paiements
  - Suivre ses livraisons
  - Gérer ses adresses de livraison

#### 🏪 **Marchand (Tenant)**

- **Description** : Propriétaire d'une boutique en ligne sur la plateforme
- **Responsabilités** :
  - Gérer son catalogue de produits
  - Organiser les catégories
  - Définir les zones de livraison et tarifs
  - Traiter les commandes
  - Gérer les stocks
  - Configurer les méthodes de paiement

#### 👨‍💼 **Gestionnaire de Boutique**

- **Description** : Employé du marchand avec droits de gestion
- **Responsabilités** :
  - Ajouter/modifier des produits
  - Gérer les commandes en cours
  - Suivre les stocks
  - Générer des rapports de ventes

#### 🚚 **Livreur**

- **Description** : Personne chargée de la livraison des commandes
- **Responsabilités** :
  - Accepter les livraisons assignées
  - Mettre à jour le statut des livraisons
  - Confirmer la livraison
  - Signaler les problèmes de livraison

### **Acteurs Secondaires**

#### 🔧 **Administrateur Système**

- **Description** : Responsable technique de la plateforme
- **Responsabilités** :
  - Gérer les tenants (activation/suspension)
  - Configurer les rôles et permissions
  - Superviser la performance du système
  - Gérer les utilisateurs globaux

#### 💳 **Passerelle de Paiement**

- **Description** : Système externe de traitement des paiements
- **Responsabilités** :
  - Traiter les transactions
  - Confirmer ou rejeter les paiements
  - Gérer les remboursements

#### 📧 **Système de Notification**

- **Description** : Service externe d'envoi de notifications
- **Responsabilités** :
  - Envoyer des emails de confirmation
  - Envoyer des SMS de suivi
  - Gérer les notifications push

---

## ⚙️ Exigences Fonctionnelles

### **RF-01 : Gestion Multi-tenant**

- **RF-01.1** : Le système doit permettre l'isolation complète des données entre les tenants
- **RF-01.2** : Chaque tenant doit avoir son propre domaine ou sous-domaine
- **RF-01.3** : Le système doit résoudre automatiquement le tenant à partir de l'URL/header
- **RF-01.4** : Les administrateurs doivent pouvoir créer, activer et suspendre des tenants

### **RF-02 : Gestion des Utilisateurs et Authentification**

- **RF-02.1** : Les utilisateurs doivent pouvoir s'inscrire avec email et mot de passe
- **RF-02.2** : Le système doit supporter l'authentification multi-tenant
- **RF-02.3** : Un utilisateur peut appartenir à plusieurs tenants
- **RF-02.4** : Le système doit gérer les rôles et permissions par tenant
- **RF-02.5** : Les utilisateurs doivent pouvoir réinitialiser leur mot de passe

### **RF-03 : Catalogue de Produits**

- **RF-03.1** : Les marchands doivent pouvoir ajouter, modifier et supprimer des produits
- **RF-03.2** : Chaque produit doit avoir un nom, description, prix, SKU et statut
- **RF-03.3** : Les produits doivent être organisés en catégories hiérarchiques
- **RF-03.4** : Le système doit gérer les images de produits
- **RF-03.5** : Les clients doivent pouvoir rechercher et filtrer les produits
- **RF-03.6** : Les produits peuvent être visibles sur la marketplace inter-tenant

### **RF-04 : Gestion des Stocks**

- **RF-04.1** : Le système doit suivre les quantités disponibles pour chaque produit
- **RF-04.2** : Le stock doit être réservé lors de l'ajout au panier
- **RF-04.3** : Le système doit alerter quand le stock atteint le seuil minimum
- **RF-04.4** : Les marchands doivent pouvoir réapprovisionner les stocks

### **RF-05 : Panier d'Achat**

- **RF-05.1** : Les clients doivent pouvoir ajouter des produits au panier
- **RF-05.2** : Le panier doit persister entre les sessions
- **RF-05.3** : Les clients doivent pouvoir modifier les quantités ou supprimer des articles
- **RF-05.4** : Le système doit calculer automatiquement le total du panier
- **RF-05.5** : Le panier doit vérifier la disponibilité des produits avant la commande

### **RF-06 : Processus de Commande**

- **RF-06.1** : Les clients doivent pouvoir convertir leur panier en commande
- **RF-06.2** : Le système doit générer un numéro de commande unique
- **RF-06.3** : Les commandes doivent inclure les détails de livraison et facturation
- **RF-06.4** : Le système doit calculer les frais de livraison selon la zone
- **RF-06.5** : Les clients doivent pouvoir annuler une commande avant expédition

### **RF-07 : Gestion des Paiements**

- **RF-07.1** : Le système doit supporter multiple méthodes de paiement
- **RF-07.2** : Les paiements doivent être traités via des passerelles sécurisées
- **RF-07.3** : Le système doit gérer les remboursements partiels et complets
- **RF-07.4** : Toutes les transactions doivent être enregistrées et traçables

### **RF-08 : Livraison**

- **RF-08.1** : Les marchands doivent définir des zones de livraison avec tarifs
- **RF-08.2** : Le système doit assigner les livraisons aux livreurs disponibles
- **RF-08.3** : Les clients doivent pouvoir suivre l'état de leur livraison
- **RF-08.4** : Le système doit notifier les changements de statut de livraison

### **RF-09 : Gestion des Adresses**

- **RF-09.1** : Les clients doivent pouvoir gérer plusieurs adresses
- **RF-09.2** : Les adresses doivent être validées et géolocalisées
- **RF-09.3** : Le système doit supporter les adresses de livraison et facturation
- **RF-09.4** : Les clients doivent pouvoir définir une adresse par défaut

### **RF-10 : Notifications**

- **RF-10.1** : Le système doit envoyer des confirmations de commande
- **RF-10.2** : Les clients doivent recevoir des mises à jour de livraison
- **RF-10.3** : Les marchands doivent être alertés des nouvelles commandes
- **RF-10.4** : Le système doit supporter email, SMS et notifications push

---

## 🚀 Exigences Non Fonctionnelles

### **RNF-01 : Performance**

- **RNF-01.1** : Le temps de réponse des pages ne doit pas dépasser 2 secondes
- **RNF-01.2** : Le système doit supporter 1000 utilisateurs concurrent par tenant
- **RNF-01.3** : Les requêtes de recherche doivent retourner en moins de 500ms
- **RNF-01.4** : Le système doit pouvoir gérer 10 000 commandes simultanées

### **RNF-02 : Scalabilité**

- **RNF-02.1** : Le système doit supporter jusqu'à 1000 tenants actifs
- **RNF-02.2** : Chaque tenant doit pouvoir avoir jusqu'à 100 000 produits
- **RNF-02.3** : L'architecture doit permettre la montée en charge horizontale
- **RNF-02.4** : Les bases de données doivent supporter le partitioning

### **RNF-03 : Disponibilité**

- **RNF-03.1** : Le système doit avoir une disponibilité de 99.9%
- **RNF-03.2** : Les temps d'arrêt planifiés ne doivent pas dépasser 4h/mois
- **RNF-03.3** : Le système doit avoir des mécanismes de récupération automatique
- **RNF-03.4** : Les sauvegardes doivent être effectuées quotidiennement

### **RNF-04 : Sécurité**

- **RNF-04.1** : Toutes les communications doivent être chiffrées (HTTPS/TLS)
- **RNF-04.2** : Les mots de passe doivent être hachés avec un algorithme sécurisé
- **RNF-04.3** : Le système doit protéger contre les attaques OWASP Top 10
- **RNF-04.4** : L'isolation des données entre tenants doit être absolue
- **RNF-04.5** : Les paiements doivent être conformes PCI DSS

### **RNF-05 : Fiabilité**

- **RNF-05.1** : Les transactions de paiement doivent être ACID
- **RNF-05.2** : Le système doit gérer les pannes gracieusement
- **RNF-05.3** : Les données critiques doivent être répliquées
- **RNF-05.4** : Le système doit avoir des logs d'audit complets

### **RNF-06 : Utilisabilité**

- **RNF-06.1** : L'interface doit être responsive (mobile, tablette, desktop)
- **RNF-06.2** : Le système doit supporter l'internationalisation (i18n)
- **RNF-06.3** : Les parcours d'achat doivent être intuitifs
- **RNF-06.4** : Le système doit être accessible (WCAG 2.1 AA)

### **RNF-07 : Maintenabilité**

- **RNF-07.1** : Le code doit avoir une couverture de tests > 80%
- **RNF-07.2** : L'architecture doit être modulaire et découplée
- **RNF-07.3** : Le système doit avoir une documentation technique complète
- **RNF-07.4** : Les APIs doivent être versionnées et documentées

### **RNF-08 : Interopérabilité**

- **RNF-08.1** : Le système doit exposer des APIs REST standardisées
- **RNF-08.2** : Les intégrations tierces doivent utiliser des webhooks
- **RNF-08.3** : Le système doit supporter l'import/export de données
- **RNF-08.4** : Les formats d'échange doivent être standards (JSON, XML)

### **RNF-09 : Conformité**

- **RNF-09.1** : Le système doit être conforme au RGPD/GDPR
- **RNF-09.2** : Les données personnelles doivent être anonymisables
- **RNF-09.3** : Le système doit permettre le droit à l'oubli
- **RNF-09.4** : Les logs doivent respecter les réglementations locales

### **RNF-10 : Surveillance**

- **RNF-10.1** : Le système doit avoir des métriques de performance en temps réel
- **RNF-10.2** : Les erreurs doivent être trackées et alertées
- **RNF-10.3** : Le système doit avoir des dashboards de monitoring
- **RNF-10.4** : Les logs doivent être centralisés et searchables

---

## 📊 Matrice de Traçabilité

| Acteur | Exigences Fonctionnelles Principales |
|--------|--------------------------------------|
| **Client** | RF-03, RF-05, RF-06, RF-07, RF-08, RF-09 |
| **Marchand** | RF-01, RF-03, RF-04, RF-06, RF-08 |
| **Gestionnaire** | RF-03, RF-04, RF-06 |
| **Livreur** | RF-08 |
| **Admin Système** | RF-01, RF-02 |
| **Passerelle Paiement** | RF-07 |
| **Système Notification** | RF-10 |

## 🎯 Priorités des Exigences

### **Priorité Critique (Must Have)**

- RF-01 (Multi-tenant), RF-02 (Authentification), RF-03 (Catalogue)
- RF-05 (Panier), RF-06 (Commande), RF-07 (Paiement)
- RNF-04 (Sécurité), RNF-05 (Fiabilité)

### **Priorité Haute (Should Have)**

- RF-04 (Stock), RF-08 (Livraison), RF-09 (Adresses)
- RNF-01 (Performance), RNF-02 (Scalabilité), RNF-03 (Disponibilité)

### **Priorité Moyenne (Could Have)**

- RF-10 (Notifications)
- RNF-06 (Utilisabilité), RNF-07 (Maintenabilité)

### **Priorité Faible (Won't Have This Time)**

- RNF-08 (Interopérabilité avancée), RNF-09 (Conformité étendue)
