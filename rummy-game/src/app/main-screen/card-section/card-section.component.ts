import { Component, OnInit } from "@angular/core";
import { CommonService } from "src/app/common.service";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { ShuffleCardsResponse } from "src/app/models/shuffle-cards-response.model";
import { Socket } from "ngx-socket-io";
import { Player } from "src/app/models/player.model";
import { PlayerCardsModel } from "src/app/models/player-cards.model";
import { ConfirmDialogService } from "src/app/confirm-dialog.service";

@Component({
  selector: "app-card-section",
  templateUrl: "./card-section.component.html",
  styleUrls: ["./card-section.component.css"],
})
export class CardSectionComponent implements OnInit {
  shuffleCardsResponse: ShuffleCardsResponse = null;
  foldDisplayFlag = false;
  playerName;
  images = [];
  openCard = [];
  playersArray = [];
  openJoker = null;
  deck = [];
  distributeFlag: boolean = false;
  cards;
  isDisabled = false;

  currentPlayerIndex = 0;
  currentPlayer = "";

  playerCardsEmiter = this.socket.fromEvent<PlayerCardsModel[]>("cards");

  openCardEmitter = this.socket
    .fromEvent<string[]>("openCardEmitter")
    .subscribe((data) => (this.openCard = data));

  deckEmitter = this.socket
    .fromEvent<string[]>("deckEmitter")
    .subscribe((data) => (this.deck = data));

  jokerEmitter = this.socket
    .fromEvent<string>("jokerEmitter")
    .subscribe((data) => (this.openJoker = data));

  currentPlayerIndexEmitter = this.socket
    .fromEvent<number>("currentIndex")
    .subscribe((data) => (this.currentPlayerIndex = data));

  currentPlayerEmitter = this.socket
    .fromEvent<Player>("currentPlayer")
    .subscribe((data) => (this.currentPlayer = data.name));

  player: string;

  playersObs: Observable<Player[]>;

  starting = this.socket.fromEvent<string>("startGame");

  startFlag: boolean = false;

  constructor(
    private commonService: CommonService,
    private router: Router,
    private socket: Socket,
    private dialogService: ConfirmDialogService
  ) {}

  ngOnInit() {
    this.player = this.commonService.getPlayerName();
    if (
      this.commonService.gameCreator !== undefined &&
      this.commonService.gameCreator.name === this.commonService.getPlayerName()
    ) {
      this.startFlag = true;
    }
    this.playersObs = this.commonService.users;
    this.playersObs.subscribe((data) => {
      this.playersArray = data;
    });
  }

  drop(event: CdkDragDrop<string[]>, cards) {
    this.cards = cards;
    if (event.previousContainer === event.container) {
      moveItemInArray(cards, event.previousIndex, event.currentIndex);
    }
     else {
      // if (cards.length < 14) {
      //   transferArrayItem(
      //     event.previousContainer.data,
      //     event.container.data,
      //     event.previousIndex,
      //     event.currentIndex
      //   );
      // } else {
      //   console.log("u can have only 14 cards in hand");
      // }
    }
  }

  dropOpenCard(event: CdkDragDrop<string[]>) {
    console.log(event);
    if (this.cards.length == 14) {
      console.log("this.currentPlayerIndex --- " + this.currentPlayerIndex);
      console.log("came in if");
      this.socket.emit("changePlayer", this.currentPlayerIndex);

      if (this.openCard.length === 1) {
        this.openCard.shift();
      }
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.socket.emit("updateOpenCard", this.openCard);
      console.log(this.openCard);
    } else if (this.cards.length == 13) {
      console.log("came in else if");
      this.cards.push(event.container.data[0]);
      this.openCard.pop();
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      console.log(this.openCard);
    } else {
      alert("Size should be 13");
    }
  }

  dropDeckTopCard(event: CdkDragDrop<string[]>) {
    console.log("came in deck drop");
    console.log(event);
    console.log(this.cards);
    if (this.cards.length < 14) {
      this.cards.push(event.container.data[0]);
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.isDisabled = false;
      this.deck.shift();
      this.socket.emit("updateDeck", this.deck);
      // console.log(this.deck);
    }
  }

  onFold(playerIndex: number) {
    this.openConfirmationDialog(playerIndex);
  }

  public openConfirmationDialog(playerIndex: number) {
    this.dialogService
      .confirm("Please confirm..", "Do you really want to fold ... ?")
      .then((confirmed) => console.log("User confirmed:", confirmed))
      .catch(() =>
        console.log("Continue")
      );
  }

  distribute() {
    const roomId: string = this.router.url.split("/")[2];
    this.commonService.setUpdatedCards(roomId);
    setTimeout(() => {
      this.playerName = this.commonService.playerName;
      this.shuffleCardsResponse = this.commonService.getCardsResponse();
      this.socket.emit("startGame", this.shuffleCardsResponse.playersCards);
      let response: ShuffleCardsResponse = this.commonService.getCardsResponse();
      this.currentPlayer = response.playersCards[0].name;
      this.socket.emit("updateOpenCard", response.openCard);
      this.socket.emit("updateDeck", response.deck);
      this.socket.emit("joker", response.openJoker);
      this.images = response.playersCards[0].cards;
      this.foldDisplayFlag = true;
    }, 500);
  }

  changePlayerActive() {
    this.commonService.users.subscribe((data) => (this.playersArray = data));
    console.log(this.playersArray);
  }
}
