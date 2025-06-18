# Routes


```typescript
const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      { path: '', component: ProductListComponent },
      { path: 'authentication/login', component: LoginComponent }
    ]
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: '', component: LoginComponent },
      { path: 'dashboard', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) }
    ]
  },
  {
    path: 'tenant',
    component: TenantLayoutComponent,
    children: [
      { path: '', component: LoginComponent },
      { path: 'dashboard', loadChildren: () => import('./tenant/tenant.module').then(m => m.TenantModule) }
    ]
  }
];
```