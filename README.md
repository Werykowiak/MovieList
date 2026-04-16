# MovieList Application

A full-stack web application for managing a personal movie watchlist with ratings. The application integrates with The Movie Database (TMDB) API to fetch movie information.

## Architecture

| Layer | Technology |
|-------|------------|
| **Frontend** | Angular 21 + Angular Material |
| **Backend** | ASP.NET Core 10.0 |
| **Database** | SQL Server (Entity Framework Core) |
| **API** | RESTful API with OpenAPI/Scalar documentation |

## Project Structure

```
MovieList/
├── MovieListBackEnd/          # ASP.NET Core Web API
│   ├── Controllers/           # API endpoints
│   ├── Dtos/                  # Data Transfer Objects
│   ├── Interfaces/            # Service interfaces
│   ├── Models/                # Entity models
│   ├── Services/              # Business logic
│   ├── Migrations/            # EF Core migrations
│   └── AppDbContext.cs        # Database context
│
└── MovieListFrontEnd/         # Angular SPA
    ├── src/
    │   ├── app/
    │   │   ├── components/    # Angular components
    │   │   ├── Dtos/          # TypeScript interfaces
    │   │   └── services/      # HTTP services
    │   └── environments/      # Environment configs
    └── public/                # Static assets
```

## Getting Started

### Prerequisites

- **.NET 10.0 SDK** or later
- **Node.js 18+** and **npm**
- **SQL Server** (LocalDB, Express, or full instance)
- **Angular CLI** (`npm install -g @angular/cli`)

---

### 1. Backend Setup

#### Configure Database Connection

Edit [appsettings.json](MovieListBackEnd/MovieListBackEnd/appsettings.json):

```json
{
  "ConnectionStrings": {
    "DBConnectionString": "Server=YOUR_SERVER;Database=MovieListDB;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

> **Tip:** For LocalDB use: `Server=(localdb)\\MSSQLLocalDB;Database=MovieListDB;Trusted_Connection=True;TrustServerCertificate=True;`

#### Run Migrations

```powershell
cd MovieListBackEnd/MovieListBackEnd
dotnet ef database update
```

#### Start Backend

```powershell
cd MovieListBackEnd/MovieListBackEnd
dotnet run
```

The API will be available at:
- **HTTPS:** `https://localhost:7001`
- **HTTP:** `http://localhost:5001`
- **API Docs:** `https://localhost:7001/scalar/v1`

---

### 2. Frontend Setup

#### Configure Environment

Copy the example environment file:

```powershell
cd MovieListFrontEnd/src/environments
copy environment_example.ts environment.ts
```

Edit [environment.ts](MovieListFrontEnd/src/environments/environment.ts) with your TMDB API key:

```typescript
export const environment = {
  production: false,
  tmdbApiKey: 'YOUR_TMDB_API_KEY',
  tmdbBaseUrl: 'https://api.themoviedb.org/3',
  apiUrl: 'https://localhost:7001/api'
};
```

> Get a free TMDB API key at: https://www.themoviedb.org/settings/api

#### Install Dependencies

```powershell
cd MovieListFrontEnd
npm install
```

#### Start Frontend

```powershell
cd MovieListFrontEnd
npm start
```

The application will be available at: **http://localhost:4200**



---

## Technologies Used

### Backend
- ASP.NET Core 10.0
- Entity Framework Core 10.0
- SQL Server
- Scalar.AspNetCore (API documentation)

### Frontend
- Angular 21
- Angular Material 21
- RxJS
- TypeScript 5.9

---

## License

This project is for personal use.