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
cd frontend
npm start
```

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