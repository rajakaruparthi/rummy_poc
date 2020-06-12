import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { Rooms } from '../models/rooms.model';
import { Player } from '../models/player.model';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ShuffleCardsResponse } from '../models/shuffle-cards-response.model';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-players-room-list',
  templateUrl: './players-room-list.component.html',
  styleUrls: ['./players-room-list.component.css']
})
export class PlayersRoomListComponent implements OnInit {

  player: string;
  
  playersObs: Observable<Player[]>;

  shuffleCardsResponse: ShuffleCardsResponse = null;

  starting = this.socket.fromEvent<string>('startGame');

  startFlag: boolean = false;

  constructor(private commonService: CommonService, private router: Router, private socket: Socket) { }

  ngOnInit() {
    if(this.commonService.gameCreator !== undefined && this.commonService.gameCreator.name === this.commonService.getPlayerName()) {
        this.startFlag = true;
    }
    this.playersObs = this.commonService.users;
  }

  assignCards() {
    const roomId: string = this.router.url.split('/')[2];
    this.commonService.setUpdatedCards(roomId);
    this.onStart();
  }

  onStart() {
    this.socket.emit('startGame', 'true')
    console.log(this.starting);
  }

}
