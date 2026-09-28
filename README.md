# TskManager

A full stack task management application built with **.NET 10** and **React 19**, featuring JWT authentication, per-user task ownership, and a responsive UI.

## 🎯 Features

- 🔐 User registration and login with JWT authentication
- 🔒 Password hashing with BCrypt
- 📝 Full CRUD for tasks (create, read, update, delete)
- ✅ Mark tasks as completed
- 👤 Per-user task isolation (each user only sees their own tasks)
- 🎨 Responsive UI with Tailwind CSS
- 🛡️ Protected routes on the frontend
- 🔄 Automatic token injection in HTTP requests
- 🚪 Automatic redirect to login on 401 responses

## 🛠️ Tech Stack

### Backend
- **.NET 10** (LTS)
- **ASP.NET Core Web API**
- **Entity Framework Core 10**
- **SQL Server (LocalDB)**
- **JWT** for authentication
- **BCrypt.Net** for password hashing
- **Swashbuckle** for API documentation

### Frontend
- **React 19**
- **TypeScript**
- **Vite 8**
- **React Router 7**
- **Tailwind CSS 4**
- **Axios**

## 📁 Project Structure

```
TskManager/
├── TskManager.API/                  # Backend (.NET 10 Web API)
│   ├── Controllers/                 # API endpoints (Auth, Tasks)
│   ├── Data/                        # EF Core DbContext
│   ├── DTOs/                        # Data Transfer Objects
│   ├── Migrations/                  # EF Core migrations
│   ├── Models/                      # Domain entities (User, TaskItem)
│   ├── Properties/                  # Launch settings
│   ├── Services/                    # JWT token generation
│   ├── Program.cs                   # Application entry point
│   ├── appsettings.json             # Configuration
│   └── TskManager.API.csproj        # Project file
└── tskmanager-client/               # Frontend (React + TypeScript)
    ├── public/                      # Static assets (favicon, icons)
    ├── src/
    │   ├── assets/                  # Images and SVGs
    │   ├── components/              # Reusable components (ProtectedRoute)
    │   ├── context/                 # React context (AuthContext)
    │   ├── pages/                   # Page components (Login, Register, Tasks)
    │   ├── services/                # API client (axios)
    │   ├── types/                   # TypeScript types
    │   ├── App.tsx                  # Root component with routes
    │   ├── main.tsx                 # React entry point
    │   └── index.css                # Tailwind CSS import
    ├── index.html                   # HTML template
    ├── package.json                 # Dependencies and scripts
    ├── tsconfig.json                # TypeScript configuration
    └── vite.config.ts               # Vite + Tailwind configuration
```

> **Note:** `bin/`, `obj/`, and `node_modules/` are auto-generated and excluded from the repository via `.gitignore`.

## 🚀 Getting Started

### Prerequisites
- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js LTS](https://nodejs.org/)
- SQL Server Express LocalDB (comes with Visual Studio)

### Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd TskManager.API
   ```

2. Apply database migrations:
   ```bash
   dotnet ef database update
   ```

3. Run the API:
   ```bash
   dotnet run
   ```

4. The API will be available at `https://localhost:7234`. Open Swagger at `https://localhost:7234/swagger`.

### Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd tskmanager-client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser.

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive a JWT |

### Tasks (requires JWT)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks for the authenticated user |
| GET | `/api/tasks/{id}` | Get a specific task |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/{id}` | Update a task |
| DELETE | `/api/tasks/{id}` | Delete a task |

## 🔐 Authentication Flow

1. User registers or logs in via the frontend.
2. Backend validates credentials and returns a JWT.
3. Frontend stores the JWT in `localStorage`.
4. Axios interceptor attaches the JWT to every subsequent request.
5. Backend validates the JWT and extracts the user id from claims.
6. Each task is scoped to its owner via the `UserId` foreign key.

## 📸 Screenshots

*Coming soon*

## 📄 License

This project is open source and available under the MIT License.