import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/common.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { Observable } from 'rxjs';
import { Rooms } from 'src/app/models/rooms.model';
import { Router } from '@angular/router';

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

  roomsList: Rooms[] = [];

  open_card;

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.hands_and_cards[0], event.previousIndex, event.currentIndex);
  }

  distributeCards(totalHands: number) {
    const roomId: string = this.router.url.split('/')[2];
    this.commonService.setUpdatedCards(roomId);
  }


  constructor(private commonService: CommonService, private router: Router) { }

  ngOnInit() {
    setTimeout(() => {
     this.images = this.updatedCards;
     this.distributeCards(this.totalHands);
    }, 500);
  }
}
