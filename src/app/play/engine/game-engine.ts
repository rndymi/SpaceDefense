import { GamePreferences } from "./preferences-loader";
import { Collision } from "./collision";
import { Missile } from "../entities/missile/missile";
import { Ufo } from "../entities/ufo/ufo";


export class GameEngine {

  private readonly MARGIN = 8;

  private score = 0;
  private timeRemaining = 60;

  private ufoIntervalId: number | null = null;
  private missileIntervalId: number | null = null;
  private timerIntervalId: number | null = null;

  private missileLaunched = false;

  private initialMissileLeft: string = "";
private initialMissileBottom: string = "";
private missileInitialPositionCaptured = false;


  constructor(
      private playAreaElement: HTMLElement,
      private missileElement: HTMLElement,
      private ufo: Ufo[],
      private prefs: GamePreferences,
      private onScoreChange: (newScore: number) => void,
      private onTimeChange: (newTime: number) => void,
      private onGameEnd: () => void
  ) {
      this.timeRemaining = prefs.gameTime;

      if (!this.missileInitialPositionCaptured) {
        this.initialMissileLeft = this.missileElement.style.left || "0px";
        this.initialMissileBottom = this.missileElement.style.bottom || "5px";
        this.missileInitialPositionCaptured = true;
      }

      this.notifyScore();
      this.notifyTime();
  }

  restoreState(state: any): void {
    this.score = state.score;
    this.timeRemaining = state.timeRemaining;

    this.notifyScore();
    this.notifyTime();

    this.missileLaunched = state.missile.launched;
  }

  resetForNewGame(): void {
    this.score = 0;
    this.timeRemaining = this.prefs.gameTime;
    this.missileLaunched = false;

    this.notifyScore();
    this.notifyTime();

    this.resetMissileFull();  
  }

  resetGame(): void {
    this.score = 0;
    this.timeRemaining = this.prefs.gameTime;
    this.missileLaunched = false;

    this.notifyScore();
    this.notifyTime();
  }

  start(): void {
    this.startTimer(true);
    this.startUfoMovement();
  }

  moveMissileLeft(): void {
    if (this.missileLaunched) return;

    const missile = this.missileElement;
    const step = 5;
    let left = parseInt(missile.style.left || '0', 10);

    if (left > 0) {
      left -= step;
      missile.style.left = left + 'px';
    }
  }

  moveMissileRight(): void {
    if (this.missileLaunched) return;

    const missile = this.missileElement;
    const step = 5;
    const areaWidth = this.playAreaElement.clientWidth;
    const missileWidth = missile.clientWidth || 60;

    let left = parseInt(missile.style.left || '0', 10);

    if (left + missileWidth + this.MARGIN < areaWidth) {
      left += step;
      missile.style.left = left + 'px';
    }
  }

  fire(): void {
    if (this.missileLaunched) return;
    this.missileLaunched = true;

    this.missileIntervalId = window.setInterval(() => this.updateMissile(), 10);
  }

  destroy(): void {
    if (this.ufoIntervalId) clearInterval(this.ufoIntervalId);
    if (this.missileIntervalId) clearInterval(this.missileIntervalId);
    if (this.timerIntervalId) clearInterval(this.timerIntervalId);
  }

  private startTimer(reset: boolean = true): void {
    if (this.timerIntervalId) clearInterval(this.timerIntervalId);

    if (reset) {
      this.timeRemaining = this.prefs.gameTime;
      this.notifyTime();
    }

    this.timerIntervalId = window.setInterval(() => {
      this.timeRemaining--;
      this.notifyTime();

      if (this.timeRemaining <= 0) {
        this.timeRemaining = 0;
        this.notifyTime();
        this.endGame();
      }

    }, 1000);
  }

  private notifyScore(): void {
    this.onScoreChange(this.score);
  }

  private notifyTime(): void {
    this.onTimeChange(this.timeRemaining);
  }

  private endGame(): void {
    this.destroy();
    this.onGameEnd();
  }

  private startUfoMovement(): void {
    if (this.ufoIntervalId) clearInterval(this.ufoIntervalId);

    this.ufoIntervalId = window.setInterval(() => {
      this.updateUfos();
    }, 25);
  }

  private updateUfos(): void {
    const areaWidth = this.playAreaElement.clientWidth;

    this.ufo.forEach((ufoCmp: Ufo) => {
      const ufoElement = ufoCmp.getElement();
      const width = ufoElement.clientWidth || 80;

      let step = Number(ufoElement.dataset['step'] ?? 0);
      if (!step) {
        step = (Math.random() < 0.5 ? -1 : 1) * (6 + Math.random() * 6);
      }

      let left = parseInt(ufoElement.style.left || '0', 10);

      if (left + width + this.MARGIN > areaWidth || left < 0) {
        step = -step;
      }

      left += step;
      ufoElement.style.left = left + 'px';
      ufoElement.dataset['step'] = String(step);
    });
  }

  private updateMissile(): void {
    const missile = this.missileElement;
    const areaHeight = this.playAreaElement.clientHeight;
    const vstep = 5;

    let bottom = parseInt(missile.style.bottom || '0', 10);

    const hitIndex = this.checkHit();
    if (hitIndex !== -1) {
      this.handleHit(hitIndex);
      this.resetMissileVertical();
      return;
    }

    if (bottom > areaHeight) {
      this.score -= 50;
      this.notifyScore();
      this.resetMissileVertical();
      return;
    }

    bottom += vstep;
    missile.style.bottom = bottom + 'px';
  }

  private resetMissileVertical(): void {
    if (this.missileIntervalId) {
      clearInterval(this.missileIntervalId);
      this.missileIntervalId = null;
    }
    this.missileLaunched = false;

    this.missileElement.style.bottom = '5px';
  }

  private resetMissileFull(): void {
    if (this.missileIntervalId) {
      clearInterval(this.missileIntervalId);
      this.missileIntervalId = null;
    }

    this.missileLaunched = false;

    this.missileElement.style.left = this.initialMissileLeft;
    this.missileElement.style.bottom = this.initialMissileBottom;
  }


  private checkHit(): number {
    const missile = this.missileElement;

    for (let i = 0; i < this.ufo.length; i++) {
      const ufoElement = this.ufo[i].getElement();

      if (Collision.missileHitsUfo(missile, ufoElement)) {
        return i;
      }
    }
    return -1;
  }

  private handleHit(index: number): void {
    this.score += 100;
    this.notifyScore();

    const ufoCmp = this.ufo[index];
    ufoCmp.playExplosion();
  }

  pause() {
    if (this.ufoIntervalId) {
      clearInterval(this.ufoIntervalId);
      this.ufoIntervalId = null;
    }

    if (this.missileIntervalId) {
      clearInterval(this.missileIntervalId);
      this.missileIntervalId = null;
    }

    if (this.timerIntervalId) {
      clearInterval(this.timerIntervalId);
      this.timerIntervalId = null;
    }
  }

  resume(): void {
    if (!this.timerIntervalId) {
      this.timerIntervalId = window.setInterval(() => {
        this.timeRemaining--;
        this.notifyTime();
        if (this.timeRemaining <= 0) {
          this.timeRemaining = 0;
          this.notifyTime();
          this.endGame();
        }
      }, 1000);
    }

    if (!this.ufoIntervalId) {
      this.startUfoMovement();
    }

    if (this.missileLaunched && !this.missileIntervalId) {
      this.missileIntervalId = window.setInterval(
        () => this.updateMissile(),
        10
      );
    }
  }

}