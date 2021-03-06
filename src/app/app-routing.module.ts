import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { PendingChangesGuard } from './core/pending-changes.guard';
// Pages
import { AboutComponent } from './pages/about/about.component';
import { AccessDeniedComponent } from './pages/access-denied/access-denied.component';
import { ContactComponent } from './pages/contact/contact.component';
import { FaqComponent } from './pages/faq/faq.component';
import { SigningAuthRedirectComponent } from './pages/signing-auth-redirect/signing-auth-redirect.component';
import { HomeComponent } from './pages/home/home.component';
import { InvalidLinkComponent } from './pages/invalid-link/invalid-link.component';
import { MsgSentComponent } from './pages/msg-sent/msg-sent.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { SigningComponent } from './pages/signing/signing.component';
import { TermsOfServiceComponent } from './pages/terms-of-service/terms-of-service.component';
import { ViewingComponent } from './pages/viewing/viewing.component';
import { YourVirtrolioComponent } from './pages/your-virtrolio/your-virtrolio.component';
// Services & Guards
import { LoginResolver } from './core/login-resolver';
import { RejeccComponent } from './pages/rejecc/rejecc.component';
import { SigningGuard } from './core/signing.guard';
import { PreventURLAccessGuard } from './core/prevent-urlaccess.guard';
import { MaintenanceComponent } from './pages/maintenance/maintenance.component';

const redirectUnauthorized = () => redirectUnauthorizedTo([ '/access-denied' ]);

const routes: Routes = [
  {
    path: '', component: HomeComponent,
    resolve: { user: LoginResolver }
  },
  { path: 'about', component: AboutComponent },
  { path: 'access-denied', component: AccessDeniedComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'faq', component: FaqComponent },
  {
    path: 'signing-auth-redirect',
    component: SigningAuthRedirectComponent,
    // canActivate: [ PreventURLAccessGuard ]
  },
  {
    path: 'invalid-link',
    component: InvalidLinkComponent,
    // canActivate: [ PreventURLAccessGuard ]
  },
  {
    path: 'maintenance',
    component: MaintenanceComponent,
    // canActivate: [ PreventURLAccessGuard ]
  },
  {
    path: 'msg-sent',
    component: MsgSentComponent,
    // canActivate: [ PreventURLAccessGuard ],
  },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  {
    path: 'rejecc',
    component: RejeccComponent,
    // canActivate: [ PreventURLAccessGuard ]
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [ AngularFireAuthGuard ],
    data: { authGuardPipe: redirectUnauthorized },
    resolve: { user: LoginResolver }
  },
  {
    path: 'signing',
    component: SigningComponent,
    canActivate: [ SigningGuard ],
    resolve: { user: LoginResolver },
    canDeactivate: [ PendingChangesGuard ]
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
    path: 'your-virtrolio',
    component: YourVirtrolioComponent,
    canActivate: [ AngularFireAuthGuard ],
    data: { authGuardPipe: redirectUnauthorized },
    resolve: { user: LoginResolver }
  },
  { path: 'page-not-found', component: PageNotFoundComponent },
  { path: '**', pathMatch: 'full', redirectTo: '/page-not-found' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes,
    {
      scrollPositionRestoration: 'enabled', // scroll to top when routerLinking
      anchorScrolling: 'enabled',
      onSameUrlNavigation: 'reload'
    }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {
}
