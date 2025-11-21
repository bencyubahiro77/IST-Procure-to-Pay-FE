# ISTFrontend

A modern, responsive React application for managing loans and borrowers with AI-powered insights.

## Features

- **Beautiful Landing Page** - Engaging landing page with blue-themed design
- **Secure Authentication** - OTP-based login with HttpOnly cookies for enhanced security
- **Dashboard** - Comprehensive dashboard with sidebar navigation
- **Borrowers Management** - Full CRUD operations with advanced table features
- **Loans Tracking** - Manage loans with status tracking and analytics
- **Admin Panel** - User management for administrators
- **Responsive Design** - Mobile-first design that works on all devices
- **Performance Optimized** - Lazy loading, code splitting, and memoization

## Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Redux Toolkit** - State management
- **React Router** - Client-side routing with lazy loading
- **Axios** - HTTP client with interceptors
- **TanStack Table** - Powerful data tables with sorting, filtering, and pagination
- **Shadcn/ui** - Beautiful, accessible UI components
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible component primitives
- **Lucide React** - Beautiful icon library

## Getting Started

### Prerequisites

- Node.js 18+ (or compatible version)
- npm or yarn
- Backend API running (default: http://localhost:8000)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd ISTFE
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
```

Edit `.env` and set your backend API URL:
```env
VITE_API_BASE_URL=http://localhost:8000
```

4. Start the development server
```bash
npm run dev
```

The application will be available at http://localhost:5173

### Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
ISTFE/
├── src/
│   ├── components/          # Reusable components
│   │   ├── layout/         # Layout components (Dashboard, Sidebar)
│   │   ├── ui/             # Shadcn/ui components
│   │   └── ProtectedRoute.tsx
│   ├── config/             # Configuration files
│   │   ├── api.ts          # API endpoints
│   │   └── axios.ts        # Axios instance with interceptors
│   ├── lib/                # Utility functions
│   │   └── utils.ts        # Tailwind merge utility
│   ├── pages/              # Page components
│   │   ├── dashboard/      # Dashboard pages
│   │   │   ├── BorrowersPage.tsx
│   │   │   ├── LoansPage.tsx
│   │   │   └── UsersPage.tsx
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   └── SignupPage.tsx
│   ├── store/              # Redux store
│   │   ├── slices/         # Redux slices
│   │   │   ├── authSlice.ts
│   │   │   ├── borrowersSlice.ts
│   │   │   ├── loansSlice.ts
│   │   │   └── usersSlice.ts
│   │   ├── hooks.ts        # Typed Redux hooks
│   │   └── index.ts        # Store configuration
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx             # Main app component with routing
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles with Tailwind
├── .env                    # Environment variables
├── .env.example            # Environment variables template
├── tailwind.config.js      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
└── package.json            # Dependencies and scripts
```

## Key Features Implementation

### Authentication
- HttpOnly cookies for secure token storage
- OTP-based login flow
- Protected routes with role-based access control
- Automatic redirect on 401 errors

### State Management
- Redux Toolkit for global state
- Async thunks for API calls
- Proper error handling
- Loading states

### Data Tables
- Sorting (multi-column support)
- Global search/filtering
- Column-specific filtering
- Pagination
- Responsive design

### Performance Optimization
- Lazy loading for routes (code splitting)
- useMemo for expensive computations
- Optimized re-renders
- Efficient data fetching

### Security
- HttpOnly cookies (not accessible via JavaScript)
- CSRF token support
- Secure API communication
- Input validation

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

The frontend integrates with the ISTBackend API. Ensure the backend is running before starting the frontend.

### API Endpoints Used

- **Auth**: `/auth/req-login-otp`, `/auth/login`, `/auth/register`
- **Users**: `/user/get-users`, `/user/update-user/:id`, `/user/delete-user/:id`
- **Borrowers**: `/borrower/get-borrowers`, `/borrower/create-borrower`, `/borrower/delete-borrower/:id`
- **Loans**: `/loan/get-my-loans`, `/loan/create-loan`

## User Roles

### Regular User
- Manage their own borrowers
- Track their own loans
- View dashboard analytics

### Admin
- All regular user permissions
- Manage all users
- View system-wide analytics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is part of the ISTapplication suite.

## Author

Benjamin Cyubahiro
