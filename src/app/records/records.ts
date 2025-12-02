import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Observable, timer, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Scores } from '../shared/services/scores';
import { AuthState } from '../shared/services/auth-state';

class Score {
  username!: string;
  punctuation!: number;
  ufos!: number;
  disposedTime!: number;
  recordDate!: number;
}

@Component({
  selector: 'app-records',
  standalone: true,
  imports: [CommonModule, DatePipe],
  providers: [DatePipe, AuthState], 
  templateUrl: './records.html',
  styleUrl: './records.css',
})
export class Records implements OnInit {
  scoresList$!: Observable<any[]>;
  userTopScore$!: Observable<any[]>;
  username: string | null = null;

  constructor(private scores: Scores, private datePipe: DatePipe, private authState: AuthState) { }

  ngOnInit(): void {
    //this.scoresList$ = this.scores.getTopScores();
    this.scoresList$ = timer(0, 300000).pipe(
      switchMap(() => {
        return this.scores.getTopScores();
      })
    );

    this.username = this.authState.getUsername();

    if (this.username) {
      this.userTopScore$ = this.scores.getUserTopScores(this.username);
    } else {
      this.userTopScore$ = of([]);
    }
  }

}