"# Bus Tracking App (MERN)

## Overview
A full-stack bus tracking application built with a React (Vite) frontend and an Express + MongoDB backend. It supports bus CRUD operations and real-time location updates using Socket.io.

## Tech Stack
- **Frontend**
  - React + Vite
  - TailwindCSS
  - React Router
  - Axios
  - Leaflet / React-Leaflet
- **Backend**
  - Node.js + Express
  - MongoDB + Mongoose
  - Socket.io

## Features
- **Bus dashboard** (add buses, list buses)
- **Map preview** (Leaflet map with bus markers)
- **Auth pages** (signup/login)
- **Real-time updates** (Socket.io events for bus location updates)

## Project Structure
- `frontend/` React app (Vite)
- `backend/` Express API + Socket.io server

## Environment Variables
### Backend
Create `backend/.env` (you can copy from `backend/.env.example`):
- `MONGO_URI=mongodb://localhost:27017/bus-tracking-app`
- `PORT=5000`

### Frontend
Optionally create `frontend/.env` (copy from `frontend/.env.example`):
- `VITE_API_BASE_URL=http://localhost:5000`

## Installation
- **Backend**
  - `npm install` inside `backend/`
- **Frontend**
  - `npm install` inside `frontend/`

## Run (Development)
- **Backend (API + Socket.io)**
  - `npm run dev` in `backend/`
- **Frontend**
  - `npm run dev` in `frontend/`

## API (Backend)
Base URL: `http://localhost:5000`

### Bus Routes
- `GET /api/buses` - list buses
- `POST /api/buses` - create bus
- `PUT /api/buses/:id` - update bus
- `DELETE /api/buses/:id` - delete bus

### Auth Routes
- `POST /api/auth/signup` - create user
- `POST /api/auth/login` - login user

## Socket.io Events
- Client emits: `busLocationUpdate` with payload like `{ busId, latitude, longitude }`
- Server broadcasts: `updateBusLocation` with the same payload
