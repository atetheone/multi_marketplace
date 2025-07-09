# CHAPITRE 4 : RÉSULTATS OBTENUS

## Introduction

Au terme du stage chez Insoft SAS, il est maintenant possible de dresser un bilan concret de ce qui a été développé et testé. Cette évaluation permet de mesurer l'écart entre les objectifs initiaux et les réalisations effectives, tout en identifiant les apprentissages tirés de cette expérience.

Le travail s'est concentré sur trois défis principaux : rendre le e-commerce accessible aux PME sénégalaises, créer un environnement commercial unifié, et mettre en place des mécanismes de confiance. Ce chapitre examine ce qui a été accompli dans chacun de ces domaines, ainsi que les difficultés rencontrées et les limites identifiées.

## 4.1 L'accès au e-commerce est démocratisé

Durant le développement, plusieurs hypothèses concernant l'accessibilité du e-commerce pour les PME locales ont pu être validées. L'approche multi-tenant choisie semble répondre aux contraintes financières et techniques identifiées.

### 4.1.1 Réduction des coûts par la mutualisation

L'architecture développée permet effectivement de répartir les coûts entre plusieurs commerçants. En mutualisant l'infrastructure AdonisJS/PostgreSQL, le stockage Cloudinary et la maintenance, la solution élimine la nécessité pour chaque commerçant d'investir dans une solution dédiée.

**Constatations durant le développement :**
- Une fois l'architecture de base en place, l'ajout d'un nouveau commerçant ne demande que quelques minutes de configuration
- Le processus d'onboarding créé automatise la création de l'espace tenant sans intervention technique
- Les ressources partagées (base de données, serveur, stockage) réduisent considérablement les coûts individuels

### 4.1.2 Simplification de l'interface de gestion

Un dashboard a été développé pour centraliser les fonctions essentielles : gestion du catalogue, suivi des commandes et consultation des statistiques. L'objectif était de créer une interface que les commerçants puissent maîtriser rapidement.

**Choix de conception effectués :**
- Interface responsive pensée d'abord pour les smartphones Android couramment utilisés au Sénégal
- Processus d'inscription en trois étapes guidées
- Gestion produits avec système de catégorisation assistée
- Utilisation du français avec une terminologie adaptée au contexte local

Les tests menés avec l'équipe Insoft montrent que l'interface reste intuitive même pour des utilisateurs peu familiers avec les outils numériques.

### 4.1.3 Optimisation pour les contraintes locales

Une attention particulière a été portée aux contraintes techniques du contexte sénégalais. L'application web fonctionne directement dans le navigateur sans installation préalable, avec une optimisation du chargement pour les connexions 3G instables.

**Adaptations techniques réalisées :**
- Compression des images via Cloudinary pour réduire la bande passante
- Chargement progressif des contenus
- Interface allégée privilégiant la fonctionnalité sur l'esthétique
- Guides contextuels intégrés pour réduire le besoin de formation

## 4.2 Un écosystème commercial unifié est créé

L'un des défis les plus complexes était de rassembler plusieurs commerçants dans un même environnement tout en préservant leur identité. Les expérimentations avec le système multi-tenant ont permis de tester différentes approches.

### 4.2.1 Amélioration de la découverte des produits

Un catalogue unifié a été développé qui indexe tous les produits de la plateforme tout en maintenant l'isolation de sécurité. Cette fonctionnalité permet aux clients de découvrir l'ensemble de l'offre disponible.

**Mécanismes techniques mis en place :**
- Recherche cross-tenant sécurisée via PostgreSQL avec des index composites optimisés
- Interface publique centralisée avec filtrage par catégories, prix et zones géographiques
- Génération automatique d'URLs SEO-friendly pour chaque produit

Les tests ont montré que cette approche facilite effectivement la navigation entre les différents espaces marchands sans compromettre la sécurité des données.

### 4.2.2 Gestion du panier multi-commerçants

Une des fonctionnalités qui a suscité le plus d'intérêt lors des démonstrations est le panier multi-tenant. Les clients peuvent commander chez plusieurs commerçants simultanément, et le système sépare automatiquement les commandes.

**Défis techniques surmontés :**
- Synchronisation du panier entre utilisateurs authentifiés et anonymes
- Gestion des cas d'erreur lors de la répartition des commandes
- Checkout unifié avec séparation automatique des paiements par commerçant

Cette fonctionnalité répond à un besoin réel : permettre aux clients de faire leurs courses en une seule fois tout en respectant l'indépendance des commerçants.

### 4.2.3 Préservation des identités marchandes

Un système de sous-domaines personnalisés a été mis en place qui permet à chaque commerçant de conserver son identité de marque. Cette approche concilie l'infrastructure partagée et la personnalisation individuelle.

Le cycle de commande unifié développé (En attente → Confirmée → Expédiée → Livrée → Annulée) crée une expérience cohérente pour les clients, quel que soit le commerçant choisi.

## 4.3 Un cadre de confiance commercial est instauré

La question de la confiance étant cruciale dans le contexte sénégalais, une attention particulière a été accordée aux mécanismes de sécurisation et de traçabilité.

### 4.3.1 Sécurisation des données et des accès

Un système d'authentification JWT avec un contrôle d'accès basé sur les rôles (RBAC) a été implémenté. L'isolation multi-tenant utilise des middlewares spécialisés qui empêchent tout accès cross-tenant.

**Mesures de sécurité mises en œuvre :**
- Résolution automatique du contexte tenant via l'en-tête X-Tenant-Slug
- Global scopes Lucid pour garantir l'isolation des données
- Validation VineJS côté serveur pour sécuriser toutes les entrées utilisateur

En collaboration avec l'équipe Insoft, l'étanchéité du système a été testée sans détecter de fuite de données lors des vérifications en environnement de développement.

### 4.3.2 Adaptation aux modes de paiement locaux

Le paiement à la livraison a été intégré avec un workflow complet de gestion des espèces, fonctionnalité essentielle dans le contexte sénégalais. L'architecture de paiement mobile est préparée pour l'intégration d'Orange Money et Wave, bien que l'accès aux environnements de test n'ait pas été obtenu durant le stage.

**Spécificités locales prises en compte :**
- Configuration des zones de livraison par quartiers dakarois
- Interface en français avec formats locaux (FCFA, adresses sénégalaises)
- Gestion des contraintes d'adressage informel

### 4.3.3 Traçabilité et transparence

Le système développé enregistre l'intégralité du cycle de commande avec horodatage précis. Les notifications instantanées via Socket.IO maintiennent l'information en temps réel, reproduisant la réactivité des échanges commerciaux traditionnels.

Le dashboard marchand fournit des métriques en temps réel qui permettent aux commerçants de suivre leur activité de manière transparente.

## 4.4 Difficultés rencontrées et limites identifiées

Le travail a révélé plusieurs défis techniques et contraintes qui n'avaient pas été anticipés initialement.

### 4.4.1 Complexités techniques maîtrisées

**Isolation multi-tenant complexe**
L'implémentation de l'isolation hermétique s'est révélée plus complexe que prévu. Il a fallu développer des middlewares spécialisés et des global scopes Lucid robustes. La gestion des cas d'erreur lors de la résolution du contexte tenant a nécessité plusieurs itérations avant d'atteindre un niveau de fiabilité satisfaisant.

**Optimisation des performances cross-tenant**
Les requêtes de recherche globale qui préservent l'isolation ont exigé l'optimisation d'index composites spécifiques. Il a fallu trouver un équilibre entre performance de recherche et sécurité d'isolation, ce qui a demandé plusieurs ajustements de l'architecture de base.

### 4.4.2 Limites dues au contexte de développement

**Contraintes d'environnement**
Les tests de performance sont restés limités à l'environnement de développement local. La scalabilité réelle avec de nombreux commerçants et utilisateurs simultanés n'a pas pu être validée. Cette limitation constitue un risque pour le déploiement en production.

**Intégrations manquantes**
L'accès aux environnements de sandbox d'Orange Money et Wave n'a pas été obtenu durant le stage. L'architecture de paiement mobile reste donc préparatoire. De même, les tests sur connexions 3G instables n'ont pas pu être exhaustifs sans déploiement réel.

**Fonctionnalités non développées**
Certaines fonctionnalités initialement prévues n'ont pas pu être implémentées :
- Outils analytiques avancés pour les commerçants (tendances, prévisions)
- Gestion complète des retours et du service après-vente
- Mécanismes de recommandation produits
- Audit de sécurité professionnel

## 4.5 Forces et faiblesses de l'architecture développée

Au terme de ce développement, il est possible d'identifier les points forts et les limites de l'approche technique choisie.

### 4.5.1 Points forts identifiés

**Modularité et maintenabilité**
L'architecture 3-tiers modulaire développée facilite effectivement la maintenance et l'évolution. La séparation claire des responsabilités permet d'ajouter de nouvelles fonctionnalités sans impact sur l'existant. Cette approche s'est révélée particulièrement utile lors des phases d'itération.

**Sécurité intégrée dès la conception**
L'isolation multi-tenant native empêche les fuites de données. Le système RBAC granulaire s'adapte à différents profils d'utilisation. Cette approche sécuritaire dès la conception renforce la confiance potentielle des utilisateurs.

**Préparation à la montée en charge**
L'architecture stateless choisie permet l'ajout de serveurs sans modification du code. L'utilisation de CDN Cloudinary décharge le traitement d'images. Cette préparation facilite une montée en charge future, même si elle n'a pas été testée en conditions réelles.

### 4.5.2 Limites architecturales constatées

**Contraintes de l'approche monolithique**
Bien que modulaire, l'architecture reste monolithique, ce qui limite la scalabilité indépendante des composants. La base de données unique représente un point de contention potentiel. Le déploiement nécessite l'arrêt complet pour les mises à jour majeures.

**Impact performance non validé**
L'isolation par tenant_id ajoute une complexité à chaque requête dont l'impact réel reste à valider en production. Les index composites consomment plus d'espace disque. La croissance du nombre de tenants peut impacter les performances globales, mais cette hypothèse n'est pas vérifiée en conditions réelles.

**Dépendances entre tenants**
La base PostgreSQL partagée crée des dépendances entre tenants pour les opérations de maintenance. Les requêtes complexes cross-tenant peuvent affecter les performances de tous les tenants. Cette interdépendance pose des risques opérationnels non négligeables.

### 4.5.3 Évolutions nécessaires pour la production

D'après l'expérience sur ce projet, plusieurs évolutions seront nécessaires pour un déploiement en production :
- Migration vers une architecture microservices pour une scalabilité plus fine
- Séparation des bases de données par domaine métier
- Implémentation de cache distribué (Redis) pour améliorer les temps de réponse
- Containerisation pour faciliter le déploiement et la scalabilité horizontale

## Conclusion

Ce stage a permis de valider plusieurs hypothèses techniques tout en révélant les limites de l'approche choisie. Un système fonctionnel a été développé qui répond aux objectifs de démocratisation de l'accès au e-commerce, de création d'un écosystème unifié et d'instauration d'un cadre de confiance.

Les résultats les plus concrets sont la réduction significative des coûts par mutualisation, la simplification de la gestion par l'interface unifiée, et la sécurisation des données par l'isolation multi-tenant. L'adaptation aux spécificités locales (paiement à la livraison, zones géographiques, interface française) montre que la solution tient compte du contexte sénégalais.

Cependant, l'absence de déploiement en production limite la portée de ces résultats. Les défis de performance, de scalabilité et d'intégration avec les services de paiement locaux restent à valider en conditions réelles. L'architecture monolithique modulaire constitue un compromis acceptable pour cette phase de développement, mais elle devra évoluer pour accompagner une croissance significative.

Cette expérience a démontré que l'adaptation technologique aux contextes locaux nécessite une compréhension fine des réalités terrain, au-delà des considérations purement techniques. Les échanges réguliers avec l'équipe Insoft ont mis en évidence l'importance de cette approche contextualisée pour le succès des projets numériques dans les économies émergentes.

## CONCLUSION GÉNÉRALE

Le stage chez Insoft SAS a représenté un défi stimulant : développer une solution e-commerce multi-tenant adaptée aux PME sénégalaises. Face aux barrières financières et techniques identifiées, l'approche multi-tenant s'est imposée comme une réponse pertinente pour mutualiser les coûts tout en préservant l'identité de chaque commerçant.

Le système développé valide plusieurs objectifs initiaux. La plateforme répond aux enjeux d'accessibilité en réduisant les coûts d'entrée et propose une gestion simplifiée grâce à une interface intuitive. Elle intègre plusieurs spécificités locales observées durant la mission, tant sur le plan fonctionnel que technique. L'architecture multi-tenant, enrichie de l'expérience acquise sur le projet CREDITEMOI, confirme sa capacité à surmonter les limites initialement identifiées.

Toutefois, plusieurs défis restent à relever. L'intégration complète des services de paiement mobile, notamment Orange Money et Wave, nécessite des développements complémentaires qui n'ont pas pu être finalisés faute d'accès aux environnements de test. Par ailleurs, les tests de performance sont restés limités à l'environnement de développement, et des problématiques logistiques demeurent, notamment concernant l'adressage informel caractéristique de certaines zones urbaines dakaroises.

Ce stage a également permis de mieux comprendre l'importance de l'adéquation culturelle dans le développement logiciel. Les échanges avec l'équipe technique ont souligné les limites des solutions "clé en main" souvent conçues pour d'autres contextes, et rarement adaptées aux réalités locales : modes de paiement, structures commerciales, ou contraintes d'infrastructure.

En privilégiant une démarche contextualisée, cette plateforme ouvre des perspectives prometteuses pour l'écosystème numérique sénégalais. À court terme, elle pourrait faciliter l'adoption d'outils numériques par les commerçants traditionnels. À moyen et long terme, elle pourrait contribuer à une formalisation progressive de l'économie informelle, en proposant une solution alignée sur les pratiques locales tout en introduisant des standards modernes.

Le principal enseignement tiré de ce projet réside dans la nécessité d'articuler exigence technique et compréhension du terrain. L'ingénierie logicielle, lorsqu'elle est pensée en lien étroit avec les réalités d'usage, devient un véritable levier de développement économique local. L'expérience vécue chez Insoft SAS illustre ainsi une forme d'innovation technologique ancrée dans les réalités africaines, à la fois pragmatique et porteuse d'impact.