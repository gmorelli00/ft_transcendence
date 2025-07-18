# Transcendence - Pong Web Application

## Description

This project is a web application for the game Pong, developed as part of the Transcendence project. The goal is to allow users to play Pong against other players in real-time via an online platform. The project was developed using Django for the backend, Vanilla JavaScript for the frontend, and Docker for containerization.

## Technologies Used

- Backend: Django
- Frontend: Vanilla JavaScript
- Database: PostgreSQL
- Containerization: Docker

Other Libraries: Limited use of small libraries for specific tasks

## Implemented Modules

- **Backend (Django):** Implementation of the backend using the Django framework
- **Frontend (Bootstrap + Vanilla JS):** Use of Bootstrap to enhance the user interface
- **Database (PostgreSQL):** Storage of user data and tournament scores
- **Remote Authentication (OAuth 2.0):** Authentication via OAuth 2.0 with 42 Network
- **Multiplayer (Pong):** Support for multiplayer games with more than two players at the same time
- **Game Customization:** Options to customize the game to enhance user experience
- **AI Opponent:** Implementation of an AI opponent to challenge players
- **Log Management:** Setup of infrastructure for log management
- **Monitoring:** Implementation of a monitoring system for application state control
- **Advanced Graphics (3D):** Use of advanced 3D rendering techniques to enhance game graphics
- **Cross-Platform Compatibility:** Support for all devices and compatibility with multiple browsers
- **Multilingual Support:** Implementation of support for multiple languages

## Project Setup

To start the application, run the following command:
```bash
make all
```
This command will start the Django backend server, PostgreSQL database, and the frontend server, all in isolated Docker environments.

## Main Features
Registration and Login via OAuth 2.0 (42 Network)

Automatic matchmaking for tournaments

Support for AI as an opponent

Responsive and modern user interface

Log management and monitoring
