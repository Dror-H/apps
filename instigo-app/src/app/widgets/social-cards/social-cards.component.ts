import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ingo-widget-social-cards',
  templateUrl: './social-cards.component.html',
  styleUrls: ['./social-cards.component.scss'],
})
export class SocialCardsComponent implements OnInit {
  socialIcons = {
    facebook: 'fab fa-facebook-f',
    linkedin: 'fab fa-linkedin-in',
    instagram: 'fab fa-instagram',
    whatsapp: 'fab fa-whatsapp',
    twitter: 'fab fa-twitter',
    pinterest: 'fab fa-pinterest',
    youtube: 'fab fa-youtube',
  };

  @Input() platform: any;

  @Input() bgColor: string;

  @Input() title: string;

  @Input() subTitle: string;

  socialCards: Array<any>;

  constructor() {
    this.socialCards = [
      {
        platform: 'facebook',
        bgColor: '#2366B8',
        title: '9,459',
        subTitle: 'Likes',
      },
      {
        platform: 'twitter',
        bgColor: '#00ABE4',
        title: '9,459',
        subTitle: 'Followers',
      },
      {
        platform: 'instagram',
        bgColor: 'linear-gradient(to top, #ffc107 0%,#f44336 31%,#9c27b0 65%,#9c27b0 100%)',
        title: '9,459',
        subTitle: 'Followers',
      },
      {
        platform: 'youtube',
        bgColor: '#E32212',
        title: '9,459',
        subTitle: 'Followers',
      },
      {
        platform: 'pinterest',
        bgColor: '#E32212',
        title: '9,459',
        subTitle: 'Followers',
      },
      {
        platform: 'linkedin',
        bgColor: '#007CBC',
        title: '9,459',
        subTitle: 'Followers',
      },
    ];
  }

  ngOnInit() {}
}
