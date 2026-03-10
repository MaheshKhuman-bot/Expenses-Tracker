# Expenses Tracker

A full-stack expense tracking application with financial advisory features.

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Express.js + Node.js
- **Database:** SQLite
- **Authentication:** JWT

## Features

- User authentication (login/register)
- Transaction management (income/expenses)
- Financial dashboard with charts
- Budget advisory system
- Settings management

## Local Development

### Backend
```bash
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## Environment Variables

Backend (.env):
```
PORT=3000
JWT_SECRET=your_secret_key
DB_PATH=./database.sqlite
NODE_ENV=development
```

Frontend (frontend/.env):
```
VITE_API_URL=http://localhost:3000/api
```
