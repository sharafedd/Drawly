# Drawly

> A collaborative drawing and sharing application (aka “Drawly”)  
> Built using JHipster (Java + Spring Boot backend, Angular frontend)  
> Repository: [sharafedd/Drawly](https://github.com/sharafedd/Drawly.git)

## Table of Contents
- [Project Overview](#project-overview)  
- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Getting Started](#getting-started)  
  - [Prerequisites](#prerequisites)  
  - [Installation](#installation)  
  - [Running the Application](#running-the-application)  
- [Project Structure](#project-structure)  
- [Testing](#testing)  
- [Deployment](#deployment)  
- [Team](#team)  
- [Contributing](#contributing)  
- [License](#license)  
- [Acknowledgements](#acknowledgements)  

## Project Overview  
“Drawly” is the code name for our team project: a full-stack web application that allows users to draw, share, perhaps collaborate or manage.
This application was scaffolded using JHipster version 7.9.4. :contentReference[oaicite:1]{index=1}  

## Features  
- User registration/login (JWT-based authentication)  
- Drawing canvas in the browser (allowing free-hand, shapes, colours)  
- Save/share drawings with other users  
- Responsive UI built with Angular  
- RESTful backend powered by Spring Boot and Java  

## Tech Stack  
- Frontend: Angular + TypeScript + Webpack  
- Backend: Java (Spring Boot) + Maven  
- Database: SQL (PostgreSQL for production, H2 for development)  
- Tools & utilities: ESLint, Prettier, Husky, Git hooks  
- Containerization: Docker + Docker-Compose  
- Project scaffold: JHipster (monolithic app)  
  :contentReference[oaicite:4]{index=4}  

## Getting Started  

### Prerequisites  
- Java JDK 11 (or whichever version is configured)  
- Maven (e.g., Apache Maven 3.9.4)  
- Node.js + npm (e.g., Node v18.x, npm v8.x)  
  :contentReference[oaicite:5]{index=5}  
- (Optional) Docker & Docker-Compose for containerised deployment  

### Installation  
1. Clone the repository:  
   ```bash  
   git clone https://github.com/sharafedd/Drawly.git  
   cd Drawly  
