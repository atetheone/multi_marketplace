Je vais vous présenter une structure hiérarchique détaillée des composants Angular pour un projet e-commerce multitenants avec gestion des rôles et authentification.

# Architecture Globale des Composants

## Structure Racine
```typescript
src/
├── app/
│   ├── core/                     // Modules et services centraux
│   │   ├── auth/                 // Gestion de l'authentification
│   │   │   ├── guards/       // Guards d'authentification   
│   │   │   │   ├── auth.guard.ts
│   │   │   │   └── role.guard.ts
│   │   │   |   └── tenant.guard.ts
│   │   │   ├── interceptors/
│   │   │   │   └── token.interceptor.ts
│   │   │   └── services/
│   │   │       ├── auth.service.ts
│   │   │       └── tenant.service.ts
│   │   └── resolvers/
│   │       └── tenant-resolver.service.ts
│   │
│   ├── shared/                   // Composants et modules partagés
│   │   ├── components/
│   │   │   ├── header/
│   │   │   ├── footer/
│   │   │   └── navigation/
│   │   └── services/
│   │       └── marketplace.service.ts
│   │
│   ├── modules/                  // Modules fonctionnels
│   │   ├── marketplace/          // Marketplace commun
│   │   │   ├── components/
│   │   │   │   ├── product-list/
│   │   │   │   └── product-detail/
│   │   │   └── marketplace.module.ts
│   │   │
│   │   ├── tenant/               // Module spécifique tenant
│   │   │   ├── components/
│   │   │   │   ├── tenant-dashboard/
│   │   │   │   ├── tenant-product-management/
│   │   │   │   └── tenant-orders/
│   │   │   └── tenant.module.ts
│   │   │
│   │   └── auth/
│   │       ├── components/
│   │       │   ├── login/
│   │       │   └── registration/
│   │       └── auth.module.ts
│   │
│   └── app.module.ts
```

## Résolution de Domaine et Mapping Tenant

### Mécanisme de Résolution

```typescript
// tenant.service.ts
@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private tenantMapping = {
    'default': {
      id: 0,
      name: 'Marketplace Général',
      isDefaultTenant: true
    },
    'tenant1.domain.com': {
      id: 1,
      name: 'Tenant 1',
      isDefaultTenant: false
    },
    'tenant2.domain.com': {
      id: 2, 
      name: 'Tenant 2', 
      isDefaultTenant: false
    }
  };

  resolveTenant(hostname: string): TenantConfig {
    // Logique de résolution basée sur le hostname
    return this.tenantMapping[hostname] || this.tenantMapping['default'];
  }
}

// Interface de configuration tenant
interface TenantConfig {
  id: number;
  name: string;
  isDefaultTenant: boolean;
}
```

### Tenant Resolver
```typescript
// tenant-resolver.service.ts
@Injectable({
  providedIn: 'root'
})
export class TenantResolverService implements Resolve<TenantConfig> {
  constructor(
    private tenantService: TenantService, 
    private router: Router
  ) {}

  resolve(route: ActivatedRouteSnapshot): TenantConfig {
    const hostname = window.location.hostname;
    const tenantConfig = this.tenantService.resolveTenant(hostname);

    if (!tenantConfig) {
      this.router.navigate(['/error/tenant-not-found']);
      return null;
    }

    return tenantConfig;
  }
}
```

### Guard de Tenant
```typescript
// tenant.guard.ts
@Injectable({
  providedIn: 'root'
})
export class TenantGuard implements CanActivate {
  constructor(
    private tenantService: TenantService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot
  ): boolean {
    const tenantConfig = this.tenantService.resolveTenant(window.location.hostname);
    
    // Logique de contrôle d'accès spécifique au tenant
    if (tenantConfig.isDefaultTenant) {
      // Accès à la marketplace générale
      return true;
    }

    // Vérification des droits spécifiques au tenant
    return this.checkTenantAccess(tenantConfig);
  }

  private checkTenantAccess(tenantConfig: TenantConfig): boolean {
    // Logique personnalisée de validation d'accès
    return true;
  }
}
```

## Routing Dynamique

```typescript
// app-routing.module.ts
const routes: Routes = [
  {
    path: '',
    resolve: {
      tenant: TenantResolverService
    },
    children: [
      {
        path: '',
        canActivate: [TenantGuard],
        children: [
          { 
            path: 'marketplace', 
            loadChildren: () => import('./modules/marketplace/marketplace.module').then(m => m.MarketplaceModule)
          },
          { 
            path: 'tenant', 
            loadChildren: () => import('./modules/tenant/tenant.module').then(m => m.TenantModule)
          }
        ]
      }
    ]
  }
];
```

## Authentification et Gestion des Rôles

```typescript
// role.guard.ts
@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot
  ): boolean {
    const requiredRoles = route.data['roles'] as Array<string>;
    const userRoles = this.authService.getUserRoles();

    const hasRequiredRole = requiredRoles.some(
      role => userRoles.includes(role)
    );

    if (!hasRequiredRole) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }
}
```

## Points Clés de l'Architecture

1. **Résolution Dynamique de Tenant**
   - Mapping basé sur le hostname
   - Tenant par défaut pour la marketplace générale
   - Résolution et configuration dynamiques

2. **Sécurité et Authentification**
   - Guards pour le contrôle d'accès
   - Gestion des rôles utilisateur
   - Résolution et validation de tenant

3. **Modularité**
   - Séparation claire entre marketplace et modules tenant
   - Chargement dynamique des modules
   - Services centralisés pour l'authentification et la gestion de tenant

4. **Flexibilité**
   - Possibilité d'ajouter facilement de nouveaux tenants
   - Configuration centralisée
   - Routing dynamique

Cette architecture permet de gérer efficacement un système e-commerce multitenants avec une séparation claire des responsabilités, une sécurité robuste et une grande flexibilité.