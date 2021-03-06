import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { Observable, Subject } from 'rxjs';
import { Player } from '../models/player.model';
import { Socket } from "ngx-socket-io";
import { ConfirmDialogService } from '../confirm-dialog.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-players-list',
  templateUrl: './players-list.component.html',
  styleUrls: ['./players-list.component.css']
})
export class PlayersListComponent implements OnInit {

  usersObservable: Observable<Player[]>;
  users = [];
  usersChanged: Subject<Player[]> = null;
  playerReadyNameArray = [];


  playerReadyNameEmitter = this.socket
    .fromEvent<string[]>("playerReadyNameArray")
    .subscribe((data) => { 
      this.playerReadyNameArray = data; 
  });

  constructor(private commonService: CommonService, 
    private router: Router,
    private dialogService: ConfirmDialogService, 
    private socket: Socket, private route: ActivatedRoute) { }

  ngOnInit() {
    window.addEventListener('beforeunload', function (e) {
      const confirmationMessage = '\o/';
      e.returnValue = confirmationMessage;
      return confirmationMessage;
    });
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
      .confirm("Please confirm", "Do you really want to remove .. ?")
      .then((confirmed) => {
        console.log("came in " + playerIndex);
        this.users.splice(playerIndex, 1);
        this.socket.emit("deletePlayerIndex", playerIndex);
        let promise = this.commonService.deletePlayer(roomId, playerIndex);
        promise.then(data => {
        }).then(x =>{
          this.socket.emit("deletePlayer", roomId);
        });
      })
      .catch(() => {
        console.log("player is still playing");
      });
  }

  onRefresh(){
    let roomId = this.router.url.split('/')[2];
    this.socket.emit("refreshUsers", roomId);
    this.usersObservable = this.commonService.users;
  }

  startOver() {
    this.router.navigate(['/guest'], { relativeTo: this.route});
  }
}
