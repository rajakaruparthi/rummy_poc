import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/common.service';
import { ShuffleCardsResponse } from 'src/app/models/shuffle-cards-response.model';

@Component({
  selector: 'app-deck-and-discard',
  templateUrl: './deck-and-discard.component.html',
  styleUrls: ['./deck-and-discard.component.css']
})
export class DeckAndDiscardComponent implements OnInit {

  constructor(private cService: CommonService) { }
 

  ngOnInit() {
  }

}
