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
* **Harsh Handoor** - Frontend Developer (Client WebSockets)
