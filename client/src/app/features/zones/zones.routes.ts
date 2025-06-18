import { Routes } from '@angular/router';
import { ZoneManagementComponent } from './zone-management/zone-management.component';
import { permissionGuard } from '#guards/permission.guard';

export const ZONE_ROUTES: Routes = [
  {
    path: '',
    component: ZoneManagementComponent,
    canActivate: [() => permissionGuard(['read:zones', 'manage:zones'])],
    data: { breadcrumb: 'Delivery Zones' }
  }
];