import { Service } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class Routing {
  constructor(private http: HttpClient) {}

  getRoute(startLat: number, startLng: number, endLat: number, endLng: number): Observable<any> {
    // IMPORTANTE: OSRM recibe los parámetros en orden (Longitud,Latitud)
    const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
    return this.http.get(url);
  }
}
