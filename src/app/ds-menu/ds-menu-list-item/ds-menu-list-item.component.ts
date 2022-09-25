import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  Configuration,
  ExpandCollapseStatusEnum,
  MultilevelNode,
} from '../ds-menu.component';
import { MenuItemService } from '../menu-item.service';

@Component({
  selector: 'app-ds-menu-list-item',
  templateUrl: './ds-menu-list-item.component.html',
  styleUrls: ['./ds-menu-list-item.component.css'],
})
export class DsMenuListItemComponent implements OnInit {
  @Input() node: MultilevelNode;
  @Input() level: number = 1;
  @Input() submenuLevel = 0;
  @Input() selectedNode: MultilevelNode;
  @Input() nodeConfiguration: Configuration = null;
  @Input() nodeExpandCollapseStatus: ExpandCollapseStatusEnum = null;
  listTemplate = null;

  @Output() selectedItem = new EventEmitter<MultilevelNode>();

  isSelected = false;
  expanded = false;
  firstInitializer = false;

  nodeChildren: MultilevelNode[];
  classes: { [index: string]: boolean };
  selectedListClasses: { [index: string]: boolean };

  constructor(
    private router: Router,
    public multilevelMenuService: MenuItemService
  ) {
    this.selectedListClasses = {
      [CONSTANT.DEFAULT_LIST_CLASS_NAME]: true,
      [CONSTANT.SELECTED_LIST_CLASS_NAME]: false,
      [CONSTANT.ACTIVE_ITEM_CLASS_NAME]: false,
    };
  }

  ngOnChanges() {
    this.nodeChildren =
      this.node && this.node.items
        ? this.node.items.filter((n) => !n.hidden)
        : [];
    this.node.hasChildren = this.hasItems();

    if (this.selectedNode) {
      this.setSelectedClass(
        this.multilevelMenuService.recursiveCheckId(
          this.node,
          this.selectedNode.id
        )
      );
    }
    this.setExpandCollapseStatus();
  }

  ngOnInit() {
    this.selectedListClasses[CONSTANT.DISABLED_ITEM_CLASS_NAME] =
      this.node.disabled;

    this.selectedListClasses[
      `level-${this.level}-submenulevel-${this.submenuLevel}`
    ] = true;
    if (typeof this.node.expanded === 'boolean') {
      this.expanded = this.node.expanded;
    }
    this.setClasses();
  }

  setSelectedClass(isFound: boolean): void {
    if (isFound) {
      if (!this.firstInitializer) {
        this.expanded = true;
      }
      this.isSelected =
        this.nodeConfiguration.highlightOnSelect ||
        this.selectedNode.items === undefined;
    } else {
      this.isSelected = false;
      if (this.nodeConfiguration.collapseOnSelect) {
        this.node.expanded = false;
        this.expanded = false;
      }
    }
    this.selectedListClasses = {
      [CONSTANT.DEFAULT_LIST_CLASS_NAME]: true,
      [CONSTANT.SELECTED_LIST_CLASS_NAME]: this.isSelected,
      [CONSTANT.ACTIVE_ITEM_CLASS_NAME]: this.selectedNode.id === this.node.id,
      [CONSTANT.DISABLED_ITEM_CLASS_NAME]: this.node.disabled,
      [`level-${this.level}-submenulevel-${this.submenuLevel}`]: true,
    };
    this.node.isSelected = this.isSelected;
    this.setClasses();
  }

  getPaddingAtStart(): boolean {
    return false;
  }

  getListStyle() {
    const styles = {
      background: CONSTANT.DEFAULT_LIST_BACKGROUND_COLOR,
      color: CONSTANT.DEFAULT_LIST_FONT_COLOR,
    };

    return styles;
  }

  hasItems(): boolean {
    return this.nodeChildren.length > 0;
  }

  isRtlLayout(): boolean {
    return this.nodeConfiguration.rtlLayout;
  }

  setClasses(): void {
    this.classes = {
      [`level-${this.level + 1}`]: true,
      [CONSTANT.SUBMENU_ITEM_CLASS_NAME]: this.hasItems(),
      [CONSTANT.HAS_SUBMENU_ITEM_CLASS_NAME]: this.hasItems(),
    };
  }

  setExpandCollapseStatus(): void {
    if (this.nodeExpandCollapseStatus) {
      if (this.nodeExpandCollapseStatus === ExpandCollapseStatusEnum.expand) {
        this.expanded = true;
      }
      if (this.nodeExpandCollapseStatus === ExpandCollapseStatusEnum.collapse) {
        this.expanded = false;
      }
    }
  }

  expand(node: MultilevelNode): void {
    if (node.disabled) {
      return;
    }
    this.nodeExpandCollapseStatus = ExpandCollapseStatusEnum.neutral;
    this.expanded = !this.expanded;
    this.node.expanded = this.expanded;
    this.firstInitializer = true;
    this.setClasses();
    if (
      this.nodeConfiguration.interfaceWithRoute !== null &&
      this.nodeConfiguration.interfaceWithRoute &&
      node.link !== undefined &&
      node.link
    ) {
      //  this.router.navigate([node.link], node.navigationExtras).then();
    } else if (node.onSelected && typeof node.onSelected === 'function') {
      node.onSelected(node);
      this.selectedListItem(node);
    } else if (
      node.items === undefined ||
      this.nodeConfiguration.collapseOnSelect
    ) {
      this.selectedListItem(node);
    }
  }

  selectedListItem(node: MultilevelNode): void {
    this.selectedItem.emit(node);
  }

  getLevel(level): number {
    console.log(level);
    return parseInt(level + 1);
  }
}
export const CONSTANT = {
  PADDING_AT_START: true,
  DEFAULT_CLASS_NAME: `amml-container`,
  DEFAULT_LIST_CLASS_NAME: `amml-item`,
  SELECTED_LIST_CLASS_NAME: `selected-amml-item`,
  ACTIVE_ITEM_CLASS_NAME: `active-amml-item`,
  DISABLED_ITEM_CLASS_NAME: `disabled-amml-item`,
  SUBMENU_ITEM_CLASS_NAME: `amml-submenu`,
  HAS_SUBMENU_ITEM_CLASS_NAME: `has-amml-submenu`,
  DEFAULT_SELECTED_FONT_COLOR: `#1976d2`,
  DEFAULT_LIST_BACKGROUND_COLOR: `transparent`,
  DEFAULT_LIST_FONT_COLOR: `rgba(0,0,0,.87)`,
  DEFAULT_HREF_TARGET_TYPE: '_self',
  ERROR_MESSAGE: `Invalid data for material Multilevel List Component`,
  POSSIBLE: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  YES: 'yes',
  NO: 'no',
};
