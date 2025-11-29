export interface GamePreferences {
    gameTime: number;
    numUFOs: number;
}

export class PreferencesLoader {

    static load(): GamePreferences {
        let prefs: any = {};
        try {
            prefs = JSON.parse(sessionStorage.getItem('preferences') || '{}');
        } catch (e) {
            //console.error('Failed to load game preferences:', e);
            prefs = {};
        }
        
        let gameTime = Number(prefs.gameTime ?? 60);
        let numUFOs = Number(prefs.numUFOs ?? 1);

        if (isNaN(gameTime) || gameTime <= 10) gameTime = 60;
        if (isNaN(numUFOs) || numUFOs < 1) numUFOs = 1;
        
        return { gameTime, numUFOs };
    }

}