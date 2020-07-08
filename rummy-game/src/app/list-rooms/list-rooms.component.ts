import { Component, OnInit, OnDestroy } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { CommonService } from "../common.service";
import { Rooms } from "../models/rooms.model";
import { Subject, Subscription } from "rxjs";

@Component({
  selector: "app-list-rooms",
  templateUrl: "./list-rooms.component.html",
  styleUrls: ["./list-rooms.component.css"],
})
export class ListRoomsComponent implements OnInit, OnDestroy {
  roomsList: Rooms[];
  subscription: Subscription;
  playerName: string;
  gameStartedFlag = false;
  roomsChanged = new Subject<Rooms[]>();
  gameStartedEmitter = this.socket
    .fromEvent<boolean>("gameStarted")
    .subscribe((data) => (this.gameStartedFlag = data));
  constructor(private commonService: CommonService, private socket: Socket) {}

  ngOnInit() {
    window.addEventListener('beforeunload', function (e) {
      const confirmationMessage = '\o/';
      e.returnValue = confirmationMessage;
      return confirmationMessage;
    });

    

    this.roomsList = this.commonService.getRooms();
    this.subscription = this.commonService.roomsChanged.subscribe(
      (rooms: Rooms[]) => {
        this.roomsList = rooms;
      }
    );
    this.playerName = this.commonService.getPlayerName();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  deleteRoom(index: number, roomId: string) {
    this.commonService.deleteRoom(index, roomId);
  }

  onRefresh() {
    setTimeout(() => {
      this.commonService.pullRoomsList();
      this.roomsList = this.commonService.getRooms();
      this.roomsChanged.next(this.roomsList.slice());
    }, 100);
  }

  enterToRoom(roomId: string) {
    this.commonService.addPlayerToRoom(roomId);
  }
}
