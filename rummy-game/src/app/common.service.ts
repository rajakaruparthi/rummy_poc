import { Injectable, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { map, tap } from "rxjs/operators";
import { Rooms } from "./models/rooms.model";
import { ShuffleCardsResponse } from "./models/shuffle-cards-response.model";
import { AddPlayerRequest } from "./models/add-player-request.model";
import { Player } from "./models/player.model";
import { RoomById } from "./models/room-by-id.model";
import { Socket } from "ngx-socket-io";
import { FinalCardsModel } from "./models/final-cards.model";
import { Route } from "@angular/compiler/src/core";
import { Router } from "@angular/router";
import { FinalCardsResponseModel } from "./models/final-cards-resp.model";
import { PlayersAttr } from "./models/final-players-attr";

@Injectable({
  providedIn: "root",
})
export class CommonService implements OnInit {
  ngOnInit() {}

  host = "localhost";
  url = "http://" + this.host + ":8102";
  images: string[] = [];
  cards: string[] = [];
  updatedCards: string[];
  firstThirteen: string[] = [];
  shuffledDeck = [];
  open_card;
  roomsList: Rooms[] = [];
  playersList: Player[] = [];
  gameCreator: Player;
  shuffleCardsUrl = this.url + "/api/shuffle-cards";
  getRoomsUrl = this.url + "/api/get-rooms";
  getRoomById = this.url + "/api/get-room-by-id";
  createRoomUrl = this.url + "/api/create-room";
  addPlayerToRoomUrl = this.url + "/api/update-room";
  deleteRoomUrl = this.url + "/api/delete-room";
  checkIfAdmin = this.url + "/api/is-admin";
  addAdminUser = this.url + "/api/add-user";
  saveFinalCardsUrl = this.url + "/api/save-final-cards";
  pullFinalCardsUrl = this.url + "/api/pull-final-cards";
  finalShowCards = [];
  roomsChanged = new Subject<Rooms[]>();
  playerName: string;
  updatedCardResponse: ShuffleCardsResponse;
  finalCardsResponsebyRoomid;

  constructor(
    private http: HttpClient,
    private socket: Socket,
    private router: Router
  ) {}

  users = this.socket.fromEvent<Player[]>("users");

  setGameCreator(creator: string) {
    this.gameCreator = new Player(creator, false);
  }

  setFinalCards(finalCards) {
    this.finalCardsResponsebyRoomid = finalCards;
  }

  getFinalCards(): FinalCardsResponseModel {
    return this.finalCardsResponsebyRoomid;
  }

  addPlayerToRoom(roomId: string) {
    const player = this.getPlayerName();
    if (player != null) {
      this.socket.emit("addUser", this.getPlayerName());
      const playerName = this.getPlayerName();
      const addPlayerReq = new AddPlayerRequest(roomId, playerName);
      console.log(addPlayerReq);
      this.http
        .post<Rooms>(this.addPlayerToRoomUrl, addPlayerReq)
        .subscribe((data) => {
          this.setPlayersList(data.playersList);
        });
    }
  }

  createRoom(roomName: string, password: string) {
    const room = new Rooms(null, roomName, password, null);
    console.log(room);
    console.log(this.playersList);
    return this.http
      .post(this.createRoomUrl, room, { responseType: "json" })
      .toPromise();
  }

  deleteRoom(index: number, roomId: string) {
    this.socket.emit("deleteRoom", roomId);
    this.roomsList.splice(index, 1);
    this.http.delete(this.deleteRoomUrl + "/" + roomId).subscribe((data) => {
      console.log(data);
    });
    this.roomsChanged.next(this.roomsList.slice());
  }

  saveFinalShow(finalCards: FinalCardsModel[]) {
    const roomid = this.router.url.split("/")[2];
    console.log(finalCards);
    this.http
      .post(this.saveFinalCardsUrl + "/" + roomid, finalCards)
      .subscribe();

    setTimeout(() => {
      this.pullFinalShowCards();
    }, 300);
  }

  pullFinalShowCards(): FinalCardsResponseModel {
    console.log("came in pull final show cards");
    const roomId = this.router.url.split("/")[2];
    const roomById = new RoomById(roomId);
    let finalCardsResponse: FinalCardsResponseModel = null;
    let playersAttr : PlayersAttr[] = [];
    this.http
      .post<FinalCardsResponseModel>(this.pullFinalCardsUrl, roomById)
      .subscribe((data) => {
        console.log(data);
        data.playersAttrsList.forEach(each => {
          playersAttr.push(new PlayersAttr(each.cards, each.folded, each.name));
        });
        
        finalCardsResponse = new FinalCardsResponseModel(
          data.roomId,
          playersAttr
        );
       this.setFinalCards(finalCardsResponse);
      });
      console.log(finalCardsResponse);
    return finalCardsResponse;
  }

  setUpdatedCards(roomId: string) {
    const shuffleCardsReq = { roomId: roomId };
    let response: ShuffleCardsResponse = null;
    this.http
      .post<ShuffleCardsResponse>(this.shuffleCardsUrl, shuffleCardsReq)
      .subscribe((data) => {
        response = new ShuffleCardsResponse(
          data.deck,
          data.openCard,
          data.playersCards,
          data.openJoker
        );
        this.updatedCardResponse = response;
      });
    console.log(this.updatedCardResponse);
    return response;
  }

  getCardsResponse(): ShuffleCardsResponse {
    console.log(this.updatedCardResponse);
    return this.updatedCardResponse;
  }

  setPlayersList(playesList) {
    this.playersList = playesList;
  }

  getPlayerList(): Player[] {
    return this.playersList;
  }

  getPlayersByRoom(roomId) {
    const roomIdObj = new RoomById(roomId);
    this.http.post<Rooms>(this.getRoomById, roomIdObj).subscribe((data) => {
      this.setPlayersList(data.playersList);
    });
    return this.getPlayerList();
  }

  setOpenCard(deck) {
    this.open_card = deck[0];
    deck = deck.slice(1);
    return deck;
  }

  setPlayerName(playerName: string) {
    this.playerName = playerName;
  }

  getPlayerName(): string {
    return this.playerName;
  }

  getOpenCard() {
    return this.open_card;
  }

  getUpdatedCards() {
    return this.cards.slice();
  }

  pullRoomsList() {
    return this.http.get<Rooms[]>(this.getRoomsUrl).subscribe((rooms) => {
      this.setRooms(rooms);
    });
  }

  setRooms(rooms: Rooms[]) {
    console.log(rooms);
    this.roomsList = rooms;
    this.roomsChanged.next(this.roomsList.slice());
  }

  getRooms() {
    return this.roomsList.slice();
  }

  getRandomNums() {
    this.updatedCards = [];
    return this.http.get<number[]>(this.shuffleCardsUrl).pipe().subscribe();
  }

  getTheCards(): Promise<number[]> {
    return this.http
      .get(this.shuffleCardsUrl)
      .toPromise()
      .then((response) => response as number[])
      .catch();
  }

  pushCardToTheCard(card: string) {
    this.cards.push(card);
  }
}
