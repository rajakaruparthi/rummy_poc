import { PlayersAttr } from './final-players-attr';

export class FinalCardsResponseModel{ 
    constructor(public roomId: string, public playersAttrsList: PlayersAttr[], public date: Date) {

    }
}