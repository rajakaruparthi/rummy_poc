import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/common.service';

@Component({
  selector: 'app-deck-and-discard',
  templateUrl: './deck-and-discard.component.html',
  styleUrls: ['./deck-and-discard.component.css']
})
export class DeckAndDiscardComponent implements OnInit {

  constructor(private cService: CommonService) { }
  openCard = null;

  ngOnInit() {
    setTimeout(() => {
     this.assignOpenCard();
    }, 1000);
  }

  assignOpenCard() {
    this.openCard = this.cService.getOpenCard();
    console.log('open card--' + this.openCard);
  }

  addCardToHand() {
    this.openCard = '2S';
  }
}
