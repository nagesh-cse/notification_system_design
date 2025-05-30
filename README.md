# 🔔 Real-Time Notification System with Batched Likes (POC)

This project demonstrates a real-time notification system with a backend queuing mechanism, Redis-based batching, and real-time delivery using Socket.IO. The system supports grouping multiple "like" actions into a single notification and ensures no notifications are lost even under rapid user interactions.

---

## 🚀 Features

- Real-time notifications via WebSockets
- Like batching system with Redis Sets
- Batched notifications sent every 20 seconds
- MongoDB persistence for historical notifications
- React frontend with simulated user selection (Fake Authentication for 3 Users for demonstration purpose)
- Manual Redis cleanup (no expire()) to avoid notification loss

---

## 🧱 Stack

### 🔧 Backend
- Node.js + Express
- MongoDB + Mongoose
- Redis (Upstash) + BullMQ
- Socket.IO (WebSocket server)

### 🖥️ Frontend
- React + Vite
- Socket.IO Client

---

## 🛠️ Setup Instructions

### 📁 1. Clone the Repo
```bash
git clone https://github.com/nagesh-cse/notification_system_design.git
cd notification_system_design
```

### ⚙️ 2. Configure Environment Variables

#### Backend `.env`
```
MONGO_URI=mongodb+srv://your_user:your_pass@cluster.mongodb.net/notifications?retryWrites=true&w=majority
REDIS_URL=rediss://default:<password>@<host>.upstash.io:6379
PORT=1234
```


### 📦 3. Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd ../frontend
npm install
```

### 🔁 4. Run Backend and Worker

In one terminal:
```bash
cd backend
npm run dev
```

In another terminal:
```bash
cd backend
node worker/processor.js
```

### 💻 5. Run Frontend
```bash
cd frontend
npm run dev
```

Open: [http://localhost:5173](http://localhost:5173)

---

## 🧪 How It Works

1. **User selects an identity** on the UI (e.g., `user1`)
2. The client joins a Socket.IO room (`join(userId)`)
3. When another user likes a post:
   - The like is stored in a Redis Set
   - A delayed job is scheduled via BullMQ (20s window)
4. The worker reads from the Redis Set, groups users, sends one notification
5. Notification is:
   - Saved in MongoDB
   - Pushed to the frontend in real-time

---

## 🔄 Batching Logic

- Redis Set: `likes:<to_user>:<post_id>`
- Likes are added to the set on `/like`
- If no job exists, one is scheduled (delay: 20s)
- After job runs, it deletes the set manually
- New like after that triggers a fresh batch job

---

## ✨ Example Notification Messages
- `user1 liked your post`
- `user1 and user2 liked your post`
- `user1, user2 and 3 others liked your post`

---

## 📌 TODO / Improvements
- Add support for comments and follows
- Add notification read/unread status toggle in frontend
- Use real auth instead of simulated user context
- UI notifications (toast or badge)

---



