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
  filteredUsers: User[] = [];
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
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      this.generateJoinedYears(); 
      this.applyFilters();
    });
  }

  //Generate unique sorted years from user data
  generateJoinedYears() {
    const years = new Set(this.users.map(user => user.joinedDate.getFullYear()));
    this.joinedYears = Array.from(years).sort((a, b) => b - a); // Desc: 2025, 2024, ...
  }

  applyFilters() {
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

    this.filteredUsers = filtered;
    this.currentPage = 1; // Reset to first page on filter
    this.updatePagination();
  }

  updatePagination() {
    const totalPages = Math.ceil(this.filteredUsers.length / this.rowsPerPage);
    this.pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    
    const start = (this.currentPage - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    this.paginatedUsers = this.filteredUsers.slice(start, end);
  }

  // Filter change handlers
  onSearchChange() {
    this.applyFilters();
  }

  onPermissionChange() {
    this.applyFilters();
  }

  onJoinedChange() {
    this.applyFilters();
  }

  // Pagination
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.pages.length) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }

  // Actions
  showUserDetails(user: User) {
    console.log('Show details:', user);
  }

  editUser(user: User) {
    console.log('Edit user:', user);
  }

  deleteUser(user: User) {
    if (confirm(`Delete ${user.fullName}?`)) {
      this.userService.deleteUser(user.id);
    }
  }

  exportData() {
    // Simple CSV export
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

  openNewUserModal() {
    console.log('+ New User clicked');
    // Open modal (implement later)
  }

  
}