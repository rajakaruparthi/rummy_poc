import { Component, OnInit, HostListener } from "@angular/core";
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
import { FinalCardsModel } from "src/app/models/final-cards.model";
import { PlayerIndex } from "@angular/core/src/render3/interfaces/player";
import { PlatformLocation } from "@angular/common";

@Component({
  selector: "app-card-section",
  templateUrl: "./card-section.component.html",
  styleUrls: ["./card-section.component.css"],
})
export class CardSectionComponent implements OnInit {

  shuffleCardsResponse: ShuffleCardsResponse = null;
  foldDisplayFlag = false;
  isGameStarted = false;
  playerName;
  images = [];
  openCard = [];
  playersArray = [];
  openJoker = null;
  deck = [];
  distributeFlag: boolean = false;
  cards = [];
  players: Player[] = [];
  isDisabled = false;
  declaredFlag = false;
  currentPlayerIndex;
  distributeIndex;
  currentPlayer = "";
  winnerIndex: number = null;
  finalShowCards = [];
  winnerPlayerName;
  playerIndex;

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

  declaredFlagEmitter = this.socket
    .fromEvent<boolean>("declaredFlag")
    .subscribe((data) => { this.declaredFlag = data; });

  gameStartedFlagEmitter = this.socket
    .fromEvent<boolean>("gameStarted")
    .subscribe((data) => { this.isGameStarted = data; });

  cardsEmitter = this.socket
    .fromEvent<Player[]>("users")
    .subscribe((data) => { this.players = data; });

  distributeIndexEmitter = this.socket
    .fromEvent<number>("distributeIndex");

  starting = this.socket.fromEvent<string>("startGame");

  winnerIndexEmitter = this.socket.fromEvent<number>("winnerIndex").subscribe(
    data => { this.winnerIndex = data; });

  winnerPlayerNameEmitter = this.socket
    .fromEvent<string>("winnerPlayer")
    .subscribe((data) => { this.winnerPlayerName = data; });

  finalShowCardsEmitter = this.socket.fromEvent<FinalCardsModel[]>("finalShowCards");

  @HostListener('window:popstate', ['$event']) onPopState(event) {
    console.log('Back button pressed');
  };
  player: string;

  playersObs: Observable<Player[]>;

  startFlag: boolean = false;

  constructor(
    private commonService: CommonService,
    private router: Router,
    private socket: Socket, 
    private dialogService: ConfirmDialogService) {
   }

  ngOnInit() {

    window.addEventListener('beforeunload', function (e) {
      const confirmationMessage = '\o/';
      e.returnValue = confirmationMessage;
      return confirmationMessage;
    });
    this.player = this.commonService.getPlayerName();

    if (this.commonService.gameCreator !== undefined &&
      this.commonService.gameCreator.name === this.commonService.getPlayerName()) {
      this.startFlag = true;
    }
   
    this.distributeIndexEmitter.subscribe((data) => {
      this.distributeIndex = data;
    });

    this.playersObs = this.commonService.users;

    this.playersObs.subscribe((data) => {
      this.playersArray = data;

      for (let index = 0; index < data.length; index++) {
        const player = data[index];
        if (player.name === this.player) {
          this.playerIndex = index;
        }
      }
    });
  }

  drop(event: CdkDragDrop<string[]>, cards: string[]) {
    this.cards = cards;
    if (event.previousContainer === event.container) {
      moveItemInArray(cards, event.previousIndex, event.currentIndex);
    } else {
      if (cards.length == 14) {
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

    const playerCards = [];
    playerCards[0] = this.currentPlayerIndex;
    playerCards[1] = this.cards;
    this.socket.emit("updatePlayersCards", playerCards);
  }

  dropOpenCard(event: CdkDragDrop<string[]>) {
    if (this.cards !== undefined && this.cards.length == 14) {
      if (this.openCard.length === 1 &&
        !(event.previousContainer.id === event.container.id)) {
        this.openCard.shift();
      }
      if (!(event.previousContainer.id === event.container.id)) {
        this.socket.emit("changePlayer", this.currentPlayerIndex);
      }
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.socket.emit("updateOpenCard", this.openCard);
    } else if (this.cards !== undefined && this.cards.length == 13) {
      this.cards.push(event.container.data[0]);
      this.openCard.pop();
    } else {
      alert("Size should be 13");
    }

    const playerCards = [];
    playerCards[0] = this.currentPlayerIndex;
    playerCards[1] = this.cards;
    this.socket.emit("updatePlayersCards", playerCards);
  }

  dropDeckTopCard(event: CdkDragDrop<string[]>) {
    if (this.cards !== undefined && this.cards.length < 14) {
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

      const playerCards = [];
      playerCards[0] = this.currentPlayerIndex;
      playerCards[1] = this.cards;
      this.socket.emit("updatePlayersCards", playerCards);
    }
  }

  onFold(playerIndex: number) {
    this.openConfirmationDialogForFold(playerIndex);
  }

  onDeclare(playerIndex: number) {
    this.openConfirmationToDeclare(playerIndex);
  }

  openConfirmationToDeclare(playerIndex: number) {
    this.socket.emit("winnerIndexEmit", playerIndex);

    this.dialogService
      .confirm("Please confirm", "Do you really want to declare .. ?")
      .then((confirmed) => {
        this.winnerIndex = playerIndex;
        this.declaredFlag = true;
        this.socket.emit("showCards", playerIndex);
      })
      .then((conf) => {
        this.finalShowCardsEmitter.subscribe((data) => {
          this.finalShowCards = data;
          this.commonService.setFinalShowCards(this.finalShowCards);
          this.commonService.saveFinalShow();
        });
      })
      .catch(() => {
        console.log("continue playing");
      })
      .finally();
  }

  openConfirmationDialogForFold(playerIndex: number) {
    this.dialogService
      .confirm("Please confirm..", "Do you really want to fold ... ?")
      .then((confirmed) => {
        if (confirmed) {
          this.byPassFoldedHands(playerIndex);
        }
      })
      .catch(() => console.log("Continue"));
  }

  byPassFoldedHands(playerIndex) {
    this.socket.emit("updateIsFoldedFlag", playerIndex);
    this.socket.emit("changePlayer", playerIndex);
  }

  distribute() {
    this.isGameStarted = true;
    const roomId: string = this.router.url.split("/")[2];
    this.commonService.setUpdatedCards(roomId, this.distributeIndex);
    setTimeout(() => {
      this.playerName = this.commonService.playerName;
      this.shuffleCardsResponse = this.commonService.getCardsResponse();
      this.socket.emit("startGame", this.shuffleCardsResponse.playersCards);
      // console.log(this.shuffleCardsResponse.playersCards);
      let response: ShuffleCardsResponse = this.commonService.getCardsResponse();
      this.currentPlayer = response.playersCards[0].name;
      this.playersObs = this.commonService.users;
      this.socket.emit("updateOpenCard", response.openCard);
      this.socket.emit("updateDeck", response.deck);
      this.socket.emit("joker", response.openJoker);
      this.images = response.playersCards[0].cards;
      this.foldDisplayFlag = true;
    }, 500);
  }

  changePlayerActive() {
    this.commonService.users.subscribe((data) => (this.playersArray = data));
    // console.log(this.playersArray);
  }
}
