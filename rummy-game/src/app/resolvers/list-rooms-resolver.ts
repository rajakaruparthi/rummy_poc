import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Rooms } from '../models/rooms.model';
import { CommonService } from '../common.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ListRoomsResolver implements Resolve<Rooms[]> {
  constructor(private commonService: CommonService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Rooms[] | Observable<Rooms[]> | Promise<Rooms[]> {
    const rooms = this.commonService.getRooms();
    if (rooms.length === 0) {
      this.commonService.pullRoomsList();
    } else {
      return rooms;
    }
  }
}
