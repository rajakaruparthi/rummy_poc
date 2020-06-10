import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { Rooms } from '../models/rooms.model';
import { Player } from '../models/player.model';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-players-room-list',
  templateUrl: './players-room-list.component.html',
  styleUrls: ['./players-room-list.component.css']
})
export class PlayersRoomListComponent implements OnInit {

  players: Player[] = [];
  playersObs: Observable<Player[]>;


  constructor(private commonService: CommonService, private router: Router) { }

  ngOnInit() {
    this.playersObs = this.commonService.users;
  }

  // onRefresh() {
  //   const roomId = (this.router.url.split('/')[2]);
  //   this.players = this.commonService.getPlayersByRoom(roomId);
  // }
}
