import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewingComponent } from './viewing/viewing.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MsgSentComponent } from './msg-sent/msg-sent.component';
import { VirtrolioCoverComponent } from './virtrolio-cover/virtrolio-cover.component';
import { HomeComponent } from './home/home.component';
import { SigningComponent } from './signing/signing.component';
import { FriendLinkComponent } from './friend-link/friend-link.component';
import { SettingsComponent } from "./settings/settings.component";

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'viewing', component: ViewingComponent },
  { path: 'page-not-found', component: PageNotFoundComponent },
  { path: 'msg-sent', component: MsgSentComponent },
  { path: 'friend-link', component: FriendLinkComponent },
  { path: 'virtrolio-cover', component: VirtrolioCoverComponent },
  { path: 'signing', component: SigningComponent },
  { path: 'settings', component: SettingsComponent},
  { path: '**', pathMatch: 'full', redirectTo: '/page-not-found'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
