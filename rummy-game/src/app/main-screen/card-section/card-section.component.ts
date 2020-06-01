import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/common.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-card-section',
  templateUrl: './card-section.component.html',
  styleUrls: ['./card-section.component.css']
})
export class CardSectionComponent implements OnInit {

  images: string[] = [];

  clubs: number[] = [];

  diamonds: number[] = [];

  hearts: number[] = [];

  spades: number[] = [];

  cardNumbers: number[] = [];

  updatedCards: string[];

  firstThirteen: string[] = [];

  totalHands = 2;

  deck: string[] = [];

  hands_and_cards: string[][] = [[], []];

  total_decks = 2;

  open_card;

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.hands_and_cards[0], event.previousIndex, event.currentIndex);
  }

  distributeCards(totalHands: number) {
    let hands_index = 0;
    for (let n = 0; n < (this.total_decks * 52 + 1) && (n < totalHands * 13); n++) {
      if (hands_index > (totalHands - 1)) {
        hands_index = 0;
      }
      this.hands_and_cards[hands_index][n % 13] = this.images[n];
      hands_index++;
    }
    this.deck = this.images.slice(totalHands * 13);
    this.deck = this.commonService.setOpenCard(this.deck);
    this.hands_and_cards[0].push('2H');
  }


  constructor(private commonService: CommonService) { }
  ngOnInit() {
    this.updatedCards = [];
    this.commonService.getRandomNums();
    const promise = this.commonService.getTheCards();
    promise.then(
      resp => {
        resp.forEach(
          each => {
            this.updatedCards.push(this.commonService.parseNumberToCard(each));
          }
        );
      }
    );

    setTimeout(() => {
     this.images = this.updatedCards;
     this.distributeCards(this.totalHands);
    }, 1000);
  }
}
