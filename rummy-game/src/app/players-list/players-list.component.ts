import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { Observable, Subject } from 'rxjs';
import { Player } from '../models/player.model';
import { Socket } from "ngx-socket-io";
import { ConfirmDialogService } from '../confirm-dialog.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-players-list',
  templateUrl: './players-list.component.html',
  styleUrls: ['./players-list.component.css']
})
export class PlayersListComponent implements OnInit {

  usersObservable: Observable<Player[]>;
  users = [];
  usersChanged: Subject<Player[]> = null;

  constructor(private commonService: CommonService, 
    private router: Router,
    private dialogService: ConfirmDialogService, 
    private socket: Socket) { }

  ngOnInit() {
    let roomId = this.router.url.split('/')[2];
    let obj = {"roomId": roomId};
    this.usersObservable = this.commonService.users;
    this.socket.emit("updateUsers", obj);
    this.usersObservable.subscribe(data => {
      this.users = data;
    });
  }

  deletePlayer(playerIndex: number) {
    this.openConfirmationToDeclare(playerIndex);
  }

  openConfirmationToDeclare(playerIndex: number) {
    let roomId = this.router.url.split('/')[2];
    console.log(roomId);
    this.dialogService
      .confirm("Please confirm", "Do you really want to declare .. ?")
      .then((confirmed) => {
        console.log("came in " + playerIndex);
        this.users.splice(playerIndex, 1);
        let promise = this.commonService.deletePlayer(roomId, playerIndex);
        promise.then(data => {
          console.log(data);
        }).then(x =>{
          this.socket.emit("deletePlayer", roomId);
        });
      })
      .catch(() => {
        console.log("continue playing");
      });
  }

  onRefresh(){
    this.usersObservable = this.commonService.users;
  }
}
