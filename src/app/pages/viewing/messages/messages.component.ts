import { Component, OnInit } from '@angular/core';
import { ViewingService } from '../viewing.service';
import { AuthService } from '../../../core/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageModalComponent } from '../message-modal/message-modal.component';
import { VirtrolioMessage } from '../../../shared/interfaces';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: [ './messages.component.css' ]
})

export class MessagesComponent implements OnInit {
  currentMessageId: string;
  isSingleMessageView = false;

  constructor(public viewService: ViewingService, public authService: AuthService, private route: ActivatedRoute,
              private router: Router, private vps: ViewportScroller, private toastr: ToastrService, private modalService: NgbModal) {
    this.route.queryParams.subscribe(params => {
      this.currentMessageId = params.messageId;
    });
  }

  ngOnInit(): void {
    if (this.route.snapshot.queryParams.messageId) {
      this.isSingleMessageView = true;
    }
  }

  /**
   * Generate the lightness value of HSL from RBG
   */
  getLightness(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2;
    return l;
  }

  /**
   * Generate a darkened version of backColor, returning this new header color and the appropriate header text color
   * @param backColor: background color of the message
   */
  generateHeaderColor(backColor: string) {
    const bgR = parseInt(backColor.slice(1, 3), 16);
    const bgG = parseInt(backColor.slice(3, 5), 16);
    const bgB = parseInt(backColor.slice(5), 16);
    let headerTextColor;
    let trashIcon;
    let popupIcon;
    if (this.getLightness(bgR, bgG, bgB) > 0.65) {
      headerTextColor = '#000000';
      trashIcon = '../../../../assets/images/icons/trash-black.svg';
      popupIcon = '../../../../assets/images/icons/maximize-black.svg';
    } else {
      headerTextColor = '#FFFFFF';
      trashIcon = '../../../../assets/images/icons/trash-white.svg';
      popupIcon = '../../../../assets/images/icons/maximize-white.svg';
    }
    const hR = bgR + 20 > 255 ? 255 : bgR + 20;
    const hG = bgG + 20 > 255 ? 255 : bgG + 20;
    const hB = bgB + 20 > 255 ? 255 : bgB + 20;
    const headerColor = hR.toString(16) + hG.toString(16) + hB.toString(16);

    return { bg: '#' + headerColor, text: headerTextColor, trash: trashIcon, popup: popupIcon };
  }

  /**
   * Scroll to the card with the given id and update the URL
   * @param id: id attribute of the card
   */
  showMessage(id) {
    console.log(id);
    this.vps.scrollToAnchor(id);
  }

  /**
   * Activate an NgbModal to display the selected message
   * @param msg VirtrolioMessage object
   */
  popupMessage(msg: VirtrolioMessage) {
    this.viewService.currentMessageModal = msg;
    const modalRef = this.modalService.open(MessageModalComponent);
  }

  /**
   * Swap between message viewing styles
   */
  toggleViewStyle() {
    this.viewService.isCarouselView = this.viewService.isCarouselView === false;
  }
}
