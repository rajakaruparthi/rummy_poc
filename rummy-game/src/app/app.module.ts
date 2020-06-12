import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainScreenComponent } from './main-screen/main-screen.component';
import { HeaderComponent } from './main-screen/header/header.component';
import { CardSectionComponent } from './main-screen/card-section/card-section.component';
import { HttpClientModule } from '@angular/common/http';
import { DemoMaterialModule } from './material.module';
import { DeckAndDiscardComponent } from './main-screen/deck-and-discard/deck-and-discard.component';
import { SignInComponent } from './user-reg/sign-in/sign-in.component';
import { UserRegistrationComponent } from './user-reg/user-registration/user-registration.component';
import { HomeComponent } from './home/home.component';
import { GuestPageComponent } from './guest-page/guest-page.component';
import { CreateRoomComponent } from './create-room/create-room.component';
import { ListRoomsComponent } from './list-rooms/list-rooms.component';
import { FormsModule } from '@angular/forms';
import { LeftpaneComponent } from './leftpane/leftpane.component';
import { UsersChangeComponent } from './users-change/users-change.component';
import { PlayersRoomListComponent } from './players-room-list/players-room-list.component';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { AdminPageComponent } from './admin-page/admin-page.component';

const config: SocketIoConfig = { url: 'http://localhost:4444', options: {} };


@NgModule({
  declarations: [
    AppComponent,
    MainScreenComponent,
    HeaderComponent,
    CardSectionComponent,
    DeckAndDiscardComponent,
    SignInComponent,
    UserRegistrationComponent,
    HomeComponent,
    GuestPageComponent,
    CreateRoomComponent,
    ListRoomsComponent,
    LeftpaneComponent,
    UsersChangeComponent,
    PlayersRoomListComponent,
    AdminPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    DemoMaterialModule,
    FormsModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
