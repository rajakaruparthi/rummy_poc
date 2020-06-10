export class ShuffleCardsResponse {
    constructor(public deck: string[], public openCard: string, public playersCards:  {string: string[]}) {
    }
}
