# Sketch Anything

A web application for sketch practice, designed to help artists improve their skills through timed drawing sessions.

## Features

*   **Customizable Sessions**: Choose your image category, duration per sketch, and number of images.
*   **Timed Workflow**:
    *   **Buffer Phase**: 3-second countdown before each image to get ready.
    *   **Drawing Phase**: Distraction-free image display with a progress bar.
    *   **Countdown**: Non-intrusive 5-second warning in the top-right corner.
*   **Controls**:
    *   **Pause/Resume**: Button at the bottom or `Space` bar.
    *   **Skip**: `Right Arrow` key to jump to the next image.
*   **Local Image Management**: Simply add folders of images to the `data/images` directory.

## Tech Stack

*   **Frontend**: React, TypeScript, Tailwind CSS, Vite.
*   **Backend**: Python, FastAPI.

## Getting Started

### Prerequisites

*   Node.js (v18+)
*   Python (v3.8+)

### Installation & Running

1.  **Start the Backend**
    ```bash
    cd backend
    python3 -m venv .venv
    source .venv/bin/activate  # Windows: .venv\Scripts\activate
    pip install -r requirements.txt
    uvicorn main:app --reload
    ```
    The API will be available at `http://localhost:8000`.

2.  **Start the Frontend**
    Open a new terminal:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    The UI will be available at `http://localhost:5173`.

### Adding Images

1.  Navigate to `data/images/`.
2.  Create a folder for your category (e.g., `landscapes`).
3.  Add your `.jpg` or `.png` files into that folder.
4.  Refresh the web page to see the new category.

## License

MIT

