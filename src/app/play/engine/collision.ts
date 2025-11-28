export class Collision {

    static missileHitsUfo(missileElement: HTMLElement, ufoElement: HTMLElement): boolean {

        const missileRect = missileElement.getBoundingClientRect();
        const ufoRect = ufoElement.getBoundingClientRect();

        const headHeight = ufoRect.height * 0.8;
        const headTop = ufoRect.top;
        const headBottom = headTop + headHeight;

        const missileY = missileRect.top;
        const missileX = missileRect.left + missileRect.width / 2;

        return (
            missileX >= ufoRect.left &&
            missileX <= ufoRect.right &&
            missileY >= headTop &&
            missileY <= headBottom
        );

    }
    
}