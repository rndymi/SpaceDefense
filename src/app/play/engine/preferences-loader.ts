export interface GamePreferences {
    numUFOs: number;
    gameTime: number;
}

export class PreferencesLoader {

    static load(): GamePreferences {
        const raw = sessionStorage.getItem("Prefs");

        if (!raw) {
            return { numUFOs: 1, gameTime: 60 };
        }
        
        const parsed = JSON.parse(raw);

        return { 
            numUFOs: parsed.numUFOs ?? 1, 
            gameTime: parsed.gameTime ?? 60
        };
    }

}