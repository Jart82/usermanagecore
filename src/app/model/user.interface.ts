export interface User {
    id: number;
  fullName: string;
  email: string;
  location: string;
  joinedDate: Date;
  permissions: 'Admin' | 'Contributor' | 'Viewer';
  avatarUrl?: string;
}
