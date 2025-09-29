// src/app/components/user-container/user-container.component.ts
import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { User } from '../../../model/user.interface';
import { UserService } from '../../../services/users.service';
import { FormsModule } from '@angular/forms';
import { UserRow } from '../user-row/user-row';

@Component({
  selector: 'app-user-container',
  imports: [CommonModule, FormsModule, UserRow],
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

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      this.updateView(); // Initial render
    });
  }

  // Pure UI method: delegates to service
  updateView() {
    const result = this.userService.getFilteredAndPaginatedUsers(
      this.searchTerm,
      this.filterPermissions,
      this.filterJoined,
      this.currentPage,
      this.rowsPerPage
    );

    this.paginatedUsers = result.paginatedUsers;
    this.pages = result.pages;
    this.joinedYears = result.joinedYears;
  }

  // Filter handlers (only update state + refresh view)
  onSearchChange() { this.updateView(); }
  onPermissionChange() { this.updateView(); }
  onJoinedChange() { this.updateView(); }

  // Pagination (only update state + refresh view)
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

  // Actions (minimal logic)
  deleteUser(user: User) {
    if (confirm(`Delete ${user.fullName}?`)) {
      this.userService.deleteUser(user.id);
      // Re-fetch users to update UI
      this.userService.getUsers().subscribe(users => {
        this.users = users;
        this.updateView();
      });
    }
  }

  exportData() {
    const csvContent = this.userService.generateCSV(this.users);
    const blob = new Blob(['\uFEFF', csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'users.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Placeholder methods
  showUserDetails(user: User) { console.log('Show details:', user); }
  editUser(user: User) { console.log('Edit user:', user); }
  openNewUserModal() { console.log('+ New User clicked'); }

  
}