<<<<<<< HEAD
# Law Draft

AI-assisted legal drafting platform with authentication, draft management, legal research, document upload analysis, activity resume, and analytics.

## Current Product Status

This README reflects the current working implementation in this repository.

### What works now

- User registration and login with JWT.
- AI draft generation using Gemini with fallback behavior.
- Hierarchical legal case taxonomy:
	- mainCategory
	- subcategory
	- specificType
	- formatted caseType path
- Draft CRUD (create, list, update, delete).
- Proofreading and clause suggestions for draft text.
- Legal research:
	- Case law search
	- Statute search
	- Legal dictionary lookup
- Activity history and resumable workflows from history.
- Document upload and analysis (PDF/image) and draft generation from extracted text.
- Analytics dashboard data API.

## Tech Stack

### Frontend

- React 19
- react-router-dom
- Recharts
- jsPDF, docx, file-saver, html2canvas
- Tailwind CSS (plus existing custom styles)

### Backend

- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- bcryptjs
- Gemini API via @google/generative-ai
- multer for uploads
- pdf-parse for PDF extraction

## Repository Structure

```text
Law/
	backend/
		Server.js
		routes/
		models/
		middleware/
		utils/
		config/
	frontend/
		src/
		public/
	README.md
```

## Prerequisites

- Node.js 20.16+ (recommended because pdf-parse v2 has modern Node engine requirements)
- npm
- MongoDB (Atlas or local)
- Gemini API key

## Setup

### 1) Clone

```powershell
git clone https://github.com/HarikaMurali/Law_Draft.git
cd Law_Draft
```

### 2) Install dependencies

```powershell
cd backend
npm install
cd ..\frontend
npm install
```

### 3) Configure backend environment

Create backend/.env with:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_AI_KEY=your_gemini_api_key
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### 4) Run the app

```powershell
# Terminal 1
cd backend
npm run dev

# Terminal 2
=======
# LexiCraft - Lawyers' Draft Maker 📋⚖️

An AI-powered legal document generation platform that helps lawyers, law students, and legal assistants create professional legal drafts efficiently with comprehensive research tools and template management.

Table of contents
- Overview
- Key Features
- Tech Stack
- Project Structure
- Installation & Setup
- Configuration
- Usage
- API Endpoints
- Deployment
- Contributing
- Known Issues
- Security & License

🎯 Overview
-----------
LexiCraft streamlines legal document creation by combining template-driven drafting, AI assistance, research tools, versioned history, and analytics. Users can generate drafts, run proofreading and clause suggestions, manage templates, and export documents.

### Key Features
- 🤖 AI-Powered Drafting — Generate intelligent legal drafts with AI assistance, proofreading, and clause suggestions
- 🔍 Research Tools — Access case law references and a legal dictionary (placeholder data in some builds)
- 📚 Template Library — Pre-built templates for Contracts, Civil, Criminal workflows
- 💾 Secure Storage — Draft persistence with versioned history
- 📊 Analytics Dashboard — Visual usage and productivity metrics (Recharts)
- 📝 Draft Management — Create, edit, search, export (PDF/DOCX) and delete drafts
- 👤 User Management — JWT auth with secure password hashing
- 🎨 Modern UI — Responsive interface and a Galaxy animation component

🛠️ Tech Stack
---------------
Frontend
- React.js v19
- React Router v7
- Recharts, jsPDF, html2canvas, docx, file-saver
- Tailwind CSS present (project uses inline styles + `App.css` for stability)

Backend
- Node.js + Express
- MongoDB (Mongoose)
- JWT for authentication
- bcryptjs for password hashing

🏗️ Project Structure
--------------------
```
LAW/
├── backend/          # Express server, routes, models
├── frontend/         # React app, components, pages
├── README.md         # Project documentation
└── SECURITY.md       # Security guidance
```

⚙️ Installation & Setup
-----------------------
Prerequisites
- Node.js (v16+ recommended)
- MongoDB (Atlas or local)

Clone repository
```powershell
git clone https://github.com/HarikaMurali/LAW.git
cd LAW
```

Install dependencies
```powershell
cd backend
npm install
cd ../frontend
npm install
```

Environment variables (backend)
Create `backend/.env` with:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key   # optional
PORT=5000
```

Running locally
```powershell
# Terminal 1 - backend
cd backend
npm run dev

# Terminal 2 - frontend
>>>>>>> 66f77381e04af314442a171e9764063c060781d1
cd frontend
npm start
```

<<<<<<< HEAD
Frontend: http://localhost:3000
Backend: http://localhost:5000

## API Overview

All private routes require header:

Authorization: Bearer <token>

### Auth

- POST /api/auth/register
- POST /api/auth/login

### Drafts

- POST /api/drafts
- GET /api/drafts
- GET /api/drafts/:id
- PUT /api/drafts/:id
- DELETE /api/drafts/:id
- GET /api/drafts/debug

### Draft Generation

- POST /api/generate
- POST /api/generate/mock

### Research

- POST /api/research/cases
- POST /api/research/statutes
- POST /api/research/dictionary

### Activity

- GET /api/activity/history
- GET /api/activity/resume/:activityId
- GET /api/activity/stats
- POST /api/activity/log

### Analytics

- GET /api/analytics

### Upload and Document-Based Drafting

- POST /api/upload/analyze
	- multipart/form-data with document field
	- accepts PDF/JPEG/JPG/PNG up to 20 MB
- POST /api/upload/generate-from-document

### Draft Assistance

- POST /api/proofread
- POST /api/suggest-clauses

## Functional Notes

- Default jurisdiction fallback is Karnataka, India in current draft and document flows.
- The app supports both old single caseType input and new hierarchical case classification.
- Research, proofreading, and clause suggestion activities store resume payload so users can continue work from history.
- Upload flow extracts text and can generate a new draft from extracted content and analysis.

## Known Limitations

- Gemini quota/rate limits can affect AI results.
- Some flows use fallback responses when AI calls fail.
- Generated legal content must always be reviewed by a qualified legal professional.

## Scripts

### Backend

- npm run dev

### Frontend

- npm start

## Legal Disclaimer

This project provides AI-assisted drafting and research support. It is not legal advice. Any generated output should be reviewed, validated, and finalized by a qualified legal professional before use.
=======
The frontend is served at `http://localhost:3000` and the backend at `http://localhost:5000` (by default).

🔧 Configuration
----------------
MongoDB
1. Create a cluster on MongoDB Atlas
2. Add database user and network access
3. Use the provided connection string in `backend/.env`

OpenAI (optional)
1. Create an account at OpenAI
2. Add your API key to `backend/.env` if you want AI generation features

🎮 Usage
---------
1. Register/Login
2. Create a draft via Templates or AI generation
3. Edit and save drafts; view history and analytics
4. Export as PDF or DOCX

Sample input
```text
Case Type: Contract Dispute
Parties: ABC Pvt Ltd (Plaintiff) vs XYZ Enterprises (Defendant)
Key Facts: Delivery failure and damages
Jurisdiction: Example State
```

📋 API Endpoints
-----------------
Authentication
- `POST /api/auth/register` — Register user
- `POST /api/auth/login` — Login and receive JWT

Drafts (protected)
- `GET /api/drafts` — List user drafts
- `POST /api/drafts` — Create a draft
- `GET /api/drafts/:id` — Get draft
- `PUT /api/drafts/:id` — Update draft
- `DELETE /api/drafts/:id` — Delete draft

Generation (protected)
- `POST /api/generate` — Generate a draft using AI

🚀 Deployment
-------------
Backend: deploy `backend/` to Heroku / Railway / DigitalOcean and set environment variables.
Frontend: build with `npm run build` and deploy to Netlify / Vercel or serve from backend static host.

🤝 Contributing
----------------
1. Fork the repository
2. Create a feature branch
3. Commit and open a Pull Request

🐛 Known Issues & Limitations
- OpenAI usage has rate limits and costs
- Generated drafts should be reviewed by a qualified lawyer
- Research tool data may be placeholder content in this repo

🔒 Security & License
----------------------
See `SECURITY.md` for security practices.

This project is provided under the MIT License (add a `LICENSE` file to confirm).

⚖️ Legal Disclaimer
-------------------
This application assists with legal drafting using AI. Generated content is provided for convenience and must be reviewed by qualified legal professionals before use. The project authors accept no liability for the legal use of generated drafts.

Authors
-------
- Harika Murali — Lead Developer

Acknowledgments
---------------
- OpenAI, MongoDB, React, Node.js communities

If you want any section restored from your original README verbatim, paste that content here and I will merge it back in.
>>>>>>> 66f77381e04af314442a171e9764063c060781d1
