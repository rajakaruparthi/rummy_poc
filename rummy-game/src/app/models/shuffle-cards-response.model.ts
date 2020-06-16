import { PlayerCardsModel } from "./player-cards.model";

export class ShuffleCardsResponse {
    constructor(public deck: string[], public openCard: string, public playersCards: PlayerCardsModel[], public openJoker: string) {
    }
}
