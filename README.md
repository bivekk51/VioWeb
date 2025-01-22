
# Violence Detection System

A system designed to detect violent activities in video files, featuring a React.js frontend and a Flask backend integrated with machine learning models for video analysis.

---

## Features
- Record videos using the webcam or upload existing video files.
- Analyze videos for violent activities using a trained model.
- Display accuracy metrics (highest accuracy and average accuracy).
- Integrated alert mechanism for specific accuracy thresholds.

---

## Prerequisites
Ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [Python](https://www.python.org/) (v3.8 or higher)
- [pip](https://pip.pypa.io/en/stable/) (Python package installer)

---

## Installation and Setup

### 1. Clone the Repository
```bash
git clone https://github.com/bivekk51/violence-detection-system.git
cd violence-detection-system
```

---

### 2. Backend Setup (Flask)

#### Navigate to the `backend` Directory
```bash
cd backend
```

#### Create and Activate a Virtual Environment
```bash
# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### Install Dependencies
```bash
pip install -r requirements.txt
```

#### Run the Backend Server
```bash
python server.py
```
By default, the backend server will run on `http://127.0.0.1:5000`.

---

### 3. Frontend Setup (React)

#### Navigate to the `frontend` Directory
```bash
cd ../frontend
```

#### Install Dependencies
```bash
npm install
```

#### Start the Frontend Server
```bash
npm start
```
By default, the frontend server will run on `http://localhost:3000`.

---

## Running the Application

1. Start the **backend server**:
   ```bash
   python server.py
   ```
2. Start the **frontend server**:
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to use the application.

---

## Project Structure

```
violence-detection-system/
├── backend/
│   ├── uploads/
│   ├── image.py
│   ├── server.py
│   ├── video.py
│   ├── requirements.txt
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── README.md
├── README.md
```

---

## API Endpoints

### Backend Endpoints
1. **`POST /upload`**  
   - Accepts video files for analysis.
   - Returns accuracy metrics.

---

## Troubleshooting

### Common Issues
1. **CORS Errors**:  
   Ensure you have enabled CORS in your Flask backend. You can use the `flask-cors` library.

2. **Port Conflicts**:  
   Ensure no other services are using ports `3000` (frontend) or `5000` (backend).

---

## Contributing

We welcome contributions! Feel free to submit a pull request or report issues in the repository.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

