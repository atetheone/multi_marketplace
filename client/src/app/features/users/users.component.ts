import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { CreateUserComponent } from './create-user/create-user.component'
import { MaterialModule } from '#shared/material/material.module';
import { UserService } from '#features/users/services/user.service'; 
import { User, UserResponse } from '#types/user';
import { ApiResponse } from '#types/api_response';
import { RoleResponse } from '#app/core/types/role';

import { catchError, throwError, BehaviorSubject, map, of } from 'rxjs';
import { DataState } from '#types/data_state';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AuthService } from '#services/auth.service';
import { ConfirmDialogComponent } from '#shared/components/confirm-dialog/confirm-dialog.component';
import { ToastService } from '#shared/services/toast.service';


@Component({
  selector: 'app-users',
  imports: [MaterialModule, RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.sass'
})
export class UsersComponent implements OnInit {
  // Track error state
  isLoading = false;
  hasError = false;
  displayedColumns: string[] = ['username', 'email', 'firstName', 'lastName', 'roles', 'actions'];

  dataSource = new MatTableDataSource<UserResponse>();
  
  private usersSubject = new BehaviorSubject<DataState<UserResponse[]>>({
    status: 'idle',
    error: null
  });

  viewModel$ = this.usersSubject.asObservable();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  searchControl = new FormControl('');

  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog,
    private toastService: ToastService
  ) { 
    // Set up search filter
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.applyFilter(value || '');
      });
  }

  ngOnInit(): void {
    this.loadUsers();
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

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: UserResponse, filter: string) => {
      return data.username.toLowerCase().includes(filter) ||
             data.email.toLowerCase().includes(filter) ||
             data.firstName.toLowerCase().includes(filter) ||
             data.lastName.toLowerCase().includes(filter) ||
             data.roles.some(role => role.name.toLowerCase().includes(filter));
    };
    this.dataSource.filter = filterValue;
  }

  loadUsers() {
    this.usersSubject.next({ status: 'loading', error: null });

    this.userService.getUsers()
      .pipe(
        map((response) => {

          return {
            status: 'success' as const,
            data: response.data,
            error: null
          }
        }),
        catchError((error) => of({
          status: 'error' as const,
          error: error.message
        }))
      ).subscribe(state => {
        this.usersSubject.next(state);
      })
  }

  navigateToUserDetails(userId: number) {
    this.router.navigate(['/dashboard/users', userId]);
  }

  deleteUser(user: UserResponse) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Supprimer l\'utilisateur',
        message: `Êtes-vous sûr de vouloir supprimer "${user.username}"? Cette action est irréversible.`,
        confirmText: 'Supprimer',
        cancelText: 'Annuler'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteUser(user.id).subscribe({
          next: () => {
            this.toastService.success('Utilisateur supprimé avec succès');
            this.loadUsers();
          },
          error: () => {
            this.toastService.error('Erreur lors de la suppression de l\'utilisateur');
          }
        });
      }
    });
  }

  activateUser(user: UserResponse) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Activer l\'utilisateur',
        message: `Êtes-vous sûr de vouloir activer "${user.username}"?`,
        confirmText: 'Activer',
        cancelText: 'Annuler'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.updateUserStatus(user.id, 'active').subscribe({
          next: () => {
            this.toastService.success('Utilisateur activé avec succès');
            this.loadUsers();
          },
          error: () => {
            this.toastService.error('Erreur lors de l\'activation de l\'utilisateur');
          }
        });
      }
    });
  }

  deactivateUser(user: UserResponse) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Désactiver l\'utilisateur',
        message: `Êtes-vous sûr de vouloir désactiver "${user.username}"?`,
        confirmText: 'Désactiver',
        cancelText: 'Annuler'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.updateUserStatus(user.id, 'inactive').subscribe({
          next: () => {
            this.toastService.success('Utilisateur désactivé avec succès');
            this.loadUsers();
          },
          error: () => {
            this.toastService.error('Erreur lors de la désactivation de l\'utilisateur');
          }
        });
      }
    });
  }

  // Permission checking methods
  canViewUsers(): boolean {
    return this.authService.hasPermissions(['view:users']);
  }

  canCreateUsers(): boolean {
    return this.authService.hasPermissions(['create:users']);
  }

  canUpdateUsers(): boolean {
    return this.authService.hasPermissions(['update:users']);
  }

  canDeleteUsers(): boolean {
    return this.authService.hasPermissions(['delete:users']);
  }

  canActivateUsers(): boolean {
    return this.authService.hasPermissions(['activate:users']);
  }

  canDeactivateUsers(): boolean {
    return this.authService.hasPermissions(['deactivate:users']);
  }

  canAssignRoles(): boolean {
    return this.authService.hasPermissions(['assign:roles']);
  }

}
