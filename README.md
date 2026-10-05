# Hajime Academy – School Management Portal

A full-stack school management portal for secondary schools. Admins manage students, teachers, classes and subjects. Teachers mark attendance and enter results. Students log in to see their own results, attendance and school announcements.

## Live links
- Live site: https://hajime-academy.vercel.app
- Backend API: https://hajime-academy.onrender.com
- API documentation (Swagger): https://hajime-academy.onrender.com/api-docs

## Demo logins (test accounts only)
- Admin: admin@hajime.com / admin123
- Teacher: tolu@hajime.com / teacher123
- Student: chidi@hajime.com / student1

The backend is on Render's free plan, so the first request after a period of no use can take up to a minute to load.

## Tech stack
- Frontend: React, Vite, React Router, Context API, CSS
- Backend: Node.js, Express, MongoDB (Mongoose), JWT authentication
- API documentation: Swagger

## Project structure
- `hajime-frontend` – React application
- `hajime backend` – Express REST API

## Team and contributions

### Frontend
- **Israel Femi-Ojo** – Project setup, Home, About, Login and Register pages, authentication and protected routes, shared layout, loading and error states
- **Progress Reginald** – Admin dashboard, Teachers page, Classes page, Subjects page, Students page, Announcements page, StatCard and AnnouncementList components
- **Adeleye Elizabeth Ometere** – Teacher and Student dashboards

### Backend
- **Olachi Okafor** – Authentication and authorization, announcements, and combining and uploading the full backend
- **Abiola Abiodun** – Teacher, class and subject management
- **Chimuanya JB Okoye** – Student management
- **Isang Udemeobong** – Attendance
- **Leeroy Isibor** – Results, grades and result history
- **Winner Chatkazzah Patrick** – Integration, validation, security and documentation

## Note on contributions

All team members contributed to this project. On the backend, each member worked on their assigned part and shared it with Olachi Okafor, who combined and uploaded the complete backend. Some members could not upload their own work directly because of challenges during the project period, including laptop problems, health issues, and members being away at NYSC camp. For the same reason, one frontend member's work was uploaded on their behalf and credited to them as a co-author on the commit. The Team and contributions section above lists each person's part.

## Running locally

Backend (copy `.env.example` to `.env` and fill in your own values first):

    cd "hajime backend"
    npm install
    npm run dev

Frontend:

    cd hajime-frontend
    npm install
    npm run dev
