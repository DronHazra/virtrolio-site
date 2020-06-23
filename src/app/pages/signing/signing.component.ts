import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';
import { SigningService } from '../../core/signing.service';
import { MsgIoService } from '../../core/msg-io.service';

@Component({
  selector: 'app-signing',
  templateUrl: './signing.component.html',
  styleUrls: [ './signing.component.css' ]
})

/**
 * Controls user interaction with the signing box, updating the preview display and sending the message when they
 * click on the 'Send' button.
 */
export class SigningComponent implements OnInit {
  public name = 'your friend\'s';

  private uid: string;
  private key: string;

  constructor(private route: ActivatedRoute, private authService: AuthService, public signService: SigningService,
              private msgIo: MsgIoService, private router: Router) { }

  /**
   * Extract query parameters, maximum message length, fonts, and recipient username from appropriate services
   */
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.uid = params.uid;
      this.key = params.key;
    });
    this.authService.displayName(this.uid).then(userName => this.name = userName).catch(error => alert(error));
    this.signService.resetDefaultValues();
  }

  /**
   * Creates a new blank message and fills in all the info before sending it
   * @param textbox - the textbox where the contents of the message are retrieved from (not the preview box)
   */
  sendMsg(textbox: HTMLTextAreaElement) {
    const newMsg = this.msgIo.createBlankMessage();
    newMsg.backColor = this.signService.backgroundColor;
    newMsg.fontColor = this.signService.textColor;
    newMsg.fontFamily = this.signService.currentFont;
    newMsg.contents = textbox.value;
    newMsg.to = this.uid;

    this.msgIo.sendMessage(newMsg, this.key).then(() =>
      this.router.navigate([ '/msg-sent' ]))
      .catch(error => alert(error));
  }
}
