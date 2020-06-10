import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import { CommonService } from '../common.service';
import { Rooms } from '../models/rooms.model';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-list-rooms',
  templateUrl: './list-rooms.component.html',
  styleUrls: ['./list-rooms.component.css'],
})
export class ListRoomsComponent implements OnInit, OnDestroy {
  roomsList: Rooms[];
  subscription: Subscription;
  roomsChanged = new Subject<Rooms[]>();
  constructor(private commonService: CommonService) {}

  ngOnInit() {

    window.addEventListener('beforeunload', function (e) {
      const confirmationMessage = '\o/';
      console.log('cond');
      e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
      return confirmationMessage;              // Gecko, WebKit, Chrome <34
    });
    this.roomsList = this.commonService.getRooms();
    this.subscription = this.commonService.roomsChanged
      .subscribe(
        (rooms: Rooms[]) => {
          this.roomsList = rooms;
        }
      );
    console.log('logged in as', this.commonService.getPlayerName());
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
