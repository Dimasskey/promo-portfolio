# Promo Portfolio

Interactive promotional web application with gamification mechanics, mini-games, rewards and a multi-stage user progression system.

## Overview

Promo Portfolio is a responsive promotional web application built around interactive gamification mechanics.

Users can register, complete mini-games, collect rewards, progress through different stages and interact with supplier pages.

The portfolio version of the project was adapted to work without a backend. User data and application progress are stored locally in the browser using LocalStorage.

## Features

* User registration and login
* User progress tracking
* Four interactive mini-games
* Treasure game
* Tic-Tac-Toe
* Puzzle game
* Find the Differences game
* Reward system
* Collectible ball system
* Progress bar
* Two-stage progression
* Supplier page
* User reviews
* Responsive layout for desktop and mobile devices
* Local data persistence using LocalStorage

## Tech Stack

* HTML5
* CSS3
* JavaScript
* LocalStorage

## Project Structure

```text
promo-portfolio/
├── static/
│   ├── css/
│   ├── images/
│   └── js/
├── templates/
│   ├── supplierPage.html
│   └── ...
├── index.html
├── login.html
└── README.md
```

## Data Storage

The original project relied on backend APIs.

For the portfolio version, the application was adapted to work independently without a backend.

The following data is stored locally using LocalStorage:

* User information
* Authentication state
* Game progress
* Completed mini-games
* Rewards
* Registered receipts
* User reviews

## Running Locally

Clone the repository:

```bash
git clone https://github.com/Dimasskey/promo-portfolio.git
```

Open the project folder:

```bash
cd promo-portfolio
```

Run the project using a local development server.

For example, you can use the Live Server extension in Visual Studio Code.

## Project Type

This is an interactive promotional web application developed as a commercial project and adapted for portfolio purposes.
