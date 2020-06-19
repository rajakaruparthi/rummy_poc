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

@Injectable({
  providedIn: "root",
})
export class CommonService implements OnInit {
  ngOnInit() {}

  images: string[] = [];

  cards: string[] = [];

  updatedCards: string[];

  firstThirteen: string[] = [];

  shuffledDeck = [];

  open_card;

  roomsList: Rooms[] = [];

  playersList: Player[] = [];

  gameCreator: Player;

  shuffleCardsUrl = "http://localhost:8102/api/shuffle-cards";
  getRoomsUrl = "http://localhost:8102/api/get-rooms";
  getRoomById = "http://localhost:8102/api/get-room-by-id";
  createRoomUrl = "http://localhost:8102/api/create-room";
  addPlayerToRoomUrl = "http://localhost:8102/api/update-room";
  deleteRoomUrl = "http://localhost:8102/api/delete-room";
  checkIfAdmin = "http://localhost:8102/api/is-admin";
  addAdminUser = "http://localhost:8102/api/add-user";

  roomsChanged = new Subject<Rooms[]>();
  playerName: string;
  updatedCardResponse: ShuffleCardsResponse;

  constructor(private http: HttpClient, private socket: Socket) {}

  users = this.socket.fromEvent<Player[]>("users");

  setGameCreator(creator: string){
    this.gameCreator = new Player(creator, false);
  }

  addPlayerToRoom(roomId) {
    this.socket.emit("addUser", this.getPlayerName());
    const playerName = this.getPlayerName();
    const addPlayerReq = new AddPlayerRequest(roomId, playerName);
    this.http
      .post<Rooms>(this.addPlayerToRoomUrl, addPlayerReq)
      .subscribe((data) => {
        this.setPlayersList(data.playersList);
      });
  }

  createRoom(roomName: string, password: string) {
    const room = new Rooms(null, roomName, password, this.playersList);
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

  setUpdatedCards(roomId: string) {
    const shuffleCardsReq = { roomId: roomId };
    console.log(roomId);
    let response: ShuffleCardsResponse = null;
    this.http
      .post<ShuffleCardsResponse>(this.shuffleCardsUrl, shuffleCardsReq)
      .subscribe((data) => {

        console.log(data);
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
