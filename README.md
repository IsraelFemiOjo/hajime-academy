# Hajime Academy – School Management Portal

A full-stack school management portal for secondary schools. Admins manage students, teachers, classes and subjects. Teachers mark attendance and enter results. Students log in to see their own results, attendance and school announcements.

## Tech stack
- Frontend: React, Vite, React Router, Context API, CSS
- Backend: Node.js, Express, MongoDB (Mongoose), JWT authentication
- API documentation: Swagger

## Project structure
- `hajime-frontend` – React application
- `hajime backend` – Express REST API

## Team and contributions

### Frontend
- **Israel Femi-Ojo** (Member 1) – Project setup, Home, About, Login and Register pages, authentication and protected routes, shared layout, loading and error states
- **Progress Reginald** (Member 2) – Admin dashboard, Teachers page, Classes page, Subjects page, Students page, Announcements page, StatCard and AnnouncementList components
- **Adeleye Elizabeth Ometere** (Member 3) – Teacher and Student dashboards, Attendance, Results, My Results and My Attendance pages

### Backend
- **Olachi Okafor** – Authentication and authorization
- **Abiola Abiodun** – Backend development

## Running locally

Backend (copy `.env.example` to `.env` and fill in your own values first):

    cd "hajime backend"
    npm install
    npm run dev

Frontend:

    cd hajime-frontend
    npm install
    npm run dev
