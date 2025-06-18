import { Routes } from '@angular/router';
// import { DeliveriesComponent } from './deliveries.component';
import { DeliveriesDashboardComponent } from './deliveries-dashboard/deliveries-dashboard.component';
import { DeliveryPersonListComponent } from './delivery-person/delivery-person-list.component';
import { permissionGuard } from '#guards/permission.guard';

export const DELIVERIES_ROUTES: Routes = [
  {
    path: '',
    component: DeliveriesDashboardComponent,
    canActivate: [() => permissionGuard(['read:deliveries'])],
    data: { breadcrumb: 'Deliveries Management' }
  },
  {
    path: 'deliveries-persons',
    component: DeliveryPersonListComponent
  }
];