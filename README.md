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

## License
This project was created as part of the 42 program and is released under the MIT License.

## Descrizione

Questo progetto è un'applicazione web per il gioco Pong, sviluppata nell'ambito del progetto Transcendence. L'obiettivo è permettere agli utenti di giocare a Pong contro altri giocatori in tempo reale tramite una piattaforma online. Il progetto è stato sviluppato utilizzando Django per il backend, JavaScript Vanilla per il frontend e Docker per la containerizzazione.

## Tecnologie Utilizzate

- Backend: Django
- Frontend: JavaScript Vanilla
- Database: PostgreSQL
- Containerizzazione: Docker

Altre librerie: Utilizzo limitato a piccole librerie per compiti specifici

## Moduli Implementati

- **Backend (Django):** Implementazione del backend tramite il framework Django
- **Frontend (Bootstrap + Vanilla JS):** Utilizzo di Bootstrap per migliorare l'interfaccia utente
- **Database (PostgreSQL):** Archiviazione dei dati utente e dei punteggi dei tornei
- **Autenticazione Remota (OAuth 2.0):** Autenticazione tramite OAuth 2.0 con 42 Network
- **Multiplayer (Pong):** Supporto per partite multigiocatore con più di due giocatori contemporaneamente
- **Personalizzazione del Gioco:** Opzioni di personalizzazione per migliorare l'esperienza utente
- **Intelligenza Artificiale (AI Opponent):** Implementazione di un avversario AI per sfidare i giocatori
- **Gestione Log:** Setup dell'infrastruttura per la gestione dei log
- **Monitoraggio:** Implementazione di un sistema di monitoraggio per il controllo dello stato dell'applicazione
- **Grafica Avanzata (3D):** Utilizzo di tecniche avanzate di rendering 3D per migliorare la grafica del gioco
- **Compatibilità Multipiattaforma:** Supporto su tutti i dispositivi e compatibilità con più browser
- **Supporto Multilingua:** Implementazione del supporto per più lingue

## Avvio del Progetto

Per avviare l'applicazione, utilizzare il comando seguente:
```bash
make all
```
Questo comando avvierà il server backend Django, il database PostgreSQL e il server frontend, il tutto in ambienti Docker isolati.

## Funzionalità Principali

Registrazione e Login tramite OAuth 2.0 (42 Network)

Matchmaking automatico per tornei

Supporto per AI come avversario

Interfaccia utente reattiva e moderna

Monitoraggio e gestione dei log

## Licenza

Progetto realizzato nell'ambito del programma 42 e rilasciato sotto licenza MIT.
