import { Component, VERSION } from '@angular/core';
import { MenuItemService } from './ds-menu/menu-item.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  name = 'Angular ' + VERSION.major;
  items: [
    {
      label: 'Item 1 (with Font awesome icon)';
      faIcon: 'fab fa-500px';
      items: [
        {
          label: 'Item 1.1';
          link: '/item-1-1';
          faIcon: 'fab fa-accusoft';
        },
        {
          label: 'Item 1.2';
          faIcon: 'fab fa-accessible-icon';
          items: [
            {
              label: 'Item 1.2.1';
              link: '/item-1-2-1';
              faIcon: 'fas fa-allergies';
            },
            {
              label: 'Item 1.2.2';
              faIcon: 'fas fa-ambulance';
              items: [
                {
                  label: 'Item 1.2.2.1';
                  link: 'item-1-2-2-1';
                  faIcon: 'fas fa-anchor';
                }
              ];
            }
          ];
        }
      ];
    },
    {
      label: 'Item 2';
      icon: 'alarm';
      items: [
        {
          label: 'Item 2.1';
          link: '/item-2-1';
          icon: 'favorite';
        },
        {
          label: 'Item 2.2';
          link: '/item-2-2';
          icon: 'favorite_border';
        }
      ];
    },
    {
      label: 'Item 3';
      link: '/item-3';
      icon: 'offline_pin';
    },
    {
      label: 'Item 4';
      link: '/item-4';
      icon: 'star_rate';
      hidden: true;
    }
  ];
  constructor(public MenuItemService: MenuItemService) {}

  selectedItem(e) {
    console.log(e);
  }
}
