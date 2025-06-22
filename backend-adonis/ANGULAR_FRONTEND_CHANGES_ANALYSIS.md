# Angular Frontend Changes Analysis for Tenant Isolation

## Overview
The new tenant-isolated database structure requires specific Angular frontend changes to properly handle multi-tenancy. This document outlines all necessary Angular modifications.

## Critical Angular Frontend Changes Required

### 1. **Authentication & User Context**

#### **Login Flow Changes**
```typescript
// BEFORE: Simple login
interface LoginResponse {
  user: User;
  token: string;
}

// AFTER: Tenant-aware login
interface LoginResponse {
  user: User;
  tenant: Tenant;
  token: string;
  availableTenants?: Tenant[]; // If user has access to multiple tenants
}
```

#### **Angular Service for Tenant Context**
```typescript
// tenant.service.ts
@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private currentTenantSubject = new BehaviorSubject<Tenant | null>(null);
  private availableTenantsSubject = new BehaviorSubject<Tenant[]>([]);

  public currentTenant$ = this.currentTenantSubject.asObservable();
  public availableTenants$ = this.availableTenantsSubject.asObservable();

  get currentTenant(): Tenant | null {
    return this.currentTenantSubject.value;
  }

  setCurrentTenant(tenant: Tenant): void {
    this.currentTenantSubject.next(tenant);
    localStorage.setItem('currentTenant', JSON.stringify(tenant));
  }

  setAvailableTenants(tenants: Tenant[]): void {
    this.availableTenantsSubject.next(tenants);
  }

  async switchTenant(tenantId: number): Promise<void> {
    const tenant = this.availableTenantsSubject.value.find(t => t.id === tenantId);
    if (tenant) {
      this.setCurrentTenant(tenant);
      // Redirect to tenant-specific domain
      window.location.href = `https://${tenant.domain}`;
    }
  }

  getTenantFromDomain(hostname: string): string {
    // dakar-express.jefjel.sn -> 'dakar-express'
    // teranga.jefjel.sn -> 'teranga'
    // jefjel.sn -> 'default'
    
    if (hostname === 'jefjel.sn') return 'default';
    return hostname.split('.')[0];
  }
}
```

### 2. **HTTP Interceptor for Tenant Headers**

```typescript
// tenant-interceptor.service.ts
@Injectable()
export class TenantInterceptor implements HttpInterceptor {
  constructor(private tenantService: TenantService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentTenant = this.tenantService.currentTenant;
    
    if (currentTenant) {
      const tenantRequest = req.clone({
        setHeaders: {
          'X-Tenant-Id': currentTenant.id.toString(),
          'X-Tenant-Slug': currentTenant.slug,
        }
      });
      return next.handle(tenantRequest);
    }
    
    return next.handle(req);
  }
}

// app.module.ts
providers: [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: TenantInterceptor,
    multi: true
  }
]
```

### 3. **Angular Guards for Tenant Access**

```typescript
// tenant.guard.ts
@Injectable({
  providedIn: 'root'
})
export class TenantGuard implements CanActivate {
  constructor(
    private tenantService: TenantService,
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentTenant = this.tenantService.currentTenant;
    const user = this.authService.currentUser;
    
    if (!currentTenant) {
      this.router.navigate(['/tenant-select']);
      return false;
    }

    const requiredRole = route.data?.['role'];
    if (requiredRole && !user?.hasRole(requiredRole)) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }
}

// route-config.ts
const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [TenantGuard],
    data: { role: 'admin' }
  },
  {
    path: 'deliveries',
    component: DeliveriesComponent,
    canActivate: [TenantGuard]
  }
];
```

### 4. **Tenant-Aware Services**

```typescript
// delivery.service.ts
@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  constructor(
    private http: HttpClient,
    private tenantService: TenantService
  ) {}

  getAvailableDeliveryPersons(zoneId: number): Observable<DeliveryPerson[]> {
    const tenantId = this.tenantService.currentTenant?.id;
    return this.http.get<DeliveryPerson[]>(`/api/deliveries/persons/${zoneId}`, {
      params: { tenant_id: tenantId?.toString() || '' }
    });
  }

  assignDelivery(orderId: number, deliveryPersonId: number, notes: string): Observable<Delivery> {
    return this.http.post<Delivery>('/api/deliveries/assign', {
      orderId,
      deliveryPersonId, // This is now delivery_person.id, not user.id
      notes
    });
  }

  getDeliveries(): Observable<Delivery[]> {
    const tenantId = this.tenantService.currentTenant?.id;
    return this.http.get<Delivery[]>('/api/deliveries', {
      params: { tenant_id: tenantId?.toString() || '' }
    });
  }
}
```

### 5. **Angular Components Updates**

#### **Tenant Switcher Component**
```typescript
// tenant-switcher.component.ts
@Component({
  selector: 'app-tenant-switcher',
  template: `
    <mat-select 
      [value]="currentTenant?.id" 
      (selectionChange)="onTenantChange($event.value)"
      placeholder="Sélectionner un magasin">
      <mat-option *ngFor="let tenant of availableTenants$ | async" [value]="tenant.id">
        {{ tenant.name }}
      </mat-option>
    </mat-select>
  `
})
export class TenantSwitcherComponent implements OnInit {
  currentTenant$ = this.tenantService.currentTenant$;
  availableTenants$ = this.tenantService.availableTenants$;

  constructor(private tenantService: TenantService) {}

  ngOnInit(): void {
    // Auto-detect tenant from domain
    const hostname = window.location.hostname;
    const tenantSlug = this.tenantService.getTenantFromDomain(hostname);
    // Load tenant by slug
  }

  onTenantChange(tenantId: number): void {
    this.tenantService.switchTenant(tenantId);
  }
}
```

#### **Delivery Assignment Component (FIXED)**
```typescript
// delivery-assignment.component.ts
@Component({
  selector: 'app-delivery-assignment',
  template: `
    <mat-form-field>
      <mat-label>Livreur</mat-label>
      <mat-select [(value)]="selectedDeliveryPersonId">
        <mat-option *ngFor="let dp of deliveryPersons$ | async" [value]="dp.id">
          {{ dp.user.fullName }} - {{ dp.vehicleType }}
        </mat-option>
      </mat-select>
    </mat-form-field>
    
    <button mat-raised-button color="primary" (click)="assignDelivery()">
      Assigner la livraison
    </button>
  `
})
export class DeliveryAssignmentComponent {
  deliveryPersons$ = this.deliveryService.getAvailableDeliveryPersons(this.zoneId);
  selectedDeliveryPersonId: number | null = null;

  constructor(
    private deliveryService: DeliveryService,
    @Inject(MAT_DIALOG_DATA) public data: { orderId: number, zoneId: number }
  ) {}

  assignDelivery(): void {
    if (this.selectedDeliveryPersonId) {
      this.deliveryService.assignDelivery(
        this.data.orderId, 
        this.selectedDeliveryPersonId, // Using delivery_person.id, not user.id
        ''
      ).subscribe({
        next: (delivery) => {
          console.log('Livraison assignée avec succès', delivery);
        },
        error: (error) => {
          console.error('Erreur lors de l\'assignation', error);
        }
      });
    }
  }
}
```

### 6. **Tenant Branding Service**

```typescript
// tenant-branding.service.ts
@Injectable({
  providedIn: 'root'
})
export class TenantBrandingService {
  constructor(
    private tenantService: TenantService,
    private document: Document,
    private titleService: Title
  ) {
    this.tenantService.currentTenant$.subscribe(tenant => {
      if (tenant) {
        this.applyTenantBranding(tenant);
      }
    });
  }

  private applyTenantBranding(tenant: Tenant): void {
    // Apply colors
    if (tenant.branding?.primaryColor) {
      this.document.documentElement.style.setProperty(
        '--primary-color', 
        tenant.branding.primaryColor
      );
    }

    if (tenant.branding?.secondaryColor) {
      this.document.documentElement.style.setProperty(
        '--secondary-color', 
        tenant.branding.secondaryColor
      );
    }

    // Update title
    this.titleService.setTitle(`${tenant.name} - JefJel`);

    // Apply favicon if available
    if (tenant.branding?.logo) {
      this.updateFavicon(tenant.branding.logo);
    }
  }

  private updateFavicon(logoUrl: string): void {
    const link: HTMLLinkElement = this.document.querySelector("link[rel*='icon']") || 
                                  this.document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = logoUrl;
    this.document.getElementsByTagName('head')[0].appendChild(link);
  }
}
```

### 7. **Feature Flag Directive**

```typescript
// feature-flag.directive.ts
@Directive({
  selector: '[appFeatureFlag]'
})
export class FeatureFlagDirective implements OnInit {
  @Input('appFeatureFlag') featureName!: string;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private tenantService: TenantService
  ) {}

  ngOnInit(): void {
    this.tenantService.currentTenant$.subscribe(tenant => {
      if (tenant?.settings?.features?.includes(this.featureName)) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    });
  }
}

// Usage in template
<div *appFeatureFlag="'deliveries'">
  <app-delivery-tracker></app-delivery-tracker>
</div>
```

### 8. **Environment Configuration**

```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3333/api',
  mainDomain: 'jefjel.sn',
  defaultTenant: 'default',
  enableMultiTenant: true,
  
  // Senegal context
  currency: 'XOF',
  country: 'SN',
  timezone: 'Africa/Dakar',
  language: 'fr',
  
  paymentMethods: [
    { type: 'orange-money', name: 'Orange Money', enabled: true },
    { type: 'wave', name: 'Wave', enabled: true },
    { type: 'free-money', name: 'Free Money', enabled: true },
    { type: 'cash', name: 'Espèces', enabled: true }
  ]
};
```

### 9. **Angular Pipes for Senegal Context**

```typescript
// xof-currency.pipe.ts
@Pipe({ name: 'xofCurrency' })
export class XofCurrencyPipe implements PipeTransform {
  transform(value: number): string {
    return new Intl.NumberFormat('fr-SN', {
      style: 'currency',
      currency: 'XOF'
    }).format(value);
  }
}

// Usage in template
{{ deliveryFee | xofCurrency }} <!-- "1 500 F CFA" -->
```

### 10. **State Management with NgRx (Optional)**

```typescript
// tenant.state.ts
export interface TenantState {
  currentTenant: Tenant | null;
  availableTenants: Tenant[];
  loading: boolean;
  error: string | null;
}

// tenant.actions.ts
export const loadTenant = createAction(
  '[Tenant] Load Tenant',
  props<{ slug: string }>()
);

export const setCurrentTenant = createAction(
  '[Tenant] Set Current Tenant',
  props<{ tenant: Tenant }>()
);

// tenant.effects.ts
@Injectable()
export class TenantEffects {
  loadTenant$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTenant),
      switchMap(action =>
        this.tenantService.getTenantBySlug(action.slug).pipe(
          map(tenant => setCurrentTenant({ tenant })),
          catchError(error => of(tenantLoadFailure({ error })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private tenantService: TenantService
  ) {}
}
```

## Summary of Required Angular Changes

### **Critical Changes** (Must implement):
1. ✅ **TenantService** - Manage current tenant and tenant switching
2. ✅ **HTTP Interceptor** - Automatic tenant headers in all requests  
3. ✅ **Tenant Guards** - Protect routes based on tenant access
4. ✅ **Updated Services** - Tenant-aware API calls
5. ✅ **Delivery Component Fix** - Use delivery_person.id instead of user.id

### **Important Changes** (Should implement):
6. ✅ **Tenant Branding Service** - Dynamic colors, logos, titles
7. ✅ **Feature Flag Directive** - Show/hide features based on tenant settings
8. ✅ **Payment Components** - Senegal-specific mobile money integration
9. ✅ **XOF Currency Pipe** - Proper Senegalese currency formatting

### **Nice to Have** (Can implement later):
10. ✅ **NgRx State Management** - Complex tenant state management
11. ✅ **Multi-language Support** - i18n for French/Wolof
12. ✅ **Analytics Service** - Tenant-specific tracking

## Impact on Existing Angular Code

### **Low Impact** (Minor changes):
- Component @Input() properties (add tenant context)
- Service method parameters (add tenant ID)
- Environment configuration

### **Medium Impact** (Moderate refactoring):
- Authentication service and guards
- HTTP client services
- Angular Material theme configuration
- Form validation and submission

### **High Impact** (Major refactoring):
- App initialization and bootstrap
- Main navigation and layout components
- Dashboard and admin components
- Routing configuration

## Angular Migration Strategy

### **Phase 1**: Core tenant isolation
1. Implement TenantService and HTTP Interceptor
2. Update authentication flow and guards
3. Fix delivery assignment component

### **Phase 2**: User experience
1. Add tenant branding service
2. Implement feature flag directive
3. Create tenant switcher component

### **Phase 3**: Advanced features
1. Implement NgRx state management (if needed)
2. Add i18n support for French/Wolof
3. Advanced permission-based UI rendering

The Angular frontend changes are **moderate in scope** but **critical for functionality**. The delivery assignment bug will be fixed once the Angular component uses the correct delivery person IDs from the updated API response.