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
import { AuthState } from '../shared/services/auth-state';

@Component({
  selector: 'app-play',
  standalone: true,
  imports: [CommonModule, Missile, Ufo],
  templateUrl: './play.html',
  styleUrl: './play.css',
})
export class Play implements AfterViewInit, OnDestroy {

  @ViewChild('snackbar', { static: false }) snackbar!: ElementRef;
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

  showLoginPrompt: boolean = false;
  showTokenExpired: boolean = false;

  private engine!: GameEngine;

  constructor(private router: Router, 
              private scores: Scores, 
              private cdRef: ChangeDetectorRef, 
              private playState: PlayState,
              private authState: AuthState
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

  get auth$() {
    return this.authState.authState$;
  }

  ngAfterViewInit(): void {

    this.saved = false;
    
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
        const pendingDataStr = sessionStorage.getItem("pendingGameRecord");

        if (pendingDataStr) {
          const pendingData = JSON.parse(pendingDataStr);

          this.score = pendingData.score;
          this.timeRemaining = pendingData.time;

          this.prefs.numUFOs = pendingData.ufos;

          this.started = true;
          this.paused = false;
          this.gameEnded = true;
          this.saved = false;

        } else {
          this.started = false;
          this.paused = false;
          this.gameEnded = false;
          this.saved = false;

          this.score = 0;
          this.timeRemaining = this.prefs.gameTime;

          this.startGame();
        }
      }

      GameLoop.start(() => {
        this.cdRef.detectChanges();
      });

      // this.autoSaveScoreIfNeeded();
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
    if (event.code === 'Space' || event.code === 'Spacebar') {
      event.preventDefault();
    }

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

    this.saved = false;
  }

  saveScore() {
    if (this.saved) return;

    const token = sessionStorage.getItem('token');

    if (!token) {
      const pendingData = {
        score: this.score,
        ufos: this.prefs.numUFOs,
        time: this.prefs.gameTime,
        date: Date.now()
      };

      sessionStorage.setItem("pendingGameRecord", JSON.stringify(pendingData));

      this.showLoginPrompt = true;
      return;
    }

    this.scores.saveRecord(this.score, this.prefs.numUFOs, this.prefs.gameTime)
      .subscribe({
        next: (resp) => {
          this.showSnackbar("✔ Score saved successfully!", "success");
          this.saved = true;

          sessionStorage.removeItem("pendingGameRecord");
        },
        error: (err) => {
          if (err.status === 401) {
            this.showTokenExpired = true;
            return;
          }
          this.showSnackbar("✕ Error saving score.", "error");
        }
      });
  }

  goToLogin() {
    this.router.navigate(['/login']/*, { queryParams: { returnUrl: '/play' } }*/);
  }

  closeLoginPrompt() {
    this.showLoginPrompt = false;
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
/*
  private autoSaveScoreIfNeeded(): void {
    const pending = sessionStorage.getItem("pendingSaveScore");
    if (!pending) return;
      
    const token = sessionStorage.getItem("token");
    if (!token) return;

    const dataStr = sessionStorage.getItem("pendingGameRecord");
    if (!dataStr) {
      //console.warn("No pending game data found.");
      sessionStorage.removeItem("pendingSaveScore");
      this.showSnackbar("No pending score to save.", "warning");
      return;
    }
    
    const data = JSON.parse(dataStr);

    this.scores.saveRecord(data.score, data.ufos, data.time).subscribe({
      next: (resp) => {
        this.saved = true;
        //console.log("Auto score saved after login!", resp);
        this.showSnackbar("Score saved successfully!", "success");

        sessionStorage.removeItem("pendingGameRecord");
        sessionStorage.removeItem("pendingSaveScore");
      },
      error: (err) => {
        //console.error("Error auto-saving score:", err);
        this.showSnackbar("Error saving score after login.", "error");
      }
    });
  }
*/

  private showSnackbar(
    message: string, 
    type: "success" | "error" | "warning" | "info" = "success"
  ) {

    if (!this.snackbar) return;
    const sb = this.snackbar.nativeElement;

    sb.classList.remove("success", "error", "warning", "info");
    sb.querySelector(".snackbar-message").textContent = message;

    sb.classList.add(type);
    sb.classList.add("show");

    setTimeout(() => {
        sb.classList.remove("show");
    }, 2500);
  }

}
