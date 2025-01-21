import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManagementService {

  private apiUrl = 'http://localhost:8080/api/administration/management';

  constructor(private http: HttpClient) {}

  getPeople(token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get(`${this.apiUrl}/people/${token}`, { headers });
  }

  deletePerson(token: string, identification: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const body = { token, identification };
    return this.http.delete(`${this.apiUrl}/person`, { headers, body });
  }

  updatePerson(identification: string, payload: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.patch(`${this.apiUrl}/person/${identification}`, payload, { headers });
  }

  uploadImage(file: File, photo_image_id: string, token: string): Observable<any> {
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('id', photo_image_id);
    formData.append('token', token);
    return this.http.patch(`${this.apiUrl}/image`, formData);
  }
}
