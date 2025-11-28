import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_URL } from '../constants/constants';


@Injectable({
  providedIn: 'root',
})
export class Scores {
  constructor(private http: HttpClient) {  }

  getTopScores(): Observable<any> {
    return this.http.get(BASE_URL + 'records');
  }

  saveRecord(score: number, ufos: number, time: number): Observable<any> {
    const token = sessionStorage.getItem('token') || '';

    const headers = new HttpHeaders({
      'Authorization': token
    });

    return this.http.post(
      BASE_URL + 'records',
      {
        punctuation: score,
        ufos: ufos,
        disposedTime: time
      },
      {
        headers,
        observe: 'response'
      }
    );
  }

}
