import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../model/user.interface';

@Component({
  selector: 'app-user-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-detail.html',
  styleUrls: ['./user-detail.css']
})
export class UserDetail {
  @Input() user!: User;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<User>();

  isEditing = false;
  originalUser: User;

  constructor() {
    this.originalUser = JSON.parse(JSON.stringify(this.user));
  }

  startEditing() {
    this.isEditing = true;
  }

  onSave() {
    this.save.emit(this.user);
    this.isEditing = false;
  }

  onClose() {
    if (this.isEditing) {
      Object.assign(this.user, this.originalUser);
    }
    this.close.emit();
  }
}