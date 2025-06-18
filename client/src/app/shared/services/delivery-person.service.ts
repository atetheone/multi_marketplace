import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '#env/environment';
import { ApiResponse } from '#types/api_response';
import { DeliveryPersonResponse, UpdateZonesRequest } from '#types/delivery';

@Injectable({
  providedIn: 'root'
})
export class DeliveryPersonService {
  private baseUrl = `${environment.apiUrl}/delivery-persons`;

  constructor(private http: HttpClient) {}

  createDeliveryPerson(data: DeliveryPersonResponse): Observable<ApiResponse<DeliveryPersonResponse>> {
    return this.http.post<ApiResponse<DeliveryPersonResponse>>(this.baseUrl, data);
  }

  updateDeliveryPerson(id: number, data: DeliveryPersonResponse): Observable<ApiResponse<DeliveryPersonResponse>> {
    console.log('Person to update: ' + JSON.stringify(data, null, 3))
    return this.http.put<ApiResponse<DeliveryPersonResponse>>(`${this.baseUrl}/${id}`, data);
  }

  // updateZones(id: number, data: UpdateZonesRequest): Observable<ApiResponse<DeliveryPersonResponse>> {
  //   return this.http.patch<ApiResponse<DeliveryPersonResponse>>(`${this.baseUrl}/${id}/zones`, data);
  // }

  updateMyZones(data: UpdateZonesRequest): Observable<ApiResponse<DeliveryPersonResponse>> {
    return this.http.patch<ApiResponse<DeliveryPersonResponse>>(`${this.baseUrl}/profile/zones`, data);
  }

  toggleAvailability(isAvailable: boolean): Observable<ApiResponse<DeliveryPersonResponse>> {
    return this.http.patch<ApiResponse<DeliveryPersonResponse>>(`${this.baseUrl}/profile/availability`, { isAvailable });
  }

  getProfile(): Observable<ApiResponse<DeliveryPersonResponse>> {
    return this.http.get<ApiResponse<DeliveryPersonResponse>>(`${this.baseUrl}/profile`);
  }

  getDeliveryPerson(id: number): Observable<ApiResponse<DeliveryPersonResponse>> {
    return this.http.get<ApiResponse<DeliveryPersonResponse>>(`${this.baseUrl}/${id}`);
    // NOT implemented yet
  }


  listDeliveryPersons(zoneId?: number): Observable<ApiResponse<DeliveryPersonResponse[]>> {
    // const params = zoneId ? { zoneId } : {};
    return this.http.get<ApiResponse<DeliveryPersonResponse[]>>(`${this.baseUrl}`);
  }
}
/*
router.put('/:id/zones', [DeliveryPersonController, 'updateZones'])

router.get('/profile', [DeliveryPersonController, 'getMyProfile'])
router.put('/profile/availability', [DeliveryPersonController, 'toggleAvailability'])
router.put('/profile/zones', [DeliveryPersonController, 'updateZones'])*/