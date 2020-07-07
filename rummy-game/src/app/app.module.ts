import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainScreenComponent } from './main-screen/main-screen.component';
import { HeaderComponent } from './main-screen/header/header.component';
import { CardSectionComponent } from './main-screen/card-section/card-section.component';
import { HttpClientModule } from '@angular/common/http';
import { DemoMaterialModule } from './material.module';
import { SignInComponent } from './user-reg/sign-in/sign-in.component';
import { UserRegistrationComponent } from './user-reg/user-registration/user-registration.component';
import { HomeComponent } from './home/home.component';
import { GuestPageComponent } from './guest-page/guest-page.component';
import { CreateRoomComponent } from './create-room/create-room.component';
import { ListRoomsComponent } from './list-rooms/list-rooms.component';
import { FormsModule } from '@angular/forms';
import { LeftpaneComponent } from './leftpane/leftpane.component';
import { PlayersRoomListComponent } from './players-room-list/players-room-list.component';
import { BackButtonDisableModule } from 'angular-disable-browser-back-button';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';
import { ConfirmDialogService } from './confirm-dialog.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { JoinCreateTableComponent } from './join-create-table/join-create-table.component';
import { ViewFinalCardsComponent } from './view-final-cards/view-final-cards.component';
import { PlayersListComponent } from './players-list/players-list.component';

const config: SocketIoConfig = { url: 'http://localhost:4444', options: {} };


@NgModule({
  declarations: [
    AppComponent,
    MainScreenComponent,
    HeaderComponent,
    CardSectionComponent,
    SignInComponent,
    UserRegistrationComponent,
    HomeComponent,
    GuestPageComponent,
    CreateRoomComponent,
    ListRoomsComponent,
    LeftpaneComponent,
    PlayersRoomListComponent,
    AdminPageComponent,
    DialogBoxComponent,
    JoinCreateTableComponent,
    ViewFinalCardsComponent,
    PlayersListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    DemoMaterialModule,
    FormsModule,
    NgbModule.forRoot(),
    SocketIoModule.forRoot(config),
    BackButtonDisableModule.forRoot({
      preserveScrollPosition: true
    })
  ],
  providers: [ConfirmDialogService],
  bootstrap: [AppComponent],
  entryComponents: [DialogBoxComponent],
})
export class AppModule { }
