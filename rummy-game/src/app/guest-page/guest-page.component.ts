import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-guest-page',
  templateUrl: './guest-page.component.html',
  styleUrls: ['./guest-page.component.css']
})
export class GuestPageComponent implements OnInit {

  userName = '';

  constructor(private commonService: CommonService) { }

  ngOnInit() {
  }

  onClickViewRooms(firstName: string) {
    let username = firstName;
    this.commonService.setPlayerName(username);
  }
}
