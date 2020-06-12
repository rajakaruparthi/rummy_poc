import { Component, OnInit } from "@angular/core";
import { CommonService } from "src/app/common.service";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import { Observable } from "rxjs";
import { Rooms } from "src/app/models/rooms.model";
import { Router } from "@angular/router";
import { ShuffleCardsRequest } from "src/app/models/shuffle-cards.model";
import { ShuffleCardsResponse } from "src/app/models/shuffle-cards-response.model";
import { Socket } from "ngx-socket-io";
import { Player } from "src/app/models/player.model";

@Component({
  selector: "app-card-section",
  templateUrl: "./card-section.component.html",
  styleUrls: ["./card-section.component.css"],
})
export class CardSectionComponent implements OnInit {
  shuffleCardsResponse: ShuffleCardsResponse = null;
  playerName;
  images = [];
  openCard = [];
  deck = [];
  distributeFlag: boolean = false;

  playerCardsEmiter = this.socket.fromEvent<string[]>("cards");

  player: string;

  playersObs: Observable<Player[]>;

  starting = this.socket.fromEvent<string>("startGame");

  startFlag: boolean = false;

  constructor(
    private commonService: CommonService,
    private router: Router,
    private socket: Socket
  ) {}

  ngOnInit() {
    if (
      this.commonService.gameCreator !== undefined &&
      this.commonService.gameCreator.name === this.commonService.getPlayerName()
    ) {
      this.startFlag = true;
    }
    this.playersObs = this.commonService.users;
  }

  onStart() {
    this.socket.emit("startGame", "true");
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log(event);
    if (event.previousContainer === event.container) {
      moveItemInArray(this.images, event.previousIndex, event.currentIndex);
    } else {
      if (this.images.length < 14) {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      } else {
        console.log("u can have only 14 cards in hand");
      }
    }
  }

  dropOpenCard(event: CdkDragDrop<string[]>) {
    this.openCard.pop();
    if (this.images.length == 14) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      console.log("you should have 13 cards in hand");
    }
    console.log(this.openCard);
  }

  dropDeckTopCard(event: CdkDragDrop<string[]>) {
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }

  distribute() {
    const roomId: string = this.router.url.split("/")[2];
    this.commonService.setUpdatedCards(roomId);
    this.onStart();
    setTimeout(() => {
      this.distributeFlag = true;
      this.playerName = this.commonService.playerName;
      this.shuffleCardsResponse = this.commonService.getCardsResponse();
      this.shuffleCardsResponse.playersCards.forEach((data) => {
        if (this.playerName === data.name) {
          this.images = data.cards;
          this.socket.emit("startGame", this.images);
        }
      });
      let response: ShuffleCardsResponse = this.commonService.getCardsResponse();
      this.openCard = Array.of(response.openCard);
      this.deck = response.deck;
    }, 500);
  }
}
