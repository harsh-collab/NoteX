# ✨ NoteX – AI Powered Handwritten Notes to LaTex Code Converter

<div align="center">

![React](https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge\&logo=react)
![Flask](https://img.shields.io/badge/Backend-Flask-black?style=for-the-badge\&logo=flask)
![Vite](https://img.shields.io/badge/Built%20With-Vite-purple?style=for-the-badge\&logo=vite)
![Python](https://img.shields.io/badge/Python-3.11-yellow?style=for-the-badge\&logo=python)
![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-white?style=for-the-badge\&logo=vercel)

### 🚀 Convert handwritten notes into editable digital latex code using AI-powered OCR

</div>

---

# 📌 Overview

**NoteX** is a full-stack AI-powered handwritten notes digitizer that extracts text from handwritten images using OCR and converts them into editable, searchable, and downloadable LaTex Code.

The application uses:

* 🧠 AI-powered OCR for handwriting recognition
* ✍️ Spell correction for cleaner extracted text
* 📄 PDF export support
* 🖼️ Image upload and preview system
* 📚 History tracking of scanned notes
* ☁️ Full deployment using Render and Vercel

---

# 🌟 Features

✅ Upload handwritten note images
✅ AI-based handwriting recognition using EasyOCR
✅ Automatic spelling correction
✅ Download extracted notes as PDF
✅ View previous scans in History page
✅ Image preview support
✅ Modern responsive UI
✅ Full-stack deployment support

---

# 🛠️ Tech Stack

## Frontend

* React.js
* Vite
* Axios
* React Router DOM
* CSS

## Backend

* Flask
* Flask-CORS
* EasyOCR
* OpenCV
* NumPy
* Pillow
* PySpellChecker
* ReportLab
* Gunicorn

## Deployment

* Frontend → Vercel
* Backend → Render

---

# 🧠 How It Works

1. User uploads a handwritten image.
2. Backend processes image using OpenCV.
3. EasyOCR extracts handwritten text.
4. SpellChecker improves text quality.
5. Extracted notes are displayed instantly.
6. User can:

   * Download PDF
   * View history
   * Preview uploaded images

---

# 📂 Project Structure

```bash
NoteX/
│
├── notex-frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── notex-backend/
│   ├── uploads/
│   ├── app.py
│   ├── requirements.txt
│   ├── Procfile
│   └── runtime.txt
│
└── README.md
```

---

# ⚙️ Installation & Setup

## 🔹 Clone Repository

```bash
git clone https://github.com/harsh-collab/NoteX.git
cd NoteX
```

---

# 🔹 Frontend Setup

```bash
cd notex-frontend
npm install
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# 🔹 Backend Setup

```bash
cd notex-backend
python -m venv venv
```

## Activate Virtual Environment

### Windows

```bash
venv\Scripts\activate
```

### Mac/Linux

```bash
source venv/bin/activate
```

## Install Dependencies

```bash
pip install -r requirements.txt
```

## Run Backend

```bash
python app.py
```

Backend runs on:

```bash
http://localhost:5000
```

---

# ☁️ Deployment

## 🚀 Backend Deployment (Render)

### Build Command

```bash
pip install -r requirements.txt
```

### Start Command

```bash
gunicorn app:app
```

---

## 🚀 Frontend Deployment (Vercel)

### Build Command

```bash
npm run build
```

### Output Directory

```bash
dist
```

---

# 📸 Screenshots

## 🏠 Login Page

*Add screenshot here*

## 📤 Upload Notes

*Add screenshot here*

## 📜 OCR Output

*Add screenshot here*

## 📚 History Page

*Add screenshot here*

---

# 📈 Future Improvements

* 🌍 Multi-language OCR support
* 📱 Mobile application
* ☁️ Cloud storage integration
* 🔐 Authentication system
* 🧾 Better handwriting correction model
* 📊 Analytics dashboard

---

# 👨‍💻 Author

## Harsh Saraswat

### MCA Student | Full Stack Developer | AI/ML Enthusiast

* 💻 Passionate about AI-powered applications
* 🚀 Interested in Full Stack Development & Machine Learning
* 🧠 Building real-world AI solutions

---

# 🔗 Links

## 🌐 Live Frontend

Add your Vercel URL here

## ⚙️ Backend API

Add your Render URL here

## 📂 GitHub Repository

[https://github.com/harsh-collab/NoteX](https://github.com/harsh-collab/NoteX)

---

# ⭐ Support

If you like this project, give it a ⭐ on GitHub.

---

<div align="center">

### ✨ Built using React, Flask & AI ✨

</div>
