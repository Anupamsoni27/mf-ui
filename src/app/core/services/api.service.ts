import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl || 'http://127.0.0.1:5000';

  constructor(private http: HttpClient) { }

  private formatErrors(error: HttpErrorResponse) {
    console.error('API Error:', error);
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error && error.error.message) {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.error.message}`;
      }
    }
    console.error('Formatted Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  get<T>(endpoint: string, params?: HttpParams): Observable<T> {
    console.log(`Making GET request to: ${this.baseUrl}${endpoint}`, params ? params.toString() : '');
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, { params })
      .pipe(catchError(this.formatErrors));
  }

  post<T>(endpoint: string, body: any): Observable<T> {
    console.log(`Making POST request to: ${this.baseUrl}${endpoint}`, body);
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body)
      .pipe(catchError(this.formatErrors));
  }

  put<T>(endpoint: string, body: any): Observable<T> {
    console.log(`Making PUT request to: ${this.baseUrl}${endpoint}`, body);
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, body)
      .pipe(catchError(this.formatErrors));
  }

  delete<T>(endpoint: string): Observable<T> {
    console.log(`Making DELETE request to: ${this.baseUrl}${endpoint}`);
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`)
      .pipe(catchError(this.formatErrors));
  }
}