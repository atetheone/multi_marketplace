// role-details.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of, switchMap, tap } from 'rxjs';

import { MaterialModule } from '#shared/material/material.module';
import { ConfirmDialogComponent } from '#shared/components/confirm-dialog/confirm-dialog.component';
import { RoleService } from '#services/role.service';
import { PermissionService } from '#services/permission.service';
import { ToastService } from '#shared/services/toast.service';
import { PermissionGroup, PermissionResponse } from '#types/permission';
import { RoleResponse } from '#types/role';
import { ApiResponse } from '#types/api_response';

@Component({
  selector: 'app-role-details',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  templateUrl: './role-details.component.html',
  styleUrl: './role-details.component.sass'
})
export class RoleDetailsComponent implements OnInit {
  roleId!: number;
  role?: RoleResponse;
  permissionGroups: PermissionGroup[] = [];
  roleForm!: FormGroup;
  isEditMode = false;
  isLoading = true;
  selectedPermissions: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private roleService: RoleService,
    private permissionService: PermissionService,
    private toastService: ToastService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadRoleDetails();
  }

  private initForm(): void {
    this.roleForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      permissionIds: [[]]
    });
  }

  private loadRoleDetails(): void {
    this.isLoading = true;
    
    // Get the role ID from the route
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (!id) {
          this.toastService.error('Role ID is missing');
          this.router.navigate(['/dashboard/roles']);
          return of(null);
        }
        
        this.roleId = +id;
        return this.roleService.getRole(this.roleId);
      }),
      tap((response: ApiResponse<RoleResponse> | null) => {
        if (!response) return;
        
        this.role = response.data;
        
        // Set form values
        this.roleForm.patchValue({
          name: this.role.name,
          permissionIds: this.role.permissions.map(p => p.id)
        });
        
        // Store selected permissions
        this.selectedPermissions = this.role.permissions.map(p => p.id);
      }),
      switchMap(() => this.permissionService.getPermissions())
    ).subscribe({
      next: (permResponse: ApiResponse<PermissionGroup[]>) => {
        this.permissionGroups = permResponse.data;
        this.isLoading = false;
      },
      error: (error) => {
        this.toastService.error('Failed to load role details');
        this.isLoading = false;
        console.error('Error loading role details:', error);
      }
    });
  }

  togglePermission(permissionId: number): void {
    const index = this.selectedPermissions.indexOf(permissionId);
    
    if (index === -1) {
      this.selectedPermissions.push(permissionId);
    } else {
      this.selectedPermissions.splice(index, 1);
    }
    
    this.roleForm.get('permissionIds')?.setValue(this.selectedPermissions);
  }

  isPermissionSelected(permissionId: number): boolean {
    return this.selectedPermissions.includes(permissionId);
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    
    if (!this.isEditMode && this.role) {
      // Reset form when canceling edit
      this.roleForm.patchValue({
        name: this.role.name,
        permissionIds: this.role.permissions.map(p => p.id)
      });
      this.selectedPermissions = this.role.permissions.map(p => p.id);
    }
  }

  saveRole(): void {
    if (this.roleForm.invalid) {
      this.toastService.error('Please fix the form errors before saving');
      return;
    }
    
    const updatedRole = {
      id: this.roleId,
      name: this.roleForm.get('name')?.value,
      permissionIds: this.selectedPermissions
    };
    
    this.roleService.updateRole(this.roleId, updatedRole).subscribe({
      next: (response) => {
        this.role = response.data;
        this.toastService.success('Role updated successfully');
        this.isEditMode = false;
      },
      error: (error) => {
        this.toastService.error('Failed to update role');
        console.error('Error updating role:', error);
      }
    });
  }

  deleteRole(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Role',
        message: `Are you sure you want to delete the role "${this.role?.name}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.roleService.deleteRole(this.roleId).subscribe({
          next: () => {
            this.toastService.success(`Role "${this.role?.name}" deleted successfully`);
            this.router.navigate(['/dashboard/roles']);
          },
          error: (error) => {
            this.toastService.error('Failed to delete role');
            console.error('Error deleting role:', error);
          }
        });
      }
    });
  }
}