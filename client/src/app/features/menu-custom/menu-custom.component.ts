import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { MaterialModule } from '#shared/material/material.module';
import { MenuItem } from '#types/menu';
import { MenuService } from '#services/menu.service';
import { PermissionService } from '#services/permission.service';
import { PermissionResponse } from '#types/permission';
import { ToastService } from '#shared/services/toast.service';
import { MenuItemEditorComponent } from './menu-item-editor/menu-item-editor.component';
import { ConfirmDialogComponent } from '#shared/components/confirm-dialog/confirm-dialog.component';
import { BehaviorSubject, finalize, forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-menu-custom',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    DragDropModule
  ],
  templateUrl: './menu-custom.component.html',
  styleUrl: './menu-custom.component.sass'
})
export class MenuCustomComponent implements OnInit {
  menuItems: MenuItem[] = [];
  permissions: PermissionResponse[] = [];
  isLoading = true;
  selectedMenuItem: MenuItem | null = null;
  displayedColumns: string[] = ['position', 'icon', 'label', 'route', 'permissions', 'actions'];
  loadingSubject = new BehaviorSubject<boolean>(true);
  loading$ = this.loadingSubject.asObservable();

  constructor(
    private menuService: MenuService,
    private permissionService: PermissionService,
    private dialog: MatDialog,
    private toastService: ToastService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loadingSubject.next(true);
    
    // Load menu items and permissions
    forkJoin([
      this.menuService.getMenuItems(),
      this.permissionService.getPermissionsBis()
    ]).subscribe({
      next: ([menuItems, permissionsResponse]) => {
        this.menuItems = this.flattenMenuItems(menuItems);
        this.permissions = permissionsResponse.data;
        this.loadingSubject.next(false);
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.toastService.error('Failed to load menu data');
        this.loadingSubject.next(false);
      }
    });
  }

  // Flatten nested menu structure for easier display in table
  flattenMenuItems(items: MenuItem[], parentId: number | null = null, level = 0): any[] {
    let result: any[] = [];
    
    items.forEach(item => {
      const flatItem = { 
        ...item, 
        level, 
        parentId 
      };
      
      result.push(flatItem);
      
      if (item.children && item.children.length > 0) {
        result = result.concat(
          this.flattenMenuItems(item.children, item.id, level + 1)
        );
      }
    });
    
    return result;
  }

  onDrop(event: CdkDragDrop<MenuItem[]>) {
    moveItemInArray(this.menuItems, event.previousIndex, event.currentIndex);
    
    // Update order property for all items
    this.menuItems.forEach((item, index) => {
      item.order = index;
    });
    
    this.saveMenuOrder();
  }
  
  saveMenuOrder() {
    this.loadingSubject.next(true);
    
    const updates: Observable<any>[] = this.menuItems.map(item => 
      this.menuService.updateMenuItemOrder(item.id, item.order)
    );
    
    forkJoin(updates)
      .pipe(finalize(() => this.loadingSubject.next(false)))
      .subscribe({
        next: () => {
          this.toastService.success('Menu order updated successfully');
        },
        error: (error) => {
          console.error('Error updating menu order:', error);
          this.toastService.error('Failed to update menu order');
        }
      });
  }

  openMenuItemEditor(menuItem?: MenuItem): void {
    const dialogRef = this.dialog.open(MenuItemEditorComponent, {
      width: '600px',
      data: {
        menuItem: menuItem ? {...menuItem} : null,
        permissions: this.permissions,
        parentOptions: this.menuItems.filter(item => !item.parentId)
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          this.updateMenuItem(result);
        } else {
          this.createMenuItem(result);
        }
      }
    });
  }

  createMenuItem(menuItem: any): void {
    this.loadingSubject.next(true);

    const permissionIds = menuItem.requiredPermissions?.map((permCode: any) => {
      const permission = this.permissions.find(p => 
        `${p.action}:${p.resource}` === permCode
      );
      return permission?.id;
    }).filter((id: number) => id !== undefined);
    
    // Create a new object with the transformed permissions
    const payload = {
      ...menuItem,
      requiredPermissions: permissionIds || []
    };
    
    this.menuService.createMenuItem(payload)
      .pipe(finalize(() => this.loadingSubject.next(false)))
      .subscribe({
        next: () => {
          this.toastService.success('Menu item created successfully');
          this.loadData();
        },
        error: (error) => {
          console.error('Error creating menu item:', error);
          this.toastService.error('Failed to create menu item');
        }
      });
  }

  updateMenuItem(menuItem: any): void {
    this.loadingSubject.next(true);
    
    this.menuService.updateMenuItem(menuItem.id, menuItem)
      .pipe(finalize(() => this.loadingSubject.next(false)))
      .subscribe({
        next: () => {
          this.toastService.success('Menu item updated successfully');
          this.loadData();
        },
        error: (error) => {
          console.error('Error updating menu item:', error);
          this.toastService.error('Failed to update menu item');
        }
      });
  }

  confirmDelete(menuItem: MenuItem): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Menu Item',
        message: `Are you sure you want to delete "${menuItem.label}"?`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteMenuItem(menuItem);
      }
    });
  }

  deleteMenuItem(menuItem: MenuItem): void {
    this.loadingSubject.next(true);
    
    this.menuService.deleteMenuItem(menuItem.id)
      .pipe(finalize(() => this.loadingSubject.next(false)))
      .subscribe({
        next: () => {
          this.toastService.success('Menu item deleted successfully');
          this.loadData();
        },
        error: (error) => {
          console.error('Error deleting menu item:', error);
          this.toastService.error('Failed to delete menu item');
        }
      });
  }

  // Helper methods for UI display
  getIndentation(level: number): string {
    return `${level * 20}px`;
  }

  getPermissionNames(permissions: string[] | undefined): string {
    if (!permissions || permissions.length === 0) {
      return 'None';
    }
    return permissions.join(', ');
  }
}