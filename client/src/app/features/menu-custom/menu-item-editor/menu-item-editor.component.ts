import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from '#shared/material/material.module';
import { MenuItem } from '#types/menu';
import { PermissionResponse } from '#types/permission';

interface MenuItemEditorData {
  menuItem: MenuItem | null;
  permissions: PermissionResponse[];
  parentOptions: MenuItem[];
}

@Component({
  selector: 'app-menu-item-editor',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    MatDialogModule
  ],
  templateUrl: './menu-item-editor.component.html',
  styleUrl: './menu-item-editor.component.sass'
})
export class MenuItemEditorComponent implements OnInit {
  menuItemForm!: FormGroup;
  isCreateMode: boolean;
  title: string;
  
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MenuItemEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MenuItemEditorData
  ) {
    this.isCreateMode = !data.menuItem;
    this.title = this.isCreateMode ? 'Create Menu Item' : 'Edit Menu Item';
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    const menuItem = this.data.menuItem;
    
    this.menuItemForm = this.fb.group({
      label: [menuItem?.label || '', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      icon: [menuItem?.icon || ''],
      route: [menuItem?.route || ''],
      // order: [menuItem?.order || 0, [Validators.required, Validators.min(0)]],
      isActive: [menuItem?.isActive !== undefined ? menuItem.isActive : true],
      parentId: [menuItem?.parentId || null],
      requiredPermissions: [menuItem?.requiredPermissions || []]
    });

    // If editing an existing menu item, add the id
    if (menuItem) {
      this.menuItemForm.addControl('id', new FormControl(menuItem.id));
      this.menuItemForm.addControl('order', new FormControl(menuItem.order));
    }
  }

  submit(): void {
    if (this.menuItemForm.valid) {
      this.dialogRef.close(this.menuItemForm.value);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  // Helper for the icon field - returns Material icon names for autocomplete
  getIconsList(): string[] {
    // This is a small subset of Material icons - you can expand this list or load dynamically
    return [
      'home', 'menu', 'dashboard', 'person', 'people', 'settings', 'shopping_cart',
      'store', 'payment', 'credit_card', 'account_circle', 'list', 'add', 'edit',
      'delete', 'logout', 'login', 'security', 'admin_panel_settings', 'inventory',
      'category', 'description', 'bookmark', 'favorite', 'star', 'warning'
    ];
  }

  comparePermissions(p1: string, p2: string): boolean {
    return p1 === p2;
  }
}