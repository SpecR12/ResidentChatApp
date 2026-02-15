# ResidentLive - Residential Communication Platform

**ResidentLive** is a modern, real-time chat application designed for building communities and residential associations. It facilitates instant, secure, and friendly communication between neighbors without the complexity of traditional social networks.

## Key Features

* **Gatekeeper Security:** A unique "Check-Code" system acts as a digital doorman, preventing unauthorized access to the building's chat group.
* **Real-Time Messaging:** Powered by **Socket.io**, messages are delivered instantly with zero latency and no page refreshes.
* **Premium UI/UX:** Features a "Clean Business" & "Glassmorphism" design aesthetic. It is fully responsive (Mobile/Desktop) with smooth animations.
* **Secure Authentication:** Complete Login and Registration system with credential validation.
* **System Notifications:** Elegantly notifies the group when a new resident joins the conversation.

---

## Architecture & Data Flow

The application operates as a unified system (Monolith) in production, where the Node.js backend serves the compiled Angular frontend. Here is how the components interact:

### 1. Backend (Node.js & Express)
The server acts as the application's "brain" with two main responsibilities:
* **API REST:** Handles standard HTTP requests (e.g., `/api/check-code`, `/api/auth`) for authentication and security checks.
* **WebSocket Manager:** Utilizes **Socket.io** to maintain open, bi-directional connections with all clients, enabling message broadcasting.

### 2. Frontend (Angular 17+)
The interface is a **Single Page Application (SPA)**.
* It connects to the server via WebSockets immediately upon loading.
* It leverages **Observables** (RxJS) and **NgZone** to detect incoming data streams and update the UI DOM instantly, bypassing standard browser refresh cycles.

### 3. Data Persistence
* **Users** are stored securely in `users.json`.

I used WebSocket for creation of the app.

---

## Tech Stack

* **Frontend:** Angular 21.1.0, TypeScript, CSS3 (Custom Variables & Animations).
* **Backend:** Node.js, Express.
* **Real-Time Engine:** Socket.io (WebSockets).
* **Version Control:** Git.

---

## Installation & Running Guide

FYI: to pass the /check-code, the code is test1234.

The json have some test users, check users.json

Follow these steps to run the project on your local machine.

### 1. Prerequisites
Ensure you have the following installed:
* [Node.js](https://nodejs.org/) (LTS version recommended)
* [Git](https://git-scm.com/)

### 2. Clone & Install

Open your terminal and run:

```bash
# Clone the repository
git clone https://github.com/SpecR12/ResidentChatApp.git

# Navigate to project folder
cd ResidentChatApp

# Install dependencies (Frontend & Backend)
npm install

# Start server (or if you re in server folder: node server.js)
node server/server.js

# Start the client
npm run start
