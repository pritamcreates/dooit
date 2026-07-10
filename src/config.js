/**
 * @module config
 * @description Centralized configuration, constants, and Firebase credentials.
 */

export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAMacwdf0ltK-JL6_ErdR9jaV8yJlGrOJc",
  authDomain: "letsdooit---final-edition.firebaseapp.com",
  projectId: "letsdooit---final-edition",
  storageBucket: "letsdooit---final-edition.firebasestorage.app",
  messagingSenderId: "162170588177",
  appId: "1:162170588177:web:152261bfc17674451df5b0"
};

export const GOOGLE_CLIENT_ID = "162170588177-9d118c5iec63p8o83ptvdbu6rog742og.apps.googleusercontent.com";

export const FOCUS_LIMIT = 5;

export const RIBBON_MSGS = [
  [0, 0, "Start your first task — one step at a time."],
  [1, 1, "First one down. The hardest part is over."],
  [2, 3, "Good start. Keep the momentum."],
  [4, 5, "Making real progress. Keep going."],
  [6, 7, "Solid output. Stay focused."],
  [8, 9, "Strong day. Don't stop now."],
  [10, 99, "Exceptional. This is what discipline looks like."]
];

export const COACHING_QUOTES = [
  { quote: "Your mind is for having ideas, not holding them.", source: "David Allen" },
  { quote: "Work expands so as to fill the time available for its completion.", source: "Parkinson's Law" },
  { quote: "What is the ONE Thing I can do such that by doing it everything else will be easier or unnecessary?", source: "Gary Keller" },
  { quote: "Eat a live frog first thing in the morning and nothing worse will happen to you the rest of the day.", source: "Mark Twain" },
  { quote: "Focus is a matter of deciding what things you're not going to do.", source: "John Carmack" },
  { quote: "Action expresses priorities.", source: "Mahatma Gandhi" },
  { quote: "Amateurs sit and wait for inspiration, the rest of us just get up and go to work.", source: "Stephen King" },
  { quote: "Productivity is being able to do things that you were never able to do before.", source: "Franz Kafka" },
  { quote: "The way to get started is to quit talking and begin doing.", source: "Walt Disney" },
  { quote: "You don't need a new plan for next year. You need a commitment.", source: "Seth Godin" }
];

export const FIREBASE_VERSION = '10.12.0';
export const CDN_BASE = `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}`;
