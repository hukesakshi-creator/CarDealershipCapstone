# Car Dealership Application
# fullstack_developer_capstone

**Repository name:** `xrwvm-fullstack_developer_capstone`

**Project name:** `fullstack_developer_capstone`

## Project Description

This project is a full-stack car dealership application developed as part of the Full Stack Developer Capstone. It includes a Django backend, a frontend interface, and API functionality for accessing dealership information.
A learning capstone starter that combines a Django web application, React registration component, and Express REST API for car dealers, reviews, car makes/models, authentication demos, and sentiment analysis.

## Technology
- Django (web pages and lightweight application endpoints)
- React source component for registration (`server/frontend/src/components/Register/Register.jsx`)
- Express REST API (`express-api/`) with seed data and optional MongoDB connection support
- GitHub Actions CI workflow

## Run locally (Windows PowerShell)
### 1. Django website
```powershell
cd server
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```
Open http://127.0.0.1:8000/ . Django admin is at http://127.0.0.1:8000/admin/ .

### 2. Express API (second terminal)
```powershell
cd express-api
npm install
npm start
```
API base: http://localhost:5000/api

Useful endpoints:
- `GET /api/dealers`
- `GET /api/dealers/1`
- `GET /api/dealers/1/reviews`
- `GET /api/dealers/state/Kansas`
- `GET /api/car-makes`
- `GET /api/car-models`
- `POST /api/login` JSON: `{"username":"root","password":"root123"}`
- `POST /api/logout` JSON: `{"username":"root"}`
- `POST /api/analyze-review` JSON: `{"review":"Fantastic services"}`

Seed demo credentials are for local coursework only. Do not use them in a real deployment.

## GitHub
Create a public repository, then from this folder:
```powershell
git init
git add .
git commit -m "Build car dealership capstone"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

## Deployment
`render.yaml` is a starting point for deploying the Django web service and Express API separately on Render. Set `API_BASE_URL` in the Django service to the deployed Express API URL. Deployment providers may require plan/configuration adjustments; the deployment URL must be copied from your own successful deployment.

## Submission evidence
Run the application and capture real screenshots with the browser address bar visible wherever the rubric asks for it. Save actual terminal outputs from your own runs into the named evidence files. Do not submit sample or fabricated logs as real results.
