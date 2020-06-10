import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Player } from '../models/player.model';
import { Observable } from 'rxjs';
import { CommonService } from '../common.service';

@Injectable({ providedIn: 'root' })
export class ListUsersResolver implements Resolve<Player[]> {
  constructor(private commonService: CommonService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Player[] | Observable<Player[]> | Promise<Player[]> {
    console.log('route --', route.url[1].path);
    const id = route.url[1].path;
    let players = this.commonService.getPlayersByRoom(id);
    if (players != null && players.length === 0) {
      players = this.commonService.getPlayersByRoom(id);
    }
    return players;
  }
}
