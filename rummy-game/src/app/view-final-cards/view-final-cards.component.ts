import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Observable } from 'rxjs';
import { Player } from '../models/player.model';
import { FinalCardsResponseModel } from '../models/final-cards-resp.model';
import { PlayersAttr } from '../models/final-players-attr';
import { Router, RouterLink } from '@angular/router';
import { Route } from '@angular/compiler/src/core';

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
  playersAttr: FinalCardsResponseModel = null;
  playersObj: Observable<Player[]>;

  constructor(private commonService: CommonService, private router: Router) { }

  ngOnInit() {
    setTimeout(() => {
      this.playersAttr = this.commonService.pullFinalShowCards();
      console.log(this.playersAttr);
    }, 300);
  }

  drop(event: CdkDragDrop<string[]>, cards: string[]) {
    this.cards = cards;
    moveItemInArray(cards, event.previousIndex, event.currentIndex);
  }

  onRefresh() {
    this.playersAttr = this.commonService.getFinalCards();
  }

  onStartNewGame() {
    
  }

  onManagePlayers() {
    let ary = this.router.url.split('/');
  }
}
