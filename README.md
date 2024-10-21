# Waitlist Manager

Waitlist Manager is a full-stack application designed to handle the waitlist of a restaurant. It manages seating, queuing for diners. The app replaces the traditional "pen & paper" solution, allowing diners to join a virtual waitlist, check their status, and check in when it's their turn.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [System Architecture](#system-architecture)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Usage](#usage)

## Features

- **Virtual Waitlist**: Diners can join the waitlist by entering their name and party size.
- **Real-time Status Updates**: Diners can check their position in the queue and status in real-time.
- **Check-in System**: When it's their turn, diners can check in to get seated.
- **Automatic Queue Management**: The system manages seat availability when seats are available.

## Tech Stack

- **Frontend**:

  - [Next.js](https://nextjs.org/) (App Router)
  - [React.js](https://reactjs.org/)
  - [TypeScript](https://www.typescriptlang.org/)
  - [Material-UI](https://mui.com/)

- **Backend**:

  - [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
  - [MongoDB](https://www.mongodb.com/)
  - [Mongoose](https://mongoosejs.com/)

## Project Structure

```
waitlist-manager/src
├── app/
│   ├── api/
│   │   └── waitlist/
│   │       ├── join/route.ts
│   │       ├── leave/route.ts
│   │       ├── check-in/route.ts
│   │       └── status/route.ts
│   ├── page.tsx
│   └── layout.tsx
├── components
│   ├── StatusActions.tsx
│   └── WaitlistForm.tsx
├── lib/
│   ├── mongodb.ts
│   ├── constant.ts
│   └── type.ts
└── models/
    └── Party.ts
```

## System Architecture

### Overview

![system-design](/src/img/system.png)

### Frontend Components

- HomePage: Main page where customers can join the waitlist or view their status.
- WaitlistForm: Component for collecting customer name and party size.
- StatusActions: Displays actions based on the customer's current status.

### API Routes

- `/api/waitlist/join`: Handles adding new parties to the waitlist.
- `/api/waitlist/status`: Provides the current status and position in the queue for a party.
- `/api/waitlist/check-in`: Allows parties to check in when their status is Ready.
- `/api/waitlist/leave`: Removes a party from the waitlist.

### Database Model

- `Party` Model: Represents a party in the waitlist with fields like name, partySize, status, etc.

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/YuweiHu/waitlist-manager.git
   cd waitlist-manager
   ```

2. **Install dependencies**:

   ```bash
   yarn
   ```

3. **Database**:

   make sure mongoDB run locally. If you need any help, check [this](https://zellwk.com/blog/local-mongodb/).

## Running the Application

Start the development server:

```bash
yarn dev
```

The application will be running at `http://localhost:3000`.

## Usage

1. **Join the Waitlist**:

   - Open `http://localhost:3000` in your browser.
   - Enter your name.
   - Select your party size.
   - Click on **Join Waitlist**.

2. **Check Status**:

   - After joining, the app will display your current status and position in the queue.
   - The status can be `WAITING`, `READY`, `SERVING`, or `COMPLETED`.

3. **Check-in**:

   - When your status changes to `READY`, a **Check-in** button will appear.
   - Click **Check-in** to confirm your arrival and start the service countdown.

4. **Leave Waitlist**:
   - At any point while waiting, you can click **Leave Waitlist** to remove yourself from the queue.
