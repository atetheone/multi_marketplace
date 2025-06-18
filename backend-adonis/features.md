# Plan de mise en œuvre de la première fonctionnalité

1. Créer la structure de la base de données pour les tenants, les utilisateurs, les rôles et les permissions.
2. Mettre en place un serveur d'authentification (par exemple, OAuth 2.0 avec JWT).
3. Implémenter l'inscription des tenants et l'ajout des utilisateurs associés.
4. Ajouter une interface de connexion et d'inscription pour les utilisateurs.
5. Implémenter un middleware pour la vérification des tokens JWT et l'autorisation basée sur les rôles et les tenants.
6. Tester la fonctionnalité pour s'assurer qu'elle respecte l'isolation multi-tenant et que l'accès aux ressources est correctement contrôlé.

## Questions importantes

a. Do you need predefined roles (like Admin, Manager, User) or should it be completely dynamic where tenants can create their own roles?
For permissions, do you want:

Resource-based (e.g., "products", "orders")
Action-based (e.g., "create", "read", "update", "delete")
Or both combined (e.g., "create:products", "read:orders")? => choose this one

b. Should roles/permissions be:

Global across all tenants
Tenant-specific 
Or a mix of both? => choose this one

c. How do you want to manage roles and permissions? Through an admin interface, API, or code?

Through an API => choose this one


<!--## Points importants dans la gestion des rôles et des permissions

1. L'attribution des rôles doit être dynamique et customisable pour chaque tenant.
2. Stratégies d'attribution des permissions :

- basée sur les ressources (par exemple, products)
- basée sur les actions (par exemple, create, read, update, delete)
- basée sur les deux combinées (par exemple, create:product, read:product, update:product, delete:product)-->
