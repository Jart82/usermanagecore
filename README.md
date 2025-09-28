# User Management Dashboard

A clean, responsive, and fully functional User Management Dashboard built with Angular 17+ (Standalone Components) and vanilla CSS 

## Features
🔍 Search users by name or email
🎛️ Filter by permission level (Admin, Contributor, Viewer)
📅 Filter by join year (dynamically generated from data)
📊 Pagination with configurable rows per page (10, 25, 50)
📤 Export user data to CSV
➕ Add New User (UI hook ready for implementation)
🗑️ Delete users with confirmation
🌓 Dark theme with clean, modern UI
📱 Responsive design (works on desktop & tablet)
🧪 40 realistic mock users included


## Architecture

### Folder Structure
\`\`\`
src/
├── app/
│   ├── model/
│   │   └── user.interface.ts        # User data model
│   ├── services/
│   │   └── user.service.ts          # CRUD operations + reactive data
│   ├── components/
│   │   └── user-container/          # Main dashboard component
│   │       ├── user-container.ts
│   │       ├── user-container.html
│   │       └── user-container.css
│   └── db-data.ts                   # 40 mock user records
├── assets/
│   └── users/                       # Placeholder avatar images
├── styles.css                       # Global dark theme variables
└── app.config.ts                    # Standalone app config
\`\`\`

## Getting Started

### Prerequisites
Node.js (v18+)
Angular CLI (v17+)

### Techstack
Framework: Angular 17+ (Standalone Components)
Styling: Pure CSS (no Tailwind, Bootstrap, or SCSS)
State: Reactive BehaviorSubject for real-time updates
Data: In-memory mock database (db-data.ts)
Build: Angular CLI

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `ng serve`
4. Open browser to `http://localhost:4200`






