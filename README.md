# Advanced Anki

A modern, full-stack application for enhanced flashcard learning and spaced repetition.

## Project Structure

```
.
├── frontend/           # Next.js web application
├── backend/           # FastAPI Python backend
├── mobile/           # Mobile application
└── docs/             # Project documentation
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- Mobile development environment (Android Studio / Xcode)

### Development Setup

#### Backend (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

#### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

#### Mobile App

Instructions for mobile app setup will be added as development progresses.

## Features

- Modern web interface built with Next.js and Tailwind CSS
- Fast and efficient backend with FastAPI
- Cross-platform mobile application
- Advanced spaced repetition algorithms
- Rich media support for flashcards
- Progress tracking and analytics

## Contributing

Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 