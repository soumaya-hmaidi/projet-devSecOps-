# Quiz Application Frontend

A modern, responsive quiz application built with Next.js 16, React 19, and TypeScript. This frontend provides a comprehensive quiz management system with role-based access control for both administrators and students.

## 🚀 Features

### Admin Features
- **Dashboard**: Overview of quizzes, users, and system statistics
- **Quiz Management**: Create, edit, view, and delete quizzes
- **Question Management**: Add, edit, and manage questions within quizzes
- **User Management**: View and manage user accounts
- **Analytics**: Track quiz performance and user engagement
- **Real-time Updates**: Live updates for quiz and question modifications

### Student Features
- **Quiz Taking**: Interactive quiz interface with multiple question types
- **Progress Tracking**: Real-time progress indicators
- **Results Review**: Detailed feedback on quiz performance
- **Attempt History**: View past quiz attempts and scores

### Question Types
- **Multiple Choice**: Select one correct answer from multiple options
- **True/False**: Choose between true or false statements
- **Fill in Blank**: Type the correct answer

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI primitives with custom styling
- **State Management**: React Query (TanStack Query) for server state
- **Form Handling**: React Hook Form with Zod validation
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: Sonner for toast notifications

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin-only pages
│   │   ├── analytics/     # Analytics dashboard
│   │   ├── dashboard/     # Admin dashboard
│   │   ├── quizzes/       # Quiz management
│   │   ├── settings/      # System settings
│   │   └── users/         # User management
│   ├── dashboard/         # Student dashboard
│   ├── login/             # Authentication
│   ├── register/          # User registration
│   └── student/           # Student-specific pages
├── components/            # Reusable React components
│   ├── admin/             # Admin-specific components
│   ├── auth/              # Authentication components
│   ├── dev/               # Development utilities
│   ├── landing/           # Landing page components
│   ├── providers/          # Context providers
│   ├── shared/             # Shared components
│   ├── student/            # Student-specific components
│   └── ui/                 # Base UI components
├── hooks/                  # Custom React hooks
├── lib/                    # Utility libraries
│   ├── api/                # API service functions
│   └── ...                 # Other utilities
└── types/                  # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API server running

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd quiz_app/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   NEXT_PUBLIC_APP_NAME=Quiz Application
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 UI Components

The application uses a custom component library built on top of Radix UI primitives:

### Core Components
- **Button**: Various styles and sizes
- **Card**: Content containers with headers and footers
- **Input**: Form input fields with validation
- **Label**: Accessible form labels
- **Badge**: Status indicators and tags
- **Switch**: Toggle controls
- **Avatar**: User profile images
- **Dialog**: Modal dialogs and confirmations

### Admin Components
- **AdminLayout**: Main layout for admin pages
- **AdminSidebar**: Navigation sidebar
- **QuizManagement**: Quiz listing and management
- **QuizForm**: Create/edit quiz forms
- **QuizDetails**: Detailed quiz view
- **QuestionManagement**: Question listing and management
- **QuestionForm**: Create/edit question forms

### Student Components
- **StudentDashboard**: Student overview page
- **QuizInterface**: Interactive quiz taking interface

## 🔌 API Integration

The application integrates with a REST API for all data operations:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout

### Quiz Management
- `GET /api/quizzes` - List all quizzes
- `GET /api/quizzes/:id` - Get quiz details
- `POST /api/quizzes` - Create new quiz
- `PUT /api/quizzes/:id` - Update quiz
- `DELETE /api/quizzes/:id` - Delete quiz

### Question Management
- `GET /api/admin/questions/:id` - Get question details
- `PUT /api/admin/questions/:id` - Update question
- `DELETE /api/admin/questions/:id` - Delete question

### Option Management
- `PUT /api/admin/options/:id` - Update option
- `DELETE /api/admin/options/:id` - Delete option

### Quiz Attempts
- `POST /api/attempts/start` - Start quiz attempt
- `POST /api/attempts/:id/answers` - Submit answer
- `POST /api/attempts/:id/complete` - Complete attempt
- `GET /api/attempts/my-attempts` - Get user attempts

## 🎯 Key Features

### Real-time Updates
- Live option updates as users type
- Instant correct answer selection
- Real-time form validation

### Role-based Access
- Admin users: Full system access
- Student users: Quiz taking and results viewing
- Automatic route protection based on user roles

### Responsive Design
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interfaces

### Form Validation
- Client-side validation with Zod schemas
- Real-time error feedback
- Accessible form controls

## 🔒 Security Features

- JWT-based authentication
- Role-based route protection
- CSRF protection
- Input validation and sanitization
- Secure API communication

## 🧪 Development Features

### Dev Tools
- **DevFormFiller**: Quick credential filling for development
- **React Query DevTools**: API state debugging
- **ESLint**: Code quality enforcement
- **TypeScript**: Type safety and IntelliSense

### Code Quality
- Consistent code formatting
- TypeScript strict mode
- ESLint configuration
- Component-based architecture

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API documentation

## 🔄 Version History

- **v0.1.0** - Initial release with core quiz functionality
- Admin dashboard and quiz management
- Student quiz taking interface
- Question management system
- Real-time updates and validation

---

Built with ❤️ using Next.js, React, and TypeScript
