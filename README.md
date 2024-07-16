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

