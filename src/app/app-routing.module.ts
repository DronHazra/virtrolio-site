import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// noinspection ES6UnusedImports
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

// Pages
import { AboutComponent } from './pages/about/about.component';
import { AccessDeniedComponent } from './pages/access-denied/access-denied.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ExpiredLinkComponent } from './pages/expired-link/expired-link.component';
import { FaqComponent } from './pages/faq/faq.component';
import { FriendLinkComponent } from './pages/friend-link/friend-link.component';
import { HomeComponent } from './pages/home/home.component';
import { MsgSentComponent } from './pages/msg-sent/msg-sent.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { SigningComponent } from './pages/signing/signing.component';
import { ViewingComponent } from './pages/viewing/viewing.component';
import { VirtrolioCoverComponent } from './pages/virtrolio-cover/virtrolio-cover.component';
import { TermsOfServiceComponent } from './pages/terms-of-service/terms-of-service.component';

// Services
import { LoginResolver } from './core/login-resolver';

// noinspection JSUnusedLocalSymbols
const redirectUnauthorized = () => redirectUnauthorizedTo([ '/access-denied' ]);
const redirectLoggedOutSigning = () => redirectUnauthorizedTo([ '/friend-link' ]);

const routes: Routes = [
  {
    path: '', component: HomeComponent,
    resolve: { user: LoginResolver }
  },
  { path: 'about', component: AboutComponent },
  { path: 'access-denied', component: AccessDeniedComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'expired-link' , component: ExpiredLinkComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'friend-link', component: FriendLinkComponent },
  {
    path: 'msg-sent',
    component: MsgSentComponent,
    canActivate: [ AngularFireAuthGuard ],
    data: { authGuardPipe: redirectUnauthorized }
  },
  { path: 'placeholder', redirectTo: '/expired-link' },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [ AngularFireAuthGuard ],
    data: { authGuardPipe: redirectUnauthorized }
  },
  {
    path: 'signing',
    component: SigningComponent,
    canActivate: [ AngularFireAuthGuard ],
    data: { authGuardPipe: redirectLoggedOutSigning },
    resolve: { user: LoginResolver }
  },
  { path: 'terms-of-service', component: TermsOfServiceComponent },
  {
    path: 'viewing',
    component: ViewingComponent,
    canActivate: [ AngularFireAuthGuard ],
    data: { authGuardPipe: redirectUnauthorized },
    resolve: { user: LoginResolver }
  },
  {
    path: 'virtrolio-cover',
    component: VirtrolioCoverComponent,
    canActivate: [ AngularFireAuthGuard ],
    data: { authGuardPipe: redirectUnauthorized }
  },
  { path: 'page-not-found', component: PageNotFoundComponent },
  { path: '**', pathMatch: 'full', redirectTo: '/page-not-found' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {
}
