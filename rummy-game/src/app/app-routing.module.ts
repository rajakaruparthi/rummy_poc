import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GuestPageComponent } from './guest-page/guest-page.component';
import { CreateRoomComponent } from './create-room/create-room.component';
import { ListRoomsComponent } from './list-rooms/list-rooms.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'guest', component: GuestPageComponent},
  {path: 'listrooms', component: ListRoomsComponent},
  {path: 'create-room', component: CreateRoomComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
