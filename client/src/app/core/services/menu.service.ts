import { Injectable } from '@angular/core';
import { MenuItem, MenuResponse } from '#types/menu'
import { Observable, BehaviorSubject, of, map } from 'rxjs';
import { catchError, tap } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http'
import { AuthService } from './auth.service';
import { ToastService } from '#shared/services/toast.service';
import { environment } from '#env/environment';
import { ApiResponse } from '#types/api_response';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private menuApi = `${environment.apiUrl}/menus`;
  private menuSubject = new BehaviorSubject<MenuItem[]>([]);
  menu$ = this.menuSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private toastService: ToastService
  ) { }

  getMenuItems(): Observable<MenuItem[]> {
    return this.http.get<MenuResponse>(`${this.menuApi}/structure`).pipe(
      map(response => response.data),
      catchError(error => {
        console.error('Error fetching menu:', error);
        return of([]);
      })
    );
  }

  loadMenu(): void {
    this.getMenuItems().subscribe(menu => {
      this.menuSubject.next(menu);
    });
  }

  getUserMenu(): Observable<MenuResponse> {
    return this.http.get<MenuResponse>(`${this.menuApi}/structure`)

  }


  createMenuItem(menuItem: Partial<MenuItem>): Observable<ApiResponse<MenuItem>> {
    const payload = {
      ...menuItem,
      // Make sure to properly transform the permissions field if needed
      permissions: menuItem.requiredPermissions || [], // Backend might expect 'permissions' not 'requiredPermissions'
    };
    
    console.log('Sending create request with payload:', payload);
    return this.http.post<ApiResponse<MenuItem>>(this.menuApi, menuItem).pipe(
      tap(() => this.refreshMenuCache()),
      catchError(error => {
        this.toastService.error('Failed to create menu item');
        return of({ success: false, message: error.message, data: {} as MenuItem });
      })
    );
  }

  updateMenuItem(id: number, menuItem: Partial<MenuItem>): Observable<ApiResponse<MenuItem>> {
    return this.http.put<ApiResponse<MenuItem>>(`${this.menuApi}/${id}`, menuItem).pipe(
      tap(() => this.refreshMenuCache()),
      catchError(error => {
        this.toastService.error('Failed to update menu item');
        return of({ success: false, message: error.message, data: {} as MenuItem });
      })
    );
  }

  updateMenuItemOrder(id: number, order?: number): Observable<ApiResponse<MenuItem>> {
    return this.http.patch<ApiResponse<MenuItem>>(`${this.menuApi}/${id}`, { order }).pipe(
      catchError(error => {
        this.toastService.error('Failed to update menu order');
        return of({ success: false, message: error.message, data: {} as MenuItem });
      })
    );
  }

  deleteMenuItem(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.menuApi}/${id}`).pipe(
      tap(() => this.refreshMenuCache()),
      catchError(error => {
        this.toastService.error('Failed to delete menu item');
        return of({ success: false, message: error.message, data: undefined });
      })
    );
  }

  private refreshMenuCache(): void {
    this.loadMenu();
  }
}
