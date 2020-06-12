import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Player } from '../models/player.model';

@Component({
  selector: 'app-users-change',
  templateUrl: './users-change.component.html',
  styleUrls: ['./users-change.component.css']
})
export class UsersChangeComponent implements OnInit {

  playersObs: Observable<Player[]>;
  player: any;

  constructor(private commonService: CommonService, private router: Router) { }

  ngOnInit() {
    const roomId = this.router.url.split('/')[2];
    this.commonService.getPlayersByRoom(roomId);
    this.playersObs = this.commonService.users;
    this.player = this.commonService.playerName;
  }

}
