import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../../model/user.interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-user-row',
  imports: [DatePipe],
  templateUrl: './user-row.html',
  styleUrl: './user-row.css'
})
export class UserRow {
  @Input() user!: User;
  @Output() viewDetails = new EventEmitter<User>();
  @Output() editUser = new EventEmitter<User>();
  @Output() deleteUser = new EventEmitter<User>();

  onMoreClick() {
    // Trigger dropdown/modal with options: View, Edit, Delete
    console.log('More clicked for:', this.user);
    this.viewDetails.emit(this.user);
  }
}
