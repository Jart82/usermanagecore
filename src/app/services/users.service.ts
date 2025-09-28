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

  constructor() {}

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