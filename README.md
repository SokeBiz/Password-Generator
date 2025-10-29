# Password Generator

A simple, secure password generator built with Next.js and React. Generate strong passwords right in your browser without sending any data to external servers.

## What it does

This app lets you create random passwords with customizable length. You can choose anywhere from 6 to 64 characters, and the generator uses cryptographically secure randomness to ensure your passwords are truly random and secure.

## Features

- **Secure generation**: Uses the browser's built-in crypto API for truly random passwords
- **Customizable length**: Pick any length between 6 and 64 characters
- **One-click copying**: Copy passwords to your clipboard with a single click
- **Dark mode**: Toggle between light and dark themes
- **Privacy focused**: Everything happens in your browser, no data leaves your device
- **Responsive design**: Works great on desktop and mobile

## How to run it

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## How it works

The password generator creates passwords using a combination of:
- Lowercase letters (a-z)
- Uppercase letters (A-Z) 
- Numbers (0-9)
- Special symbols (!@#$%^&*()-_=+[]{};:,.<>?)

Each character is selected using cryptographically secure random numbers from the browser's Web Crypto API, ensuring your passwords are unpredictable and secure.

## Tech stack

- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- Web Crypto API

Built with modern web technologies for a fast, secure, and reliable password generation experience.