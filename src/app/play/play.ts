import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, HostListener, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Missile} from './entities/missile/missile';
import { Ufo } from './entities/ufo/ufo';
import { PreferencesLoader, GamePreferences } from './engine/preferences-loader';
import { GameEngine } from './engine/game-engine';
import { GameLoop } from './engine/game-loop';
import { Scores } from '../shared/services/scores'; 
import { PlayState } from '../shared/services/play-state';

@Component({
  selector: 'app-play',
  standalone: true,
  imports: [CommonModule, Missile, Ufo],
  templateUrl: './play.html',
  styleUrl: './play.css',
})
export class Play implements AfterViewInit, OnDestroy {

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

  showStartOverlay: boolean = false;

  private engine!: GameEngine;

  constructor(private router: Router, 
              private scores: Scores, 
              private cdRef: ChangeDetectorRef, 
              private playState: PlayState
            ) {
    this.prefs = PreferencesLoader.load();
    this.timeRemaining = this.prefs.gameTime;
    this.ufoIndexes = Array.from({ length: this.prefs.numUFOs }, (_, i) => i);

    if (this.playState.existSaveState && this.playState.load()) {
      this.started = true;
      this.paused = true;
      this.gameEnded = false;
    } else {
      this.started = false;
      this.paused = false;
      this.gameEnded = false;
    }
  }

  ngAfterViewInit(): void {
    
    setTimeout(() => {
      const missileElement = this.missileCmp.getElement();
      const ufos = this.ufoCmps.toArray();

      const areaWidth = this.playArea.nativeElement.clientWidth;

      ufos.forEach((ufo, i) => {
        const el = ufo.getElement();
        const randomX = Math.floor(Math.random() * (areaWidth - 80));
        el.style.left = `${randomX}px`;
        el.style.top = `${50 + i * 70}px`;
      });

      this.engine = new GameEngine(
        this.playArea.nativeElement,
        missileElement,
        ufos,
        this.prefs,
        (score) => this.score = score,
        (time) => this.timeRemaining = time,
        () => this.handleGameEnd()
      );

      const saved = this.playState.load(true);

      if (saved) {
        this.started = true;
        this.paused = true;
        this.showStartOverlay = false;

        this.score = saved.score;
        this.timeRemaining = saved.timeRemaining;

        saved.ufoPositions.forEach((data: any, i: number) => {
          const el = ufos[i].getElement();
          el.style.left = data.left;
          el.dataset['step'] = data.step;
        });

        const missile = missileElement;
        missile.style.left = saved.missile.left;
        missile.style.bottom = saved.missile.bottom;

        this.engine.restoreState(saved);
      } else {
        this.started = false;
        this.paused = false;
        this.gameEnded = false;
        this.saved = false;

        this.score = 0;
        this.timeRemaining = this.prefs.gameTime;

        this.startGame();
      }
      
      GameLoop.start(() => {
        this.cdRef.detectChanges();
      });

    });
  }

  ngOnDestroy(): void {

    GameLoop.stop();
    
    if (this.engine && this.started && !this.gameEnded) {

      this.engine.pause();

      this.playState.save({
        score: this.score,
        timeRemaining: this.timeRemaining,

        ufoPositions: this.ufoCmps.toArray().map((u) => ({
          left: u.getElement().style.left,
          step: u.getElement().dataset['step']
        })),

        missile: {
          left: this.missileCmp.getElement().style.left,
          bottom: this.missileCmp.getElement().style.bottom,
          launched: this.engine['missileLaunched']
        }
      });
    }
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
    this.playState.clear();

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
    this.playState.clear();
    this.engine?.resume();
  }

  abortGame() {
    this.engine?.destroy();
    this.playState.clear();

    this.started = true;
    this.paused = false;
    this.gameEnded = false;
    this.saved = false;

    //this.showStartOverlay = false;

    this.score = 0;
    this.timeRemaining = this.prefs.gameTime;

    this.engine.resetForNewGame();
    this.engine.start();
    //this.router.navigate(['/home']);
  }

  private handleGameEnd(): void {
    this.gameEnded = true;
    this.paused = false;
    this.playState.clear();
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
    this.playState.clear();

    this.engine.destroy();

    this.engine.resetForNewGame();

    this.engine.start();
  }

  exitGame() {
    this.playState.clear();
    this.router.navigate(['/home']);
  }

}
