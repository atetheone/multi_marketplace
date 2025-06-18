import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { 
  ReactiveFormsModule, 
  FormBuilder, 
  FormGroup,
  Validators, 
  FormControl 
} from '@angular/forms';
import { MaterialModule } from '#shared/material/material.module';

import { UserService } from '#features/users/services/user.service';
import { RoleService } from '#services/role.service';
import { ToastService } from '#shared/services/toast.service';
import { RoleResponse } from '#types/role';
import { PermissionService } from '#services/permission.service';
import { PermissionResponse, PermissionGroup } from '#types/permission';
import { finalize, tap, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatSelectChange } from '@angular/material/select';



@Component({
  selector: 'app-create-user',
  imports: [MaterialModule, ReactiveFormsModule, CommonModule],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.sass'
})
export class CreateUserComponent implements OnInit {
  isLoading = false;
  userForm: FormGroup;
  availableRoles: RoleResponse[] = [];
  filteredRoles: RoleResponse[] = []; // 
  roleSearchCtrl = new FormControl(''); //
  permissionGroups: PermissionGroup[] = [];
  roles: RoleResponse[] = [];
  selectedRoles: RoleResponse[] = [];
  selectedPermissions: string[] = [];
  showPermissions = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private roleService: RoleService,
    private toastService: ToastService,
    private permissionService: PermissionService, // added lately
    private router: Router
  ) {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      roles: [[], Validators.required],
      status: ['active'],
    });

    // Filter roles as user types
    this.roleSearchCtrl.valueChanges.subscribe(value => {
      this.filterRoles(value || '');
    });
  }


  ngOnInit() {
    this.loadRoles();
  }

  onSubmit() {
    if (this.userForm.invalid) {
      this.markFormGroupTouched(this.userForm);
      return;
    }
    this.isLoading = true;
    const userData = this.userForm.value

    this.userService.createUser(userData)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => {
          this.toastService.success(response.message);
          this.router.navigate(['/dashboard/users']);
        },
        error: (error) => {
          this.toastService.error('Failed to create user');
          console.error('Error creating user:', error);
        }
      });
    
  }

  goBack() {
    this.router.navigate(['/dashboard/users']);
  }

  private filterRoles(value: string) {
    const filterValue = value.toLowerCase();
    this.filteredRoles = this.availableRoles.filter(role =>
      role.name.toLowerCase().includes(filterValue)
    );
  }

  
  isRoleSelected(roleId: number): boolean {
    const selectedRoles = this.userForm.get('roles')?.value || [];
    return selectedRoles.includes(roleId);
  }
  
  toggleRole(roleId: number) {
    const currentRoles = this.userForm.get('roles')?.value || [];
    if (this.isRoleSelected(roleId)) {
      this.userForm.patchValue({
        roles: currentRoles.filter((id: number) => id !== roleId)
      });
    } else {
      this.userForm.patchValue({
        roles: [...currentRoles, roleId]
      });
    }

    // Update selected permissions based on current role selection
    this.updateSelectedPermissions();

  }

  updateSelectedPermissions() {
    this.selectedRoles = [];
    this.selectedPermissions = [];
    
    const selectedRoleIds = this.userForm.get('roles')?.value || [];
    
    selectedRoleIds.forEach((roleId: number) => {
      const role = this.roles.find(r => r.id === roleId);
      if (role) {
        this.selectedRoles.push(role);
        
        // Extract unique permissions from the selected roles
        role.permissions.forEach(permission => {
          const permString = `${permission.action}:${permission.resourceDetails.name}`;
          if (!this.selectedPermissions.includes(permString)) {
            this.selectedPermissions.push(permString);
          }
        });
      }
    });
    
    this.showPermissions = this.selectedPermissions.length > 0;
  }

  loadRoles() {
    this.isLoading = true;
    this.roleService.getRoles()
      .pipe(
        tap(response => {
          this.roles = response.data;
          this.availableRoles = response.data;
          this.filteredRoles = response.data;
        }),
        switchMap(() => this.permissionService.getPermissions()),
        catchError(error => {
          console.error('Error loading data:', error);
          return of(null);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(permissionsResponse => {
        if (permissionsResponse) {
          this.permissionGroups = permissionsResponse.data;
        }
      });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as FormGroup).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }

  compareRoles(role1: any, role2: any): boolean {
    return role1 && role2 ? role1.id === role2.id : role1 === role2;
  }

  onRoleSelectionChange(event: MatSelectChange): void {
    this.selectedRoles = [];
    this.selectedPermissions = [];
    
    // Convert selected role IDs to actual role objects
    const selectedRoleIds = event.value as number[];
    
    selectedRoleIds.forEach(roleId => {
      const role = this.roles.find(r => r.id === roleId);
      if (role) {
        this.selectedRoles.push(role);
        
        // Extract unique permissions from the selected roles
        role.permissions.forEach(permission => {
          const permString = `${permission.action}:${permission.resourceDetails.name}`;
          if (!this.selectedPermissions.includes(permString)) {
            this.selectedPermissions.push(permString);
          }
        });
      }
    });
    
    this.showPermissions = this.selectedPermissions.length > 0;
  }

  getPermissionDisplayName(permission: string): string {
    const [action, resource] = permission.split(':');
    return `${this.capitalizeFirstLetter(action)} ${this.capitalizeFirstLetter(resource)}`;
  }

  capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  getRolePermissions(role: RoleResponse): string[] {
    return role.permissions.map(permission => 
      `${permission.action}:${permission.resourceDetails?.name || permission.resource}`
    );
  }
}
