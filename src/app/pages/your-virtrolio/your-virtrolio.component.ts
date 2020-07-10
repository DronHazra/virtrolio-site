import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { SharingLinkService } from '../../core/sharing-link.service';

declare var $: any;

@Component({
  selector: 'app-your-virtrolio',
  templateUrl: './your-virtrolio.component.html',
  styleUrls: [ './your-virtrolio.component.css' ]
})

/**
 * 'Your virtrolio.' Displays your virtrolio as a 'book' on screen and allows you to generate a sharing link.
 */
export class YourVirtrolioComponent implements OnInit {
  /** Default values */
  public link = 'Getting your link...';
  public linkReady = false;
  public showWarningText = false;
  public copyButtonText = 'Copy';
  public displayName: string;
  public visitLink: string;
  private visitLinkUID: string;
  private visitLinkKEY: string;
  public navigator: any;

  constructor(public authService: AuthService, private sharingLinkService: SharingLinkService,
              public router: Router, private title: Title) { }

  ngOnInit(): void {
    this.authService.displayName().then((displayName) => {
      this.displayName = displayName;
      this.title.setTitle(displayName + '\'s Virtrolio | Virtrolio');
    });

    this.navigator = window.navigator;
  }

  /**
   * Check if user can share using a native sharing mechanism (i.e. if they are on mobile)
   */
  canShare() {
    return this.navigator && this.navigator.share;
  }

  /**
   * Selects an inputElement's field and copies its contents to the clipboard, updating the button to confirm the copy
   * @param inputElement - the element to read from
   */
  copyLink(inputElement: HTMLInputElement) {
    inputElement.select();
    inputElement.setSelectionRange(0, 10000);
    document.execCommand('copy');
    this.copyButtonText = 'Copied!';
  }

  /**
   * Closes sharing link modal and opens up desktop sharing modal
   */
  openDesktopSharing() {
    $('#link-gen').modal('hide');
    $('#share-link-modal').modal('show');
  }

  /**
   * Fetches the user's sharing link, alerts an error on invalid link
   */
  setLink() {
    this.copyButtonText = 'Copy';
    this.sharingLinkService.getLink().then(link => {
      this.link = link;
      this.linkReady = true;
    });
  }

  /**
   * Attempts to navigate by router to a sharing link based on what is inputted in the 'send a message' input field (query
   * params extracted with regEx if possible)
   */
  navigateToLink() {
    if (this.visitLink) {
      try {
        // noinspection JSIgnoredPromiseFromCall
        this.visitLinkUID = this.visitLink.match(/uid=([^&]*)/)[1];
        this.visitLinkKEY = this.visitLink.match(/key=([^&]*)/)[1];
        window.location.href = '/signing?uid=' + this.visitLinkUID + '&key=' + this.visitLinkKEY;
      } catch (e) {
        this.router.navigate([ '/invalid-link' ]).catch(e => AuthService.displayError(e));
      }
    }
  }

  shareLink() {
    if (this.canShare()) {
      this.navigator.share({
        title: this.displayName + '\'s virtrolio!',
        text: 'Visit this link to sign their virtrolio and send them a custom message!',
        url: this.link,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      alert('Share not supported on this device. Use a mobile device!');
    }
  }

  /**
   * Share the user's sharing link on the appropriate platform
   * @param platform - platform on which to post the sharing link
   * @throws - Error if 'platform' chosen is not supported
   */
  postOnSocial(platform: string) {
    const urlFriendlyLink = 'https%3A//virtrolio.web.app/signing?uid=' + this.authService.uid() + '%26key=' +
      this.link.match(/key=([^&]*)/)[1];

    if (platform === 'facebook') {
      window.open('https://www.facebook.com/sharer/sharer.php?u=' + urlFriendlyLink, '_blank');
    } else if (platform === 'twitter') {
      window.open('https://twitter.com/intent/tweet?url=' + urlFriendlyLink + '&text=Send%20me%20a%20message!', '_blank');
    } else if (platform === 'gmail') {
      window.open('https://mail.google.com/mail/u/0/?view=cm&fs=1&tf=1&source=mailto&body=' + urlFriendlyLink, '_blank');
    } else {
      throw new Error('Attempted to post to a social media platform we do not yet support!');
    }
  }

  /**
   * Toggles between displaying warning text and updating the sharing link in the text box.
   */
  warnAndGenerate() {
    if (this.showWarningText) {
      this.link = 'Generating new link...';
      this.linkReady = false;
      this.copyButtonText = 'Copy';
      this.sharingLinkService.changeKey().then(() => this.setLink()).catch(error => alert(AuthService.displayError(error)));
      this.setLink();
    }
    this.showWarningText = !this.showWarningText;
  }

}
