import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { MatSort } from '@angular/material/sort';
import { MaterialModule } from '#shared/material/material.module';
import { TenantService } from './services/tenant.service';
import { TenantResponse } from '#types/tenant';
import { catchError, throwError, BehaviorSubject, map, of } from 'rxjs';
import { DataState } from '#types/data_state';
import { AuthService } from '#services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '#shared/components/confirm-dialog/confirm-dialog.component';
import { ToastService } from '#shared/services/toast.service';


@Component({
  selector: 'app-tenants',
  imports: [MaterialModule, CommonModule, RouterModule],
  templateUrl: './tenants.component.html',
  styleUrl: './tenants.component.sass'

})
export class TenantsComponent implements OnInit {
  displayedColumns: string[] = ['name', 'slug', 'domain', 'status', 'actions'];
  dataSource = new MatTableDataSource<TenantResponse>();

  private tenantsSubject = new BehaviorSubject<DataState<TenantResponse[]>>({
    status: 'idle',
    error: null
  });
  viewModel$ = this.tenantsSubject.asObservable();

  errorMessage: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private tenantService: TenantService,
    private authService: AuthService,
    private dialog: MatDialog,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadTenants();
  }

  ngAfterViewInit() {
    this.viewModel$.subscribe(state => {
      if (state.status === 'success' && state.data) {
        this.dataSource = new MatTableDataSource(state.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })

  }

  loadTenants() {
    this.tenantsSubject.next({ status: 'loading', error: null });

    this.tenantService.getTenants().pipe(
      map(response => {
        console.table(response.data);
        return {
          status: 'success' as const,
          data: response.data,
          error: null
        }
      }),
      catchError(error => of({
        status: 'error' as const,
        error: error.message
      }))
    ).subscribe(state => {
      this.tenantsSubject.next(state);
    })
  }

  navigateToTenantDetails(tenantId: number) {
    this.router.navigate(['/dashboard/tenants', tenantId])
  }

  deleteTenant(tenant: TenantResponse) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Supprimer le Tenant',
        message: `Êtes-vous sûr de vouloir supprimer "${tenant.name}"? Cette action est irréversible.`,
        confirmText: 'Supprimer',
        cancelText: 'Annuler'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.tenantService.deleteTenant(tenant.id).subscribe({
          next: () => {
            this.toastService.success('Tenant supprimé avec succès');
            this.loadTenants();
          },
          error: () => {
            this.toastService.error('Erreur lors de la suppression du tenant');
          }
        });
      }
    });
  }

  // Permission checking methods
  canViewTenants(): boolean {
    return this.authService.hasPermissions(['view:tenants']);
  }

  canCreateTenants(): boolean {
    return this.authService.hasPermissions(['create:tenants']);
  }

  canUpdateTenants(): boolean {
    return this.authService.hasPermissions(['update:tenants']);
  }

  canDeleteTenants(): boolean {
    return this.authService.hasPermissions(['delete:tenants']);
  }

}
