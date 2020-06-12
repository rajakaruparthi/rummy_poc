import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.css']
})
export class CreateRoomComponent implements OnInit {

  constructor(private commonService: CommonService, private router: Router) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const roomName = value.roomName;
    const password = value.password;
    const response = this.commonService.createRoom(roomName, password);
    this.commonService.setGameCreator(this.commonService.getPlayerName());
    response.then(
      data => {
        this.router.navigate(['/listrooms']);
      }
    );
  }
}
