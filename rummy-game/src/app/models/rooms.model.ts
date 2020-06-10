import { Player } from './player.model';

export class Rooms {
    constructor(public id: string,
        public roomname: string,
        public password: string,
        public playersList: Player[]) {
    }
}


