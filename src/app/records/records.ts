import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Observable, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Scores } from '../shared/services/scores';

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
  providers: [DatePipe], 
  templateUrl: './records.html',
  styleUrl: './records.css',
})
export class Records implements OnInit {
  scoresList$!: Observable<any[]>;

  constructor(private scores: Scores, private datePipe: DatePipe) { }

  ngOnInit(): void {
    //this.scoresList$ = this.scores.getTopScores();
    this.scoresList$ = timer(0, 300000).pipe(
      switchMap(() => {
        return this.scores.getTopScores();
      })
    );
  }

}