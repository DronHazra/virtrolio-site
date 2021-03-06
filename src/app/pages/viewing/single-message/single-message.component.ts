import { Component, OnInit } from '@angular/core';
import { ViewingService } from '../viewing.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { VirtrolioMessage, VirtrolioMessageTemplate } from '../../../shared/interfaces';
import { firestore } from 'firebase/app';
import Timestamp = firestore.Timestamp;
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-single-message',
  templateUrl: './single-message.component.html',
  styleUrls: [ './single-message.component.css' ]
})
export class SingleMessageComponent implements OnInit {
  currentMessageId: string;
  singleMessage: VirtrolioMessage = {
    ...new VirtrolioMessageTemplate(),
    from: '',
    fromName: '',
    fromPic: '',
    isRead: false,
    key: '',
    timestamp: new Timestamp(0, 0),
    year: 0,
    id: '',
  };

  constructor(public viewService: ViewingService, private route: ActivatedRoute, private router: Router, private toastr: ToastrService,
              private location: Location) {
    this.singleMessage.contents = 'Message is loading...';
    this.singleMessage.backColor = '#FFFFFF';
    this.singleMessage.fontColor = '#000000';
    this.singleMessage.fontFamily = 'Arial';
    this.route.queryParams.subscribe(params => {
      this.currentMessageId = params.messageId;
    });
    if (this.route.snapshot.queryParams.showBookmarkAlert) {
      this.toastr.info('You can now bookmark this page to view this message later', 'Bookmark',
        { positionClass: 'toast-bottom-full-width' });
      this.location.go('/viewing', '?messageId=' + this.currentMessageId);
    }
  }

  ngOnInit(): void {
    this.viewService.msgIo.getMessage(this.currentMessageId).subscribe((message: VirtrolioMessage) => {
      try {
        this.viewService.msgIo.verifyMessage(message);
        this.singleMessage = message;
      } catch (e) {
        AuthService.displayError(e);
        this.router.navigate([ '/viewing' ]);
      }
    });
  }

  /**
   * Go to 'all messages' view
   */
  goToMessages() {
    this.router.navigate([ '/viewing' ]).then(() => {
      window.location.reload();
    });
  }
}
