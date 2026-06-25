# Lead Management & Email Tracking System

This repository contains a full-stack Lead Management and Email Tracking System.

Tech stack:
- Frontend: React + Vite (deploy to Vercel)
- Backend: Node.js + Express (deploy to Render)
- Database: MongoDB
- Email: Nodemailer (SMTP)

Environment variables (backend): see `backend/.env.example`.

Deploy:
- Frontend: set `VITE_BACKEND_URL` to your backend URL and deploy to Vercel.
- Backend: create a Render Web Service, set `MONGODB_URI`, `BACKEND_URL`, `FRONTEND_URL`, and SMTP credentials.
