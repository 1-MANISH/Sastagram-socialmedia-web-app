
# Sastagram - SnapFlow – Social Media Web Application

SnapFlow is a full-stack social media web application similar to Instagram.
Users can create image and video posts, follow other users, interact through likes and comments,
and receive live notifications.

## Features

### User Features
- Authentication (Signup/Login)
- Profile Management
- Follow/Unfollow Users
- Live Follow Requests
- User Suggestions

### Posts
- Image Posts
- Video Posts
- Feed System

### Interactions
- Like/Dislike Posts
- Live Comments
- Real-time Updates

### Notifications
- Follow Notifications
- Like Notifications
- Comment Notifications

### Real-Time
- Live Follow Requests
- Live Notifications
- Live Comments
- Live Likes

## Tech Stack

Frontend:
- React
- Redux
- SCSS

Backend:
- Node.js
- Express.js
- MongoDB

Real-Time:
- Socket.IO

## Project Structure

SnapFlow/

├── client/

│   ├── public/

│   ├── src/

│   │   ├── assets/

│   │   ├── components/

│   │   ├── pages/

│   │   ├── redux/

│   │   ├── utils/

│   │   ├── App.js

│   │   ├── App.scss

│   │   ├── index.js

│   │   └── index.scss
│
├── server/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routers/
│   ├── utils/
│   ├── dbConnect.js
│   ├── index.js
│   └── package.json

## Installation

Clone Repository

git clone <your-repo-link>

Install Client

cd client
npm install

Install Server

cd server
npm install

## Run Project

Start Backend

cd server
npm start

Start Frontend

cd client
npm start

## Environment Variables

Create .env inside server folder

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret

## Author

Manish Patidar
Full Stack Developer
