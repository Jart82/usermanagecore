// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { MOCK_USERS } from '../../db-data';
import { User } from '../model/user.interface';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [...MOCK_USERS];
  private usersSubject = new BehaviorSubject<User[]>(this.users);
  public users$ = this.usersSubject.asObservable();


  getFilteredAndPaginatedUsers(
    searchTerm: string = '',
    permission: string = '',
    joinedYear: string = '',
    currentPage: number = 1,
    rowsPerPage: number = 10
  ) {
    let filtered = this.users;

    // Search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(u =>
        u.fullName.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term)
      );
    }

    // Permissions
    if (permission) {
      filtered = filtered.filter(u => u.permissions === permission);
    }

    // Joined year
    if (joinedYear) {
      const year = parseInt(joinedYear);
      filtered = filtered.filter(u => u.joinedDate.getFullYear() === year);
    }

    // Pagination
    const totalPages = Math.ceil(filtered.length / rowsPerPage);
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    const start = (currentPage - 1) * rowsPerPage;
    const paginated = filtered.slice(start, start + rowsPerPage);

    return {
      filteredUsers: filtered,
      paginatedUsers: paginated,
      pages,
      joinedYears: this.getJoinedYears()
    };
  }

  private getJoinedYears(): number[] {
    const years = new Set(this.users.map(user => user.joinedDate.getFullYear()));
    return Array.from(years).sort((a, b) => b - a);
  }

  
  generateCSV(users: User[]): string {
    const headers = ['Full Name', 'Email', 'Location', 'Joined', 'Permissions'];
    const rows = users.map(u => [
      `"${u.fullName}"`,
      `"${u.email}"`,
      `"${u.location}"`,
      `"${u.joinedDate.toISOString().split('T')[0]}"`,
      `"${u.permissions}"`
    ]);
    return [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  }

  // Existing CRUD methods
  getUsers(): Observable<User[]> {
    return this.users$;
  }

  getUserById(id: number): Observable<User | undefined> {
    return of(this.users.find(u => u.id === id));
  }

  addUser(userData: Omit<User, 'id' | 'joinedDate' | 'avatarUrl'>): void {
    const newId = Math.max(...this.users.map(u => u.id), 0) + 1;
    const newUser: User = {
      ...userData,
      id: newId,
      joinedDate: new Date(),
      avatarUrl: `../assets/users/user-${newId}.jpg`
    };
    this.users = [...this.users, newUser];
    this.usersSubject.next(this.users);
  }

  updateUser(updatedUser: User): void {
    this.users = this.users.map(u => u.id === updatedUser.id ? updatedUser : u);
    this.usersSubject.next(this.users);
  }

  deleteUser(id: number): void {
    this.users = this.users.filter(u => u.id !== id);
    this.usersSubject.next(this.users);
  }
}