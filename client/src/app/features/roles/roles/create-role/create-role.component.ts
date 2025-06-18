import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '#shared/material/material.module';
import { RoleService } from '#services/role.service';
import { PermissionService } from '#services/permission.service';
import { ToastService } from '#shared/services/toast.service';
import { PermissionGroup, PermissionResponse } from '#types/permission';
import { CreateRoleRequest } from '#types/role';

@Component({
  selector: 'app-create-role',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    RouterModule
  ],
  templateUrl: './create-role.component.html',
  styleUrl: './create-role.component.sass'
})
export class CreateRoleComponent implements OnInit {
  roleForm: FormGroup;
  permissionGroups: PermissionGroup[] = [];
  isLoading = false;
  formSubmitted = false;

  private fb = inject(FormBuilder);
  private roleService = inject(RoleService);
  private permissionService = inject(PermissionService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  constructor() {
    this.roleForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      permissionIds: [[], [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadPermissions();
  }

  loadPermissions(): void {
    this.isLoading = true;
    this.permissionService.getPermissions().subscribe({
      next: (response) => {
        this.permissionGroups = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        this.toastService.error('Failed to load permissions');
        this.isLoading = false;
      }
    });
  }

  getAllPermissions(): PermissionResponse[] {
    return this.permissionGroups.flatMap(group => group.permissions);
  }

  onSubmit(): void {
    this.formSubmitted = true;
    
    if (this.roleForm.invalid) {
      return;
    }

    this.isLoading = true;
    const formValue = this.roleForm.value;
    
    const roleData: CreateRoleRequest = {
      id: 0, // Will be ignored by the backend for creation
      name: formValue.name,
      permissionIds: formValue.permissionIds as number[]
    };

    this.roleService.createRole(roleData).subscribe({
      next: (response) => {
        this.toastService.success('Role created successfully');
        this.isLoading = false;
        this.router.navigate(['/dashboard/roles']);
      },
      error: (error) => {
        this.toastService.error('Failed to create role', error.message);
        this.isLoading = false;
      }
    });
  }

  getSelectedPermissionCount(): number {
    const permissionIds = this.roleForm.get('permissionIds')?.value || [];
    return permissionIds.length;
  }

  toggleAllPermissions(groupIndex: number, event: any): void {
    const permissionIds = this.roleForm.get('permissionIds')?.value || [];
    const groupPermissions = this.permissionGroups[groupIndex].permissions;
    
    // Check if we're selecting or deselecting permissions
    if (event.checked) {
      // Add all permissions from this group
      const newPermissionIds = [
        ...permissionIds,
        ...groupPermissions.map(p => p.id).filter(id => !permissionIds.includes(id))
      ];
      this.roleForm.get('permissionIds')?.setValue(newPermissionIds);
    } else {
      // Remove all permissions from this group
      const newPermissionIds = permissionIds.filter(
        (id: number) => !groupPermissions.map(p => p.id).includes(id)
      );
      this.roleForm.get('permissionIds')?.setValue(newPermissionIds);
    }
  }

  isGroupSelected(groupIndex: number): boolean {
    const permissionIds = this.roleForm.get('permissionIds')?.value || [];
    const groupPermissionIds = this.permissionGroups[groupIndex].permissions.map(p => p.id);
    
    return groupPermissionIds.every(id => permissionIds.includes(id));
  }

  isIndeterminate(groupIndex: number): boolean {
    const permissionIds = this.roleForm.get('permissionIds')?.value || [];
    const groupPermissionIds = this.permissionGroups[groupIndex].permissions.map(p => p.id);
    
    const hasSelected = groupPermissionIds.some(id => permissionIds.includes(id));
    const hasUnselected = groupPermissionIds.some(id => !permissionIds.includes(id));
    
    return hasSelected && hasUnselected;
  }

  togglePermission(permissionId: number): void {
    const permissionIds = [...(this.roleForm.get('permissionIds')?.value || [])];
    const index = permissionIds.indexOf(permissionId);
    
    if (index > -1) {
      permissionIds.splice(index, 1);
    } else {
      permissionIds.push(permissionId);
    }
    
    this.roleForm.get('permissionIds')?.setValue(permissionIds);
  }

  isPermissionSelected(permissionId: number): boolean {
    const permissionIds = this.roleForm.get('permissionIds')?.value || [];
    return permissionIds.includes(permissionId);
  }

  selectAll(): void {
    const allPermissionIds = this.getAllPermissions().map(p => p.id);
    this.roleForm.get('permissionIds')?.setValue(allPermissionIds);
  }

  deselectAll(): void {
    this.roleForm.get('permissionIds')?.setValue([]);
  }

  cancel(): void {
    this.router.navigate(['/dashboard/roles']);
  }

  // For debugging
  getFormValue(): any {
    return this.roleForm.value;
  }
}