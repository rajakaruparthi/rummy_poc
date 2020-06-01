import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonService {

  images: string[] = [];

  clubs: number[] = [];

  diamonds: number[] = [];

  hearts: number[] = [];

  spades: number[] = [];

  cards: string[] = [];

  updatedCards: string[];

  firstThirteen: string[] = [];

  shuffledDeck = [];

  open_card;

  getUrl = 'http://localhost:8080/api/shuffle-cards';

  constructor(private http: HttpClient) {}

  setUpdatedCards(updatedCards: string[]) {
    this.cards = updatedCards;
  }

  setOpenCard(deck) {
    this.open_card = deck[0];
    deck = deck.slice(1);
    return deck;
  }

  getOpenCard() {
    return this.open_card;
  }

  getUpdatedCards() {
    return this.cards.slice();
  }

  getRandomNums() {
    this.updatedCards = [];
    return this.http
      .get<number[]>(this.getUrl)
      .pipe()
      .subscribe();
  }

  getTheCards(): Promise<number[]> {
    return this.http.get(this.getUrl)
      .toPromise()
      .then(response => response as number[])
      .catch();
  }

  pushCardToTheCard(card: string) {
    this.cards.push(card);
  }

  parseNumberToCard(element: number) {
    const division: number = Math.ceil(element / 13);
    let whichCard = null;
    const card = this.getTheCard(element % 13);
    if (division === 1) {
      this.clubs[card] = element;
      whichCard = card + 'C';
    }
    if (division === 2) {
      this.diamonds[card] = element;
      whichCard = card + 'D';
    }
    if (division === 3) {
      this.hearts[card] = element;
      whichCard = card + 'H';
    }
    if (division === 4) {
      this.spades[card] = element;
      whichCard = card + 'S';
    }
    return whichCard;
  }

  getTheCard(key: number) {
    const map = new Map();
    map.set(1, 'A');
    map.set(2, '2');
    map.set(3, '3');
    map.set(4, '4');
    map.set(5, '5');
    map.set(6, '6');
    map.set(7, '7');
    map.set(8, '8');
    map.set(9, '9');
    map.set(10, '10');
    map.set(11, 'J');
    map.set(12, 'Q');
    map.set(0, 'K');
    return map.get(key);
  }
}
