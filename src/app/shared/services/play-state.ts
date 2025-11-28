import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PlayState {
  
  public existSaveState = false;

  public savedState: any = null;

  save(state: any): void {
    this.savedState = JSON.parse(JSON.stringify(state));
    this.existSaveState = true;
  }

  load() {
    return this.savedState;
  }

  clear() {
    this.savedState = null;
    this.existSaveState = false;
  }

}
