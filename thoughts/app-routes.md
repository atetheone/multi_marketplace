# App routes

```typescript
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: 'DefaultLayoutComponent', 
    children: [
      { path: '', component: 'MarketplaceComponent' }, 
      { path: 'login', component: 'LoginComponent' }, 
    ]
  },
  {
    path: 'admin',
    component: 'AdminDashboardLayoutComponent',
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: 'DashboardComponent' },
      {
        path: 'tenant-management',
        loadComponent: () => import('./features/tenant-management/tenant-management.component').then(m => m.TenantManagementComponent)
      },
      {
        path: 'user-management',
        loadComponent: () => import('./features/user-management/user-management.component').then(m => m.UserManagementComponent)
      },
      {
        path: 'role-management',
        loadComponent: () => import('./features/role-management/role-management.component').then(m => m.RoleManagementComponent)
      },
      {
        path: 'product-management',
        loadComponent: () => import('./features/product-management/product-management.component').then(m => m.ProductManagementComponent)
      },
      {
        path: 'order-management',
        loadComponent: () => import('./features/order-management/order-management.component').then(m => m.OrderManagementComponent)
      }
    ]
  },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];

export const appRoutes = RouterModule.forRoot(routes);
```