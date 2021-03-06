import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GuestPageComponent } from './guest-page/guest-page.component';
import { CreateRoomComponent } from './create-room/create-room.component';
import { ListRoomsComponent } from './list-rooms/list-rooms.component';
import { MainScreenComponent } from './main-screen/main-screen.component';
import { PlayersRoomListComponent } from './players-room-list/players-room-list.component';
import { ListRoomsResolver } from './resolvers/list-rooms-resolver';
import { ListUsersResolver } from './resolvers/list-users-resolver';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { JoinCreateTableComponent } from './join-create-table/join-create-table.component';
import { ViewFinalCardsComponent } from './view-final-cards/view-final-cards.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'guest', component: GuestPageComponent},
  {path: 'guest/table', component: JoinCreateTableComponent},
  {path: 'listrooms', component: ListRoomsComponent, resolve: [ListRoomsResolver]},
  {path: 'create-room', component: CreateRoomComponent},
  {path: 'admin-page', component: AdminPageComponent},
  {path: 'listrooms/:id/mainscreen', component: MainScreenComponent},
  {path: 'listrooms/:id/mainscreen/view', component: ViewFinalCardsComponent},
  {path: 'listrooms/:id', component: PlayersRoomListComponent, resolve: [ListUsersResolver]}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
