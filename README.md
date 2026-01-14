# Task Management System

## Overview

This is a full-stack Task Management System that allows users to create, manage, and track tasks efficiently. Users can add tasks with details like title, description, priority, status, and due date. The dashboard provides task statistics and filtering options for better organization.

## Tech Stack

- Frontend: React.js
- Backend: Node.js, Express.js
- Database: PostgreSQL (Supabase)

## Setup Instructions

### Backend

1. Clone repository
2. Navigate to backend directory
3. Install dependencies
4. Setup database by creating a project in Supabase and adding your database URL and API key in a `.env` file
5. Start server

### Frontend

1. Navigate to frontend directory
2. Install dependencies
3. Configure API endpoints in `.env` file
4. Start development server

## Features Implemented

- User authentication and login/logout functionality
- Create, read, update, and delete (CRUD) tasks
- Filter tasks by status and priority
- Search tasks by title or description
- Dashboard showing task statistics (total, pending, in progress, completed)

**Future enhancement:**

- Drag-and-drop task prioritization
- Notifications for upcoming due dates
- User roles and permissions

## Challenges and Solutions

1. Challenge: Ensuring that newly created tasks update the dashboard immediately without refreshing.  
   Solution: Used a callback prop from the TaskForm to update the parent Dashboard state after a successful task creation.

2. Challenge: Managing API calls and token authentication securely for both frontend and backend.  
   Solution: Created a reusable apiRequest function that attaches the JWT token and handles errors consistently across all API calls.
