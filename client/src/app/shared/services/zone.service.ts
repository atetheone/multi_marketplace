import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '#env/environment';
import { ApiResponse } from '#types/api_response';
import { CreateZoneDto, DeliveryZoneResponse } from '#types/zone';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ZoneService {
  zoneApiUrl = `${environment.apiUrl}/zones`

  constructor(
    private http: HttpClient
  ) { }

  getZones(): Observable<DeliveryZoneResponse[]> {
    return this.http.get<ApiResponse<DeliveryZoneResponse[]>>(this.zoneApiUrl)
      .pipe(
        map(response => response.data)
      );
  }

  getZoneById(id: string): Observable<DeliveryZoneResponse> {
    return this.http.get<ApiResponse<DeliveryZoneResponse>>(`${this.zoneApiUrl}/${id}`)
      .pipe(
        map(response => response.data)
      );
  }

  createZone(zone: CreateZoneDto): Observable<DeliveryZoneResponse> {
    return this.http.post<ApiResponse<DeliveryZoneResponse>>(this.zoneApiUrl, zone)
      .pipe(
        map(response => response.data)
      );
  }

  updateZone(id: number, zone: CreateZoneDto): Observable<DeliveryZoneResponse> {
    return this.http.put<ApiResponse<DeliveryZoneResponse>>(`${this.zoneApiUrl}/${id}`, zone)
      .pipe(
        map(response => response.data)
      );
  }

  deleteZone(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.zoneApiUrl}/${id}`)
      .pipe(
        map(response => response.data)
      );
  }
}
