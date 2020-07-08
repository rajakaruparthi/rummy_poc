import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Observable } from 'rxjs';
import { Player } from '../models/player.model';
import { FinalCardsResponseModel } from '../models/final-cards-resp.model';
import { PlayersAttr } from '../models/final-players-attr';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import { Socket } from "ngx-socket-io";

@Component({
  selector: 'app-view-final-cards',
  templateUrl: './view-final-cards.component.html',
  styleUrls: ['./view-final-cards.component.css']
})
export class ViewFinalCardsComponent implements OnInit {

  finalCardsResponseObs: Observable<FinalCardsResponseModel>;
  finalCardsResponse: FinalCardsResponseModel;
  users = [];
  cards;
  currentPlayerIndex;
  startIndex ;
  playersAttr: FinalCardsResponseModel = null;
  playersObj: Observable<Player[]>;

  
  startIndexEmitter = this.socket
  .fromEvent<number>("startIndex")
  .subscribe((data) => (this.startIndex = data));

  currentPlayerIndexEmitter = this.socket
  .fromEvent<number>("currentIndex")
  .subscribe((data) => (this.currentPlayerIndex = data));

  constructor(private commonService: CommonService, private router: Router, private socket: Socket, private route: ActivatedRoute) { }

  ngOnInit() {
    window.addEventListener('beforeunload', function (e) {
      const confirmationMessage = '\o/';
      e.returnValue = confirmationMessage;
      return confirmationMessage;
    });

    setTimeout(() => {
      this.playersAttr = this.commonService.pullFinalShowCards();
    }, 300);
  }

  drop(event: CdkDragDrop<string[]>, cards: string[]) {
    this.cards = cards;
    moveItemInArray(cards, event.previousIndex, event.currentIndex);
  }

  onRefresh() {
    this.playersAttr = this.commonService.getFinalCards();
  }

  onContinuePlaying() {
    this.socket.emit("readyForNextGame", this.commonService.getPlayerName());
    this.socket.emit("continuePlaying", "continue");
    this.commonService.setFinalCards(null);
    this.router.navigate(['../'], { relativeTo: this.route});
  }

  onManagePlayers() {
    let ary = this.router.url.split('/');
  }
}
