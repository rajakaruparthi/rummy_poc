import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Observable } from 'rxjs';
import { Player } from '../models/player.model';
import { FinalCardsResponseModel } from '../models/final-cards-resp.model';

@Component({
  selector: 'app-view-final-cards',
  templateUrl: './view-final-cards.component.html',
  styleUrls: ['./view-final-cards.component.css']
})
export class ViewFinalCardsComponent implements OnInit {

  finalCardsResponse: FinalCardsResponseModel;
  users = [];
  cards = [];
  playersObj: Observable<Player[]>;

  constructor(private commonService: CommonService) { }

  ngOnInit() {
    this.finalCardsResponse = this.commonService.getFinalCards();
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
  }

}
