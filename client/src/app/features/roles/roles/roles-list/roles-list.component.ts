import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '#shared/material/material.module';
import { ToastService } from '#shared/services/toast.service';
import { RoleService } from '#services/role.service';
import { RoleResponse } from '#types/role';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '#shared/components/confirm-dialog/confirm-dialog.component';
import { RoleDialogComponent } from '../role-dialog/role-dialog.component';
import { DataState } from '#types/data_state';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

interface RolesState extends DataState<RoleResponse[]> {
  data?: RoleResponse[];
}

@Component({
  selector: 'app-roles-list',
  imports: [CommonModule, MaterialModule],
  templateUrl: './roles-list.component.html',
  styleUrl: './roles-list.component.sass',
})
export class RolesListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['name', 'permissionsCount', 'permissions', 'createdAt', 'actions'];
  dataSource!: MatTableDataSource<RoleResponse>;

  private initialState: RolesState = {
    status: 'idle',
    data: undefined,
    error: null
  };

  state = new BehaviorSubject<RolesState>(this.initialState);

  constructor(
    private roleService: RoleService,
    private dialog: MatDialog,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadRoles();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openRoleDialog(role?: RoleResponse) {
    const dialogRef = this.dialog.open(RoleDialogComponent, {
      data: {
        role,
        mode: role ? 'edit' : 'create'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (role) {
          this.updateRole(role.id, result);
        } else {
          this.createRole(result);
        }
      }
    });
  }

  private createRole(data: any) {
    this.updateState({ status: 'loading' });
    
    this.roleService.createRole(data).subscribe({
      next: () => {
        this.toastService.success('Role created successfully');
        this.loadRoles();
      },
      error: (error) => {
        this.updateState({
          status: 'error',
          error: 'Failed to create role'
        });
        this.toastService.error('Failed to create role');
      }
    });
  }

  private updateRole(id: number, data: any) {
    this.updateState({ status: 'loading' });

    this.roleService.updateRole(id, data).subscribe({
      next: () => {
        this.toastService.success('Role updated successfully');
        this.loadRoles();
      },
      error: (error) => {
        this.updateState({
          status: 'error',
          error: 'Failed to update role'
        });
        this.toastService.error('Failed to update role');
      }
    });
  }

  private loadRoles() {
    this.updateState({ status: 'loading' });
    
    this.roleService.getRoles().subscribe({
      next: (response) => {
        this.updateState({
          status: 'success',
          data: response.data
        });
        this.dataSource = new MatTableDataSource(response.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = (data: RoleResponse, filter: string) => {
          return data.name.toLowerCase().includes(filter) ||
                 data.permissions.some(p => 
                   `${p.action}:${p.resource}`.toLowerCase().includes(filter)
                 );
        };
      },
      error: (error) => {
        this.updateState({
          status: 'error',
          error: 'Failed to load roles'
        });
        this.toastService.error('Error loading roles');
      }
    });
  }

  confirmDelete(role: RoleResponse) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Role',
        message: `Are you sure you want to delete the role "${role.name}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteRole(role.id);
      }
    });
  }

  private deleteRole(id: number) {
    this.updateState({ status: 'loading' });

    this.roleService.deleteRole(id).subscribe({
      next: () => {
        this.toastService.success('Role deleted successfully');
        this.loadRoles();
      },
      error: () => {
        this.updateState({
          status: 'error',
          error: 'Failed to delete role'
        });
        this.toastService.error('Failed to delete role');
      }
    });
  }

  private updateState(partialState: Partial<RolesState>) {
    this.state.next({
      ...this.state.value,
      ...partialState
    });
  }
}