import { Injectable } from '@angular/core';
import { environment } from '#env/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { CreatePermissionDto, PermissionGroup, PermissionResponse, UpdatePermissionDto } from '#types/permission';
import { ApiResponse } from '#types/api_response';
import { ToastService } from '#shared/services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  apiUrl = `${environment.apiUrl}/permissions`

  constructor(
    private http: HttpClient,
    private toastService: ToastService
  ) { }

  getPermissions(): Observable<ApiResponse<PermissionGroup[]>> {
    return this.http.get<ApiResponse<PermissionResponse[]>>(this.apiUrl).pipe(
      map(response => {
        return {
          ...response,
          data: this.groupPermissions(response.data)
        }
      }),
    );
  }

  getPermissionsBis(): Observable<ApiResponse<PermissionResponse[]>> {
    return this.http.get<ApiResponse<PermissionResponse[]>>(this.apiUrl);
  }


  createPermission(data: CreatePermissionDto): Observable<ApiResponse<PermissionResponse>> {
    console.log('Permission to be created: ' + JSON.stringify(data, null, 2))
    return this.http.post<ApiResponse<PermissionResponse>>(this.apiUrl, data).pipe(
      tap(() => this.toastService.success('Permission created successfully')),
      catchError(error => {
        this.toastService.error('Failed to create permission');
        return throwError(() => error);
      })
    );
  }

  // updatePermission$(permId: number, perm: Partial<PermissionResponse>): Observable<ApiResponse<PermissionResponse>> {
  //   return this.http.put<ApiResponse<PermissionResponse>>(`${this.apiUrl}/${permId}`, perm);
  // }

  updatePermission(
    id: number, 
    data: UpdatePermissionDto
  ): Observable<ApiResponse<PermissionResponse>> {
    return this.http.put<ApiResponse<PermissionResponse>>(`${this.apiUrl}/${id}`, data).pipe(
      tap(() => this.toastService.success('Permission updated successfully')),
      catchError(error => {
        this.toastService.error('Failed to update permission');
        return throwError(() => error);
      })
    );
  }

  // deletePermission$(permId: number): Observable<ApiResponse<PermissionResponse>> {
  //   return this.http.delete<ApiResponse<PermissionResponse>>(`${this.apiUrl}/${permId}`);
  // }

  deletePermission(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.toastService.success('Permission deleted successfully')),
      catchError(error => {
        this.toastService.error('Failed to delete permission');
        return throwError(() => error);
      })
    );
  }

  private groupPermissions(permissions: PermissionResponse[]): PermissionGroup[] {
    // Group permissions by resource id
    const groupedByResource = permissions.reduce((groups, permission) => {
      const resourceId = permission.resourceDetails.id;
      if (!groups[resourceId]) {
        groups[resourceId] = {
          id: resourceId,
          permissions: [] 
        };
      }
      groups[resourceId].permissions.push(permission);
      return groups;
    }, {} as Record<string, PermissionGroup>);


    // Convert to array and sort permissions within each group
    return Object.values(groupedByResource)
    .map(group => ({
      id: group.id,
      permissions: group.permissions.sort((a, b) => 
        a.action.localeCompare(b.action)
      )
    }))
    .sort((a, b) => a.id - b.id);
  }
}
