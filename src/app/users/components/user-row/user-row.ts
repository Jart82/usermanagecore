import { Component, EventEmitter, Input, Output, ViewChild, ElementRef, HostListener } from '@angular/core';
import { User } from '../../../model/user.interface';
import { CommonModule, NgIf } from '@angular/common';


@Component({
  selector: 'app-user-row',
  imports: [CommonModule],
  templateUrl: './user-row.html',
  styleUrls: ['./user-row.css']
})
export class UserRow {
  @Input() user!: User;
  @Output() viewDetails = new EventEmitter<User>();
  @Output() editUser = new EventEmitter<User>();
  @Output() deleteUser = new EventEmitter<User>();

  showMenu = false;
  buttonPosition = { top: 0, left: 0 };

  @ViewChild('moreButton', { static: false }) moreButton!: ElementRef;

  toggleMenu() {
    if (!this.showMenu) {
      const rect = this.moreButton.nativeElement.getBoundingClientRect();
      this.buttonPosition = { 
        top: rect.top + window.scrollY, 
        left: rect.left + window.scrollX 
      };
    }
    this.showMenu = !this.showMenu;
  }

  closeMenu() {
    this.showMenu = false;
  }

  onView() {
    this.viewDetails.emit(this.user);
    this.closeMenu();
  }

  onEdit() {
    this.editUser.emit(this.user);
    this.closeMenu();
  }

  onDelete() {
    this.deleteUser.emit(this.user);
    this.closeMenu();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (this.showMenu && this.moreButton && !this.moreButton.nativeElement.contains(event.target)) {
      this.closeMenu();
    }
  }
}