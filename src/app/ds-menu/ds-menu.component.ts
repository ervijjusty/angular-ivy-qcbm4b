import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { MenuItemService } from './menu-item.service';

@Component({
  selector: 'app-ds-menu',
  templateUrl: './ds-menu.component.html',
  styleUrls: ['./ds-menu.component.css'],
})
export class DsMenuComponent implements OnInit {
  items: MultilevelNode[] = [
    {
      label: 'Item 1 (with Font awesome icon)',
      faIcon: 'fab fa-500px',
      items: [
        {
          label: 'Item 1.1',
          link: '/item-1-1',
          faIcon: 'fab fa-accusoft',
        },
        {
          label: 'Item 1.2',
          faIcon: 'fab fa-accessible-icon',
          items: [
            {
              label: 'Item 1.2.1',
              link: '/item-1-2-1',
              faIcon: 'fas fa-allergies',
            },
            {
              label: 'Item 1.2.2',
              faIcon: 'fas fa-ambulance',
              items: [
                {
                  label: 'Item 1.2.2.1',
                  link: 'item-1-2-2-1',
                  faIcon: 'fas fa-anchor',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      label: 'Item 2',
      icon: 'alarm',
      items: [
        {
          label: 'Item 2.1',
          link: '/item-2-1',
          icon: 'favorite',
        },
        {
          label: 'Item 2.2',
          link: '/item-2-2',
          icon: 'favorite_border',
        },
      ],
    },
    {
      label: 'Item 3',
      link: '/item-3',
      icon: 'offline_pin',
    },
    {
      label: 'Item 4',
      link: '/item-4',
      icon: 'star_rate',
      hidden: true,
    },
  ];

  @Input() configuration: Configuration = null;
  @Output() selectedItem = new EventEmitter<MultilevelNode>();
  @Output() selectedLabel = new EventEmitter<MultilevelNode>();
  @Output() menuIsReady = new EventEmitter<MultilevelNode[]>();

  expandCollapseStatusSubscription: Subscription = null;
  selectMenuByIDSubscription: Subscription = null;
  currentNode: MultilevelNode = null;
  nodeExpandCollapseStatus: ExpandCollapseStatusEnum =
    ExpandCollapseStatusEnum.neutral;
  isInvalidData = true;

  constructor(protected menuItemService: MenuItemService) {}

  ngOnChanges() {
    this.initExpandCollapseStatus();
    this.initSelectedMenuID();
    this.menuIsReady.emit(this.items);
  }

  ngOnInit() {
    console.log(this.items);
    this.menuItemService.addRandomId(this.items);
    this.isInvalidData = false;
  }

  initExpandCollapseStatus(): void {
    // this.expandCollapseStatusSubscription = this.multilevelMenuService.expandCollapseStatus$
    //   .subscribe( (expandCollapseStatus: ExpandCollapseStatusEnum) => {
    //   this.nodeExpandCollapseStatus = expandCollapseStatus ? expandCollapseStatus : ExpandCollapseStatusEnum.neutral;
    // }, () => {
    //   this.nodeExpandCollapseStatus = ExpandCollapseStatusEnum.neutral;
    // });
  }
  initSelectedMenuID(): void {
    this.selectMenuByIDSubscription =
      this.menuItemService.selectedMenuID$.subscribe(
        (selectedMenuID: string) => {
          if (selectedMenuID) {
            const foundNode = this.menuItemService.getMatchedObjectById(
              this.items,
              selectedMenuID
            );
            if (foundNode !== undefined) {
              this.currentNode = foundNode;
              this.selectedListItem(foundNode);
            }
          }
        }
      );
  }

  selectedListItem(event: MultilevelNode): void {
    this.nodeExpandCollapseStatus = ExpandCollapseStatusEnum.neutral;
    this.currentNode = event;

    if (!this.isNullOrUndefined(event?.dontEmit) && event?.dontEmit) {
      return;
    }
    if (
      event.items === undefined &&
      (!event.onSelected || typeof event.onSelected !== 'function')
    ) {
      this.selectedItem.emit(event);
    } else {
      //  this.selectedLabel.emit(event);
    }
  }

  isNullOrUndefinedOrEmpty = function (object: any): boolean {
    return this.isNullOrUndefined(object) || object === '';
  };

  isNullOrUndefined = function (object: any): boolean {
    return object === null || object === undefined;
  };
}

export interface MultilevelNode {
  id?: string;
  label?: string;
  faIcon?: string;
  icon?: string;
  imageIcon?: string;
  svgIcon?: string;
  activeFaIcon?: string;
  activeIcon?: string;
  activeImageIcon?: string;
  activeSvgIcon?: string;
  hidden?: boolean;
  link?: string;
  externalRedirect?: boolean;
  hrefTargetType?: string;
  data?: any;
  items?: MultilevelNode[];
  onSelected?: Function;
  disabled?: boolean;
  expanded?: boolean;
  dontEmit?: boolean;
  hasChildren?: boolean;
  isSelected?: boolean;
}

export interface Configuration {
  classname?: string;
  paddingAtStart?: boolean;
  backgroundColor?: string;
  listBackgroundColor?: string;
  fontColor?: string;
  selectedListFontColor?: string;
  interfaceWithRoute?: boolean;
  collapseOnSelect?: boolean;
  highlightOnSelect?: boolean;
  useDividers?: boolean;
  rtlLayout?: boolean;
  customTemplate?: boolean;
}

export enum ExpandCollapseStatusEnum {
  expand = 'expand',
  collapse = 'collapse',
  neutral = 'neutral',
}
