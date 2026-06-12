# InventoryPro – Real-time Inventory Analytics System

A full-stack SaaS-style inventory management system built with React, Spring Boot, and PostgreSQL.

## Features

* Product Management (Create, Read, Update, Delete)
* Authentication System (Login/Register)
* Real-Time Inventory Analytics
* Low Stock Detection
* Revenue Estimation Dashboard
* Modern SaaS UI
* Command Palette (Cmd + K)
* Responsive Dashboard Design
* REST API Architecture

## Tech Stack

### Frontend

* React.js
* Axios
* CSS3
* Recharts

### Backend

* Spring Boot
* Spring Data JPA
* Hibernate

### Database

* PostgreSQL

## Architecture

Frontend (React)
↓
REST API (Axios)
↓
Spring Boot Backend
↓
PostgreSQL Database

## API Endpoints

### Authentication

POST /auth/login

POST /auth/register

### Products

GET /api/products

POST /api/products

PUT /api/products/{id}

DELETE /api/products/{id}

GET /api/products/low-stock

### Analytics

GET /analytics

GET /analytics/history

## Analytics Features

* Total Products
* Total Inventory Quantity
* Total Inventory Value
* Average Product Price
* Revenue Tracking
* Low Stock Alerts
* Growth Trend Visualization

## Running Locally

### Backend

cd backend

mvn spring-boot:run

### Frontend

cd frontend

npm install

npm start

## Future Improvements

* WebSocket Real-Time Updates
* Role-Based Access Control
* Export Reports (PDF/Excel)
* Advanced Forecasting
* Multi-Warehouse Support

## Project Highlights

This project demonstrates:

* Full-Stack Development
* REST API Design
* Database Integration
* Modern SaaS UI/UX
* Analytics Dashboard Development
* State Management
* Authentication Flows

Built by Sampreet Singh.
