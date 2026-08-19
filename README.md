# 🚀 Real-Time Notification Engine
*A scalable, event-driven notification system built for high-throughput messaging.*

## 📌 Overview
This project is a robust, real-time notification service designed to instantly deliver messages to thousands of connected users across multiple devices. 

Traditional web applications often rely on HTTP polling (constantly asking the server if there are new updates), which drains server resources and increases latency. This project solves that problem by implementing an **event-driven architecture**, allowing the server to push notifications to clients the exact millisecond an event occurs.

## 🛠️ Tech Stack
* **Message Broker:** Redis (Pub/Sub)
* **Backend Runtime:** Node.js
* **Real-Time WebSockets:** Socket.io
* **Frontend:** HTML/JS

## 🧠 System Architecture
To achieve true scalable communication, this system utilizes **Redis Pub/Sub** as its core message broker. 

*Why Redis?* By decoupling the publisher from the web server, we ensure that the system can be scaled horizontally. Multiple Node instances can subscribe to the same Redis cluster without dropping messages.

## 👥 The Team
Developed as an interim submission for the Cipher Schools Campus Ambassador Program.

* **Stephen Raj** - Team Lead & Data Architecture
* **Arnav** - Backend Developer (Node.js & Socket.io)
* **Harsh Handore** - Frontend Developer (Client WebSockets)

---

## 📁 Project Structure

```text
realtime-notification-system/
├── frontend/             # Frontend UI (HTML5, CSS3, Vanilla JS + Socket.io)
│   ├── index.html        # Live notification dashboard & feed
│   ├── style.css         # Modern UI styles
│   └── app.js            # WebSocket client & event renderer
├── publisher/            # Redis Event Publisher
│   ├── package.json
│   └── publisher.js      # Simulates event generation to Redis Pub/Sub
└── README.md
```

## 🚀 Quick Start Guide

### 1. Start the Publisher
```bash
cd publisher
npm install
node publisher.js
```

### 2. Open the Frontend Dashboard
* Open [`frontend/index.html`](frontend/index.html) in your browser.
* Point the socket server URL in the UI to your Socket.io backend instance (e.g. `http://localhost:3000`) and click **Connect**.
