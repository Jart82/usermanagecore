import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../model/user.interface';
import { UserService } from '../../../services/users.service';
import { UserDetail } from '../user-detail/user-detail';
import { UserRow } from '../user-row/user-row';


@Component({
  selector: 'app-user-container',
  imports: [CommonModule, FormsModule, UserRow, UserDetail, NgIf],
  templateUrl: './user-container.html',
  styleUrls: ['./user-container.css']
})
export class UserContainer implements OnInit {
  
  users: User[] = [];
  paginatedUsers: User[] = [];
  searchTerm = '';
  filterPermissions = '';
  filterJoined = '';
  currentPage = 1;
  rowsPerPage = 10;
  pages: number[] = [];
  joinedYears: number[] = [];
  selectedUser: User | null = null;
  showDetailModal = false;
  isEditing = false;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      this.updateView();
    });
  }

  
  updateView() {
    let filtered = this.users;

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(u =>
        u.fullName.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term)
      );
    }

    if (this.filterPermissions) {
      filtered = filtered.filter(u => u.permissions === this.filterPermissions);
    }

    if (this.filterJoined) {
      const year = parseInt(this.filterJoined);
      filtered = filtered.filter(u => u.joinedDate.getFullYear() === year);
    }

    const totalPages = Math.ceil(filtered.length / this.rowsPerPage);
    this.pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    const start = (this.currentPage - 1) * this.rowsPerPage;
    this.paginatedUsers = filtered.slice(start, start + this.rowsPerPage);
    
    const years = new Set(this.users.map(user => user.joinedDate.getFullYear()));
    this.joinedYears = Array.from(years).sort((a, b) => b - a);
  }

  // Pagination
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateView();
    }
  }

  nextPage() {
    if (this.currentPage < this.pages.length) {
      this.currentPage++;
      this.updateView();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updateView();
  }

  // Modal Actions
  showUserDetails(user: User) {
    this.selectedUser = { ...user };
    this.showDetailModal = true;
    this.isEditing = false;
  }

  editUser(user: User) {
    this.selectedUser = { ...user };
    this.showDetailModal = true;
    this.isEditing = true;
  }

  onSaveUser(updatedUser: User) {
    this.userService.updateUser(updatedUser);
    this.showDetailModal = false;
  }

  onCloseDetail() {
    this.showDetailModal = false;
  }

  // Delete
  deleteUser(user: User) {
    if (confirm(`Delete ${user.fullName}?`)) {
      this.userService.deleteUser(user.id);
    }
  }

  // Export
  exportData() {
    const headers = ['Full Name', 'Email', 'Location', 'Joined', 'Permissions'];
    const rows = this.users.map(u => [
      `"${u.fullName}"`,
      `"${u.email}"`,
      `"${u.location}"`,
      `"${u.joinedDate.toISOString().split('T')[0]}"`,
      `"${u.permissions}"`
    ]);

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'users.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}