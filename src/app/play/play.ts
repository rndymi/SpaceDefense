import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Missile} from './entities/missile/missile';
import { Ufo } from './entities/ufo/ufo';
import { PreferencesLoader, GamePreferences } from './engine/preferences-loader';
import { GameEngine } from './engine/game-engine';
import { GameLoop } from './engine/game-loop';
import { Scores } from '../shared/services/scores'; 

@Component({
  selector: 'app-play',
  standalone: true,
  imports: [CommonModule, Missile, Ufo],
  templateUrl: './play.html',
  styleUrl: './play.css',
})
export class Play implements AfterViewInit {

  @ViewChild('playArea', { static: true }) playArea!: ElementRef<HTMLDivElement>;
  @ViewChild(Missile) missileCmp!: Missile;
  @ViewChildren(Ufo) ufoCmps!: QueryList<Ufo>;

  score: number = 0;
  timeRemaining: number = 60;

  prefs!: GamePreferences;
  ufoIndexes: number[] = [];

  started: boolean = false;
  paused: boolean = false;
  gameEnded: boolean = false;
  saved: boolean = false;

showStartOverlay: boolean = true;

  private engine!: GameEngine;

  constructor(private router: Router, private scores: Scores, private cdRef: ChangeDetectorRef) {
    this.prefs = PreferencesLoader.load();
    this.timeRemaining = this.prefs.gameTime;
    this.ufoIndexes = Array.from({ length: this.prefs.numUFOs }, (_, i) => i);
  }

  ngAfterViewInit(): void {
    
    setTimeout(() => {
      const missileElement = this.missileCmp.getElement();
      const ufos = this.ufoCmps.toArray();

      this.engine = new GameEngine(
        this.playArea.nativeElement,
        missileElement,
        ufos,
        this.prefs,
        (score) => this.score = score,
        (time) => this.timeRemaining = time,
        () => this.handleGameEnd()
      );

      
      GameLoop.start(() => {
        this.cdRef.detectChanges();
      });


    });
  }

  @HostListener('document:keydown', ['$event'])
  handleKey(event: KeyboardEvent) {
    if (!this.engine || !this.started) return;

    if (this.paused || this.gameEnded) return;

    switch (event.code) {
      case 'ArrowLeft':
        this.engine.moveMissileLeft();
        break;
      case 'ArrowRight':
        this.engine.moveMissileRight();
        break;
      case 'Space':
      case 'Spacebar':
        this.engine.fire();
        break;
      case 'Escape':
        this.togglePause();
        break;
    }
  }

  startGame() {
    if (!this.engine || this.started) return;

    this.started = true;
    this.gameEnded = false;
    this.paused = false;
    this.saved = false;

    this.engine.start();
  }


  togglePause() {
    if (this.gameEnded) return;

    if (this.paused) {
      this.resumeGame();
    } else {
      this.pauseGame();
    }
  }

  pauseGame() {
    this.paused = true;
    this.engine?.pause();
  }

  resumeGame() {
    this.paused = false;
    this.engine?.resume();
  }

  abortGame() {
    this.engine?.destroy();
    this.router.navigate(['/home']);
  }

  private handleGameEnd(): void {
    this.gameEnded = true;
    this.paused = false;
  }

  saveScore() {
    if (this.saved) return;

    this.scores.saveRecord(this.score, this.prefs.numUFOs, this.prefs.gameTime)
      .subscribe({
        next: () => {
          //console.log("Score saved!");
          this.saved = true;
        },
        error: (err) => {
          //console.error("Error saving record:", err);
        }
      });
  }

  restartGame() {
  if (!this.engine) {
    return;
  }

  this.started = true;
  this.gameEnded = false;
  this.paused = false;
  this.saved = false;

  this.score = 0;
  this.timeRemaining = this.prefs.gameTime;

  this.engine.destroy();

  this.engine.start();
}


  exitGame() {
    this.router.navigate(['/home']);
  }

}
