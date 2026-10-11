# Task Management Mobile App

A mobile task management application built with **React Native**, **Expo**, and **TypeScript**. It connects to a REST API to let users create an account, sign in, and manage their tasks from an Android or iOS device.

## Features

- User registration and login
- JWT-based authentication
- Secure token storage with `expo-secure-store`
- Create, view, update, complete, and delete tasks
- Search tasks
- Paginated task list
- Loading indicators and toast notifications
- Expo Router navigation

## Tech Stack

- React Native
- Expo
- TypeScript
- Expo Router
- Axios
- Expo SecureStore
- React Native Toast Message
- Node.js / Express REST API (backend)
- Prisma and MongoDB (backend data layer)

## Project Structure

```text
src/
├── api.ts
└── app/
    ├── _layout.tsx
    ├── index.tsx       # Login screen
    ├── register.tsx    # Registration screen
    └── dashboard.tsx   # Tasks dashboard
```

> The structure above reflects the current app layout. Your project may contain additional files.

## Requirements

- Node.js and npm
- Expo Go for quick device testing, or an Android emulator/device
- A running Task Management API backend

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/YOUR_USERNAME/task-management-mobile.git
   ```

2. Enter the project folder:

   ```bash
   cd task-management-mobile
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Configure the backend API URL in `src/api.ts`:

   ```ts
   const API_URL = "http://YOUR_COMPUTER_IP:5000/api";
   ```

   Replace `YOUR_COMPUTER_IP` with the computer's LAN IPv4 address when testing on a physical phone. The phone and computer should be connected to the same Wi-Fi network, and the backend must allow connections on port `5000`.

   - Android emulator: `http://10.0.2.2:5000/api`
   - Physical phone: use the computer's LAN IP, such as `http://192.168.1.10:5000/api` (example only)
   - Production: use your deployed backend's HTTPS URL.

5. Start the Expo development server:

   ```bash
   npx expo start
   ```

   To clear the Metro cache if needed:

   ```bash
   npx expo start --clear
   ```

## Backend API Endpoints

The mobile app expects the backend to provide endpoints similar to these:

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/auth/register` | Register a user |
| `POST` | `/api/auth/login` | Sign in and receive a JWT |
| `GET` | `/api/tasks` | Get the signed-in user's tasks |
| `POST` | `/api/tasks` | Create a task |
| `PATCH` | `/api/tasks/:id` | Update a task or completion status |
| `DELETE` | `/api/tasks/:id` | Delete a task |

The task list supports pagination parameters such as `page` and `limit`, and may support a `search` query parameter depending on the backend implementation.

## Build an Android APK

To create an installable Android APK with Expo Application Services (EAS):

1. Sign in to Expo:

   ```bash
   npx eas-cli login
   ```

2. Configure EAS Build if it has not been configured yet:

   ```bash
   npx eas-cli build:configure
   ```

3. Add or check an APK build profile in `eas.json`:

   ```json
   {
     "build": {
       "preview": {
         "distribution": "internal",
         "android": {
           "buildType": "apk"
         }
       },
       "production": {}
     }
   }
   ```

4. Start the APK build:

   ```bash
   npx eas-cli build --platform android --profile preview
   ```

EAS will provide a build page and download link when the build completes.

## Security Notes

- Do not commit `.env` files, MongoDB credentials, JWT secrets, access tokens, or other secrets to GitHub.
- Do not use a private computer LAN IP for a publicly distributed app. Configure a reachable HTTPS backend URL for production.
- Keep authentication and authorization checks on the backend; hiding screens in the app is not a substitute for API security.

## License

Add a license here if you intend to distribute this project publicly. Until a license is added, no additional license is specified.