import { Routes } from '@angular/router';
import { permissionGuard } from '#guards/permission.guard';
import { MenuCustomComponent } from './menu-custom.component';

export const MENU_CUSTOM_ROUTES: Routes = [
  {
    path: '',
    component: MenuCustomComponent,
    canActivate: [() => permissionGuard(['update:menus', 'read:menus'])],
    data: { breadcrumb: 'Menu Customization' }
  }
];