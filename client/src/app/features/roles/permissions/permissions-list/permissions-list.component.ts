import { ConfirmDialogComponent } from "#shared/components/confirm-dialog/confirm-dialog.component";
import { PermissionService } from "#core/services/permission.service";
import { ToastService } from '#shared/services/toast.service';
import { PermissionGroup, PermissionResponse } from "#core/types/permission";
import { ChangeDetectionStrategy, Component, OnInit, OnDestroy } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { BehaviorSubject, Observable, Subject, of } from "rxjs";
import { catchError, filter, finalize, map, startWith, takeUntil } from "rxjs/operators";
import { PermissionDialogComponent } from "./permission-dialog.component";
import { ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "#shared/material/material.module";
import { CommonModule } from "@angular/common";
import { DataState } from '#types/data_state';

interface PermissionsState extends DataState<PermissionGroup[]> {}

@Component({
  selector: 'app-permissions-list',
  imports: [ReactiveFormsModule, MaterialModule, CommonModule],
  templateUrl: './permissions-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PermissionsListComponent implements OnInit, OnDestroy {
  private initialState: PermissionsState = {
    status: 'idle',
    data: undefined,
    error: null
  };

  state$ = new BehaviorSubject<PermissionsState>(this.initialState);
  permissionGroups$: Observable<PermissionGroup[]>;
  
  private filterSubject = new BehaviorSubject<string>('');
  private destroy$ = new Subject<void>();

  constructor(
    private permissionService: PermissionService,
    private dialog: MatDialog,
    private toastService: ToastService
  ) {
    this.permissionGroups$ = this.permissionService.getPermissions().pipe(
      map(response => response.data),
      catchError(error => {
        this.updateState({
          status: 'error',
          error: 'Failed to load permissions'
        });
        return of([]);
      }),
      startWith([])
    );
  }

  ngOnInit() {
    this.loadPermissions();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openPermissionDialog(permission?: PermissionResponse) {
    const dialogRef = this.dialog.open(PermissionDialogComponent, {
      data: {
        permission,
        mode: permission ? 'edit' : 'create'
      },
      width: '500px'
    });

    dialogRef.afterClosed()
      .pipe(filter(Boolean), takeUntil(this.destroy$))
      .subscribe(result => {
        if (permission) {
          this.updatePermission(permission.id, result);
        } else {
          this.createPermission(result);
        }
      });
  }

  private createPermission(data: any) {
    this.updateState({ status: 'loading' });

    this.permissionService.createPermission(data).subscribe({
      next: () => {
        this.toastService.success('Permission created successfully');
        this.loadPermissions();
      },
      error: () => {
        this.updateState({
          status: 'error',
          error: 'Failed to create permission'
        });
        this.toastService.error('Failed to create permission');
      }
    });
  }

  private updatePermission(id: number, data: any) {
    this.updateState({ status: 'loading' });

    this.permissionService.updatePermission(id, data).subscribe({
      next: () => {
        this.toastService.success('Permission updated successfully');
        this.loadPermissions();
      },
      error: () => {
        this.updateState({
          status: 'error',
          error: 'Failed to update permission'
        });
        this.toastService.error('Failed to update permission');
      }
    });
  }

  private loadPermissions() {
    this.updateState({ status: 'loading' });
    
    this.permissionService.getPermissions().subscribe({
      next: (response) => {
      
        this.updateState({
          status: 'success',
          data: response.data
        });
      },
      error: (error) => {
        this.updateState({
          status: 'error',
          error: 'Failed to load permissions'
        });
        this.toastService.error('Error loading permissions');
      }
    });
  }

  confirmDelete(permission: PermissionResponse) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Permission',
        message: `Are you sure you want to delete the permission "${permission.action}" for resource "${permission.resource}"?`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed()
      .pipe(filter(Boolean), takeUntil(this.destroy$))
      .subscribe(() => this.deletePermission(permission.id));
  }

  private deletePermission(id: number) {
    this.updateState({ status: 'loading' });

    this.permissionService.deletePermission(id).subscribe({
      next: () => {
        this.toastService.success('Permission deleted successfully');
        this.loadPermissions();
      },
      error: () => {
        this.updateState({
          status: 'error',
          error: 'Failed to delete permission'
        });
        this.toastService.error('Failed to delete permission');
      }
    });
  }

  getResourceName(permission: PermissionResponse): string {
    if (!permission || !permission.resourceDetails) {
      return 'Unknown Resource';
    }
    return permission.resourceDetails.name;
  }

  private updateState(partialState: Partial<PermissionsState>) {
    this.state$.next({
      ...this.state$.value,
      ...partialState
    });
  }
}