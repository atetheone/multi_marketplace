import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '#env/environment';
import { ApiResponse } from '#types/api_response';
import { DeliveryResponse, DeliveryPersonResponse, AssignDeliveryRequest } from '#types/delivery';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  private baseUrl = `${environment.apiUrl}/deliveries`;

  constructor(private http: HttpClient) {}

  assignDelivery(data: AssignDeliveryRequest): Observable<DeliveryResponse> {
    return this.http.post<ApiResponse<DeliveryResponse>>(`${this.baseUrl}/assign`, data)
      .pipe(
        map((response: any) => response.data)
      );    
  }

  updateDeliveryStatus(deliveryId: number, status: string, notes?: string): Observable<DeliveryResponse> {
    return this.http.patch<ApiResponse<DeliveryResponse>>(`${this.baseUrl}/${deliveryId}/status`, { status, notes })
      .pipe(
        map((response: any) => response.data)
      );  
  }

  getDeliveryDetails(id: number): Observable<DeliveryResponse> {
    return this.http.get<ApiResponse<DeliveryResponse>>(`${this.baseUrl}/${id}`)
      .pipe(
        map((response: any) => response.data)
      );
  }

  getAvailableDeliveryPersons(zoneId: number): Observable<DeliveryPersonResponse[]> {
    return this.http.get<ApiResponse<DeliveryPersonResponse[]>>(`${this.baseUrl}/available-persons/${zoneId}`)
      .pipe(
        map((response: any) => response.data)
      );
  }

  getMyDeliveries(status?: string): Observable<DeliveryResponse[]> {
    const url = status ? `${this.baseUrl}/my?status=${status}` : `${this.baseUrl}/my`;
    return this.http.get<ApiResponse<DeliveryResponse[]>>(url)
    .pipe(
      map((response: any) => response.data)
    );
  }

  getDeliveries(status?: string): Observable<DeliveryResponse[]> {
    const url = status ? `${this.baseUrl}?status=${status}` : `${this.baseUrl}`;
    return this.http.get<ApiResponse<DeliveryResponse[]>>(url)
    .pipe(
      map((response: any) => response.data)
    );
  }
}
