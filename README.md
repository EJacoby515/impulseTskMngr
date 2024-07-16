# Task Manager App

A React Native mobile application for managing tasks and competing on a leaderboard.

## Features

- User Authentication (Sign up, Login, Logout)
- Create, Read, Update, and Delete tasks
- Mark tasks as completed
- Leaderboard showing top users based on completed tasks
- Filter leaderboard by daily, weekly, and monthly periods

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- React Native CLI
- iOS Simulator or Android Emulator

## Installation

1. Clone the repository:
git clone https://github.com/EJacoby515/impulseTskMngr.git
cd impulseTskMngr

2. Install dependencies:

npm install

or 

yarn install


3. Set up Firebase:
- Create a new Firebase project
- Add your Firebase configuration to `Firebase.js`

## Running the App

For iOS:
npx react-native run-ios
For Android:
npx react-native run-android

## Project Structure

- `App.js`: Main component
- `Firebase.js`: Firebase configuration and utility functions
- `components/`: React components
- `AuthScreens.js`: Authentication screens
- `Colors.js`: Color palette for the app

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Environment Setup

Create a .env file in the root directory with the following variables:

API_KEY=your_api_key
AUTH_DOMAIN=your_auth_domain
PROJECT_ID=your_project_id
STORAGE_BUCKET=your_storage_bucket
MESSAGING_SENDER_ID=your_messaging_sender_id
APP_ID=your_app_id
MEASUREMENT_ID=your_measurement_id