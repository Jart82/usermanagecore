import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../../model/user.interface';

@Component({
  selector: 'app-user-detail',
  imports: [],
  templateUrl: './user-detail.html',
  styleUrl: './user-detail.css'
})
export class UserDetail {
  @Input() user!: User;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<User>();

  onSave() {
    this.save.emit(this.user);
  }

  onClose() {
    this.close.emit();
  }
}
