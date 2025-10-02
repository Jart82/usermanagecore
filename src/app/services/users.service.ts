import { Injectable } from '@angular/core';
import { MOCK_USERS } from '../../db-data';
import { User } from '../model/user.interface';
import { BehaviorSubject, Observable, of } from 'rxjs';

const STORAGE_KEY = 'user_management_users';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = this.loadFromStorage() || [...MOCK_USERS];
  private usersSubject = new BehaviorSubject<User[]>(this.users);
  public users$ = this.usersSubject.asObservable();

  constructor() {
    // Save initial state to localStorage
    this.saveToStorage();
  }


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
    this.saveToStorage();
    this.usersSubject.next(this.users);
  }

  updateUser(updatedUser: User): void {
    this.users = this.users.map(u => u.id === updatedUser.id ? updatedUser : u);
    this.saveToStorage();
    this.usersSubject.next(this.users);
  }

  deleteUser(id: number): void {
    this.users = this.users.filter(u => u.id !== id);
    this.saveToStorage();
    this.usersSubject.next(this.users);
  }

  
  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.users));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }

  private loadFromStorage(): User[] | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        // Convert string dates back to Date objects
        return JSON.parse(data).map((user: any) => ({
          ...user,
          joinedDate: new Date(user.joinedDate)
        }));
      }
    } catch (e) {
      console.error('Failed to load from localStorage', e);
    }
    return null;
  }
}