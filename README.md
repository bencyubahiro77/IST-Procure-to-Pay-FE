# Procure-to-Pay Frontend

**Deployed Version:** https://procure-to-pay-yv9h.onrender.com/

A modern, responsive React application for managing the complete procure-to-pay cycle with role-based workflows, automated purchase order generation, and AI-powered receipt validation.

## Features

- **Role-Based Access Control** - Separate dashboards for Staff, Approvers (L1 & L2), and Finance users
- **Purchase Request Management** - Full CRUD operations with multi-level approval workflow
- **Automated PO Generation** - Automatic PDF generation upon final approval
- **AI-Powered Receipt Validation** - Gemini AI validates receipts against purchase orders
- **Real-Time Status Tracking** - Track requests through the entire approval pipeline
- **Currency Support** - All monetary values displayed in RWF (Rwandan Franc)
- **Responsive Design** - Mobile-first design that works seamlessly on all devices
- **Performance Optimized** - Skeleton loaders, lazy loading, and efficient state management

## Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Redux Toolkit** - Centralized state management with async thunks
- **React Router** - Client-side routing with protected routes
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
git clone https://github.com/bencyubahiro77/Procure-to-Pay-FE.git
cd FE
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
VITE_API_BASE_URL=https://ist-procure-to-pay.onrender.com/
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

## Test Credentials

Use these credentials to test different user roles:

### Staff User
```json
{
  "username": "staff_user",
  "password": "password123"
}
```
**Permissions**: Create purchase requests, view own requests, upload receipts, delete pending requests

### Level 1 Approver
```json
{
  "username": "approver1_user",
  "password": "password123"
}
```
**Permissions**: View pending requests, approve/reject at Level 1

### Level 2 Approver
```json
{
  "username": "approver2_user",
  "password": "password123"
}
```
**Permissions**: View pending requests, approve/reject at Level 2, trigger PO generation

### Finance User
```json
{
  "username": "finance_user",
  "password": "password123"
}
```
**Permissions**: View all approved requests, download POs, download receipts, view receipt validation status

## Project Structure

```
FE/
├── src/
│   ├── components/          # Reusable components
│   │   ├── shared/         # Shared components
│   │   │   ├── ConfirmationDialog.tsx
│   │   │   ├── DataTable.tsx
│   │   │   ├── FormField.tsx
│   │   │   ├── InputDialog.tsx
│   │   │   ├── PurchaseRequestItemsTable.tsx
│   │   │   ├── SimpleHeader.tsx
│   │   │   └── StatusBadge.tsx
│   │   └── ui/             # Shadcn/ui components
│   ├── config/             # Configuration files
│   │   ├── api.ts          # API endpoints
│   │   └── axios.ts        # Axios instance with interceptors
│   ├── hooks/              # Custom hooks
│   │   └── use-toast.ts    # Toast notifications hook
│   ├── lib/                # Utility functions
│   │   └── utils.ts        # Tailwind merge utility
│   ├── pages/              # Page components
│   │   ├── dashboard/      # Dashboard pages
│   │   │   ├── ApprovalsPage.tsx
│   │   │   └── FinancePage.tsx
│   │   ├── staff/          # Staff pages
│   │   │   ├── CreateRequestPage.tsx
│   │   │   └── MyRequestsPage.tsx
│   │   └── LoginPage.tsx
│   ├── store/              # Redux store
│   │   ├── actions/        # Async thunk actions
│   │   │   └── purchaseRequestActions.ts
│   │   ├── slices/         # Redux slices
│   │   │   ├── authSlice.ts
│   │   │   └── purchaseRequestSlice.ts
│   │   ├── hooks.ts        # Typed Redux hooks
│   │   └── index.ts        # Store configuration
│   ├── types/              # TypeScript type definitions
│   │   ├── auth.types.ts
│   │   ├── purchaseRequest.types.ts
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
- JWT tokens with refresh token mechanism
- Protected routes with role-based access control
- Automatic redirect on 401 errors
- Persistent login state

### Purchase Request Workflow

#### 1. Staff Creates Request
- Add title, vendor, description
- Add multiple line items (name, quantity, unit price)
- Automatic total calculation
- Two-column responsive form layout

#### 2. Level 1 Approval
- Review request details
- Approve or reject with comments
- Track approval history
- View all items in request

#### 3. Level 2 Approval & PO Generation
- Final approval review
- Automatic PDF PO generation upon approval
- PO contains vendor info, items table, and approval details
- PO stored on Cloudinary

#### 4. Receipt Submission
- Staff uploads receipt after purchase (PDF or image)
- File type validation (PDF, JPEG, PNG, WEBP)

#### 5. AI Receipt Validation
- Gemini AI extracts text from receipt
- Compares against PO details
- Flags discrepancies (amount, vendor, items)
- Finance reviews validation results

#### 6. Finance Dashboard
- View all approved requests
- Download POs and receipts
- Review receipt validation status
- Track financial data

### State Management
- Redux Toolkit for global state
- Async thunks for API calls with proper loading states
- Separate loading states for buttons vs. tables
- Optimistic UI updates with refetch

### Data Tables
- Sorting (multi-column support)
- Global search/filtering
- Column-specific filtering
- Pagination
- Responsive design
- Custom action buttons per row

### Performance Optimization
- Skeleton loaders for better UX during data fetching
- Summary cards with loading placeholders
- Lazy loading for routes (code splitting)
- useMemo for expensive computations
- Efficient data fetching with refetch control

### Security
- JWT authentication
- Protected API routes
- Role-based access control
- Secure file uploads
- Input validation

## User Workflows

### Staff User Workflow
1. **Login** → Navigate to My Requests
2. **Create Request** → Click "New Request"
   - Fill in title, vendor, description
   - Add items with quantity and price
   - Submit request
3. **Track Status** → View request status in table
4. **Upload Receipt** → When approved, upload receipt
5. **Delete Request** → Delete pending requests (before any approvals)

### Approver Workflow (L1 & L2)
1. **Login** → Navigate to Approvals Dashboard
2. **Review Requests** → See pending requests
3. **View Details** → Click eye icon to see full request
4. **Approve/Reject** → 
   - Click approve → Confirm action
   - Click reject → Provide reason
5. **Track Decisions** → See "My Decision" column status

### Finance User Workflow
1. **Login** → Navigate to Finance Dashboard
2. **View Summary** → See total approved requests and amounts
3. **Download PO** → Click "Download PO" for approved requests
4. **Download Receipt** → Click "Receipt" button if submitted
5. **Review Validation** → 
   - See receipt status: Valid, Flagged, or Not Submitted
   - Click info icon to view discrepancies if flagged

## API Integration

The frontend integrates with the Django backend API. Ensure the backend is running before starting the frontend.

### API Endpoints Used

#### Authentication
- `POST /api/accounts/login/` - User login
- `GET /api/accounts/me/` - Get current user info

#### Purchase Requests
- `GET /api/requests/` - Get all requests (filtered by role)
- `POST /api/requests/` - Create new request
- `GET /api/requests/:id/` - Get request details
- `DELETE /api/requests/:id/` - Delete request (staff only, pending)
- `PATCH /api/requests/:id/approve/` - Approve request
- `PATCH /api/requests/:id/reject/` - Reject request
- `POST /api/requests/:id/submit-receipt/` - Upload receipt

## License

This project is part of the Procure-to-Pay application suite.

## Author

Benjamin Cyubahiro
