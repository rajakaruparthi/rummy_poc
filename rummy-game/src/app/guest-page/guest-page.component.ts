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
    // let users = this.commonService.getUsers();
    // console.log(users);
  }

  onClickViewRooms(userName: string) {
    this.commonService.setPlayerName(userName);
  }

  drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
  }

  allowDrop(ev) {
    ev.preventDefault();
  }

  drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
  }
}
