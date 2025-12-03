import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse, HttpParams } from '@angular/common/http';
import { BASE_URL } from '../constants/constants';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class User {
  
  constructor(private http: HttpClient) { }

  checkUserExists(username: string) {
    const url = BASE_URL + 'users/';
    return this.http.get(url + username, { observe: 'response' });
  }

  registerUser(username: string, email: string, password: string): Observable<HttpResponse<any>> {
    const url = BASE_URL + 'users';

    const body = new HttpParams()
    .set('username', username)
    .set('email', email)
    .set('password', password);

    return this.http.post(url, body.toString(), {
      observe: 'response',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }

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
        //console.log(token);
        if (!token) {
          throw new Error('No token in response');
        }
        return token;
      })
    );
  }
}
