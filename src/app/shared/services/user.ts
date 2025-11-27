import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BASE_URL } from '../constants/constants';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class User {
  
  constructor(private http: HttpClient) { }

  userLogin(user: string, passwd: string): Observable<any> {
    const url = BASE_URL + 'users/login';

    return this.http.get(url, {
      observe: 'response',
      params: {
        username: user,
        password: passwd,
      }
    }).pipe(
      map((resp: HttpResponse<any>) => {
        const token = resp.headers.get('Authorization');
        if (!token) {
          throw new Error('No token in response');
        }
        return token;
      })
    );
  }
}
