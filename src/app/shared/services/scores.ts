import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

}
