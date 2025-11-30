import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BASE_URL } from '../constants/constants';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class User {
  
  constructor(private http: HttpClient) { }

  registerUser(username: string, email: string, password: string): Observable<any> {
    const url = BASE_URL + 'users';

    const body = {
      username: username,
      email: email,
      password: password
    };

    return this.http.post(url, body, { observe: 'response' }).pipe(
      map((resp) => {
        //console.log("User registered successfully:", resp);
        return resp.body;
      }),
      catchError((err: HttpErrorResponse) => {
        //console.error("Register error response:", err);
        let msg = 'An unknown error occurred!';
        
        if (err.status === 409) {
          //console.log("User already exists");
          msg = 'User already exists.';
        } else if (err.status === 400) {
          msg = 'Invalid user data provided.';
        } else if (err.status === 500) {
          msg = 'Server error. Please try again later.';
        }
        return throwError(() => msg);
      })
    );
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
