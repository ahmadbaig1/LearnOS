export interface Lesson {
  id: string;
  title: string;
  duration: string;
  content: string;
  codeExample?: string;
  exercise: string;
  keyTakeaways: string[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  totalLessons: number;
  estimatedHours: string;
  lessons: Lesson[];
}

export const COURSES: Course[] = [
  {
    id: 'react',
    title: 'React Fundamentals',
    description: 'Build modern UIs with React. Components, hooks, state, and real projects.',
    icon: '⚛️',
    color: '#61DAFB',
    totalLessons: 6,
    estimatedHours: '6–8 hrs',
    lessons: [
      {
        id: 'react-1',
        title: 'What is React and Why Use It?',
        duration: '20 min',
        content: `# What is React?

React is a JavaScript library created by Facebook for building user interfaces. Instead of manually updating the DOM, React lets you describe *what* the UI should look like — and it handles *how* to update it efficiently.

## The Core Idea: Components

Everything in React is a **component** — a reusable piece of UI. Think of it like LEGO bricks: each brick is independent, and you combine them to build something complex.

\`\`\`jsx
// A simple component
function Greeting() {
  return <h1>Hello, Ahmad!</h1>;
}
\`\`\`

## Why React?

- **Reusable** — Write a Button once, use it everywhere
- **Declarative** — Describe the UI, React handles updates
- **Huge ecosystem** — Libraries, jobs, community
- **You already know JS** — React is just JavaScript + JSX

## JSX — HTML inside JavaScript

JSX looks like HTML but it's JavaScript. React compiles it behind the scenes.

\`\`\`jsx
// JSX
const element = <h1 className="title">Hello World</h1>;

// What it compiles to
const element = React.createElement('h1', {className: 'title'}, 'Hello World');
\`\`\`

## Your First React App

Every React app has a root component — usually called **App** — that renders everything else.

\`\`\`jsx
function App() {
  return (
    <div>
      <Greeting />
      <p>Welcome to React!</p>
    </div>
  );
}
\`\`\``,
        codeExample: `function WelcomeCard({ name, role }) {
  return (
    <div style={{ padding: 20, background: '#1a1a2e', borderRadius: 8 }}>
      <h2>Hi, {name}!</h2>
      <p>You are a {role}</p>
    </div>
  );
}

// Using the component
<WelcomeCard name="Ahmad" role="CS Engineer" />`,
        exercise: 'Create a component called ProfileCard that shows your name, your current role, and one skill you\'re learning. Pass all three as props.',
        keyTakeaways: [
          'React is a UI library, not a full framework',
          'Everything is a component',
          'JSX is JavaScript that looks like HTML',
          'Components receive data via props',
        ],
      },
      {
        id: 'react-2',
        title: 'State and useState Hook',
        duration: '25 min',
        content: `# State — Making Components Dynamic

Props are data passed *into* a component. **State** is data that lives *inside* a component and can change over time.

When state changes, React automatically re-renders the component with the new data.

## useState Hook

\`\`\`jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0); // initial value = 0

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}
\`\`\`

**Anatomy of useState:**
- \`count\` — the current value
- \`setCount\` — function to update it
- \`useState(0)\` — 0 is the starting value

## Rules of State

1. **Never mutate state directly** — always use the setter function
2. **State updates are async** — the new value shows on next render
3. **Each component has its own state** — they don't share

## State with Objects

\`\`\`jsx
const [user, setUser] = useState({ name: 'Ahmad', score: 0 });

// ✅ Correct — spread old values, update one
setUser({ ...user, score: user.score + 10 });

// ❌ Wrong — mutating directly
user.score = user.score + 10;
\`\`\`

## Controlled Inputs

State + inputs = controlled components:

\`\`\`jsx
function SearchBox() {
  const [query, setQuery] = useState('');

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
    />
  );
}
\`\`\``,
        codeExample: `function LikeButton() {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setLiked(!liked);
    setCount(liked ? count - 1 : count + 1);
  };

  return (
    <button onClick={handleClick} style={{
      background: liked ? '#e91e63' : '#333',
      color: 'white',
      padding: '8px 16px',
      borderRadius: 20,
      border: 'none',
    }}>
      {liked ? '❤️' : '🤍'} {count}
    </button>
  );
}`,
        exercise: 'Build a simple todo input — a text field and an "Add" button. When you click Add, the item should appear in a list below. Use useState to store the list and the current input value.',
        keyTakeaways: [
          'State is internal, mutable data in a component',
          'useState returns [value, setter]',
          'Never mutate state directly — always use the setter',
          'State change triggers a re-render',
        ],
      },
      {
        id: 'react-3',
        title: 'useEffect and Side Effects',
        duration: '25 min',
        content: `# useEffect — Running Code Outside Render

Some things shouldn't happen during rendering — like fetching data, setting up timers, or updating the document title. These are **side effects**.

\`useEffect\` lets you run code *after* the component renders.

## Basic Usage

\`\`\`jsx
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    document.title = 'LearnOS';
    console.log('Component rendered!');
  });
  // Runs after every render — usually not what you want
}
\`\`\`

## The Dependency Array

The second argument controls *when* the effect runs:

\`\`\`jsx
// Run once on mount (empty array)
useEffect(() => {
  fetchUserData();
}, []);

// Run when 'userId' changes
useEffect(() => {
  fetchUserData(userId);
}, [userId]);

// Run after every render (no array)
useEffect(() => {
  doSomething();
});
\`\`\`

## Fetching Data — Real Example

\`\`\`jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      });
  }, [userId]); // re-fetch if userId changes

  if (loading) return <p>Loading...</p>;
  return <h1>{user.name}</h1>;
}
\`\`\`

## Cleanup Function

Effects can return a cleanup function — runs before the next effect or on unmount:

\`\`\`jsx
useEffect(() => {
  const timer = setInterval(() => {
    setTime(t => t + 1);
  }, 1000);

  return () => clearInterval(timer); // cleanup!
}, []);
\`\`\``,
        codeExample: `function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval); // cleanup on unmount
  }, []); // empty = run once

  return (
    <p style={{ fontSize: 32, fontWeight: 'bold' }}>
      {time.toLocaleTimeString()}
    </p>
  );
}`,
        exercise: 'Build a component that fetches a random joke from https://official-joke-api.appspot.com/random_joke on mount and displays it. Show a loading state while fetching. Add a "New Joke" button that fetches another one.',
        keyTakeaways: [
          'useEffect runs side effects after render',
          'Empty dependency array [] = run once on mount',
          'List dependencies to re-run when they change',
          'Return a cleanup function to prevent memory leaks',
        ],
      },
      {
        id: 'react-4',
        title: 'Lists, Keys, and Conditional Rendering',
        duration: '20 min',
        content: `# Rendering Lists and Conditions

## Rendering Lists with .map()

In React, you render lists by mapping an array to JSX:

\`\`\`jsx
const skills = ['Salesforce', 'Python', 'React', 'Node.js'];

function SkillList() {
  return (
    <ul>
      {skills.map(skill => (
        <li key={skill}>{skill}</li>
      ))}
    </ul>
  );
}
\`\`\`

## The key Prop

React needs a unique \`key\` on each item to track changes efficiently. Use IDs when available, not array index.

\`\`\`jsx
// ✅ Good — use unique ID
{users.map(user => <UserCard key={user.id} user={user} />)}

// ⚠️ Avoid — index shifts when items reorder
{users.map((user, i) => <UserCard key={i} user={user} />)}
\`\`\`

## Conditional Rendering

**Ternary operator** — if/else in JSX:
\`\`\`jsx
{isLoggedIn ? <Dashboard /> : <LoginScreen />}
\`\`\`

**&& operator** — only show if true:
\`\`\`jsx
{hasError && <ErrorMessage text={error} />}
{isLoading && <Spinner />}
\`\`\`

**Early return** — cleanest for complex conditions:
\`\`\`jsx
function Status({ status }) {
  if (status === 'loading') return <Spinner />;
  if (status === 'error') return <ErrorScreen />;
  return <DataView />;
}
\`\`\``,
        codeExample: `function TopicList({ topics }) {
  if (topics.length === 0) {
    return <p style={{ color: '#666' }}>No topics yet. Add some!</p>;
  }

  return (
    <div>
      {topics.map((topic, index) => (
        <div key={topic.id} style={{
          padding: 12,
          margin: '8px 0',
          background: '#1a1a2e',
          borderRadius: 8,
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <span>{index + 1}. {topic.title}</span>
          {topic.completed && <span>✅</span>}
        </div>
      ))}
    </div>
  );
}`,
        exercise: 'Build a filterable list of your 5 skills. Add a search input that filters the skills as you type. Show "No results" when nothing matches.',
        keyTakeaways: [
          'Use .map() to render lists in JSX',
          'Always provide a unique key prop',
          'Use ternary for if/else, && for show/hide',
          'Early returns keep complex conditions readable',
        ],
      },
      {
        id: 'react-5',
        title: 'Custom Hooks',
        duration: '25 min',
        content: `# Custom Hooks — Reusable Logic

Custom hooks let you extract and share stateful logic between components. They're just functions that use other hooks — with names starting with \`use\`.

## Why Custom Hooks?

Without custom hooks, you'd repeat the same \`useState\` + \`useEffect\` logic across many components. Custom hooks DRY this up.

## Your First Custom Hook — useFetch

\`\`\`jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(data => { setData(data); setLoading(false); })
      .catch(err => { setError(err); setLoading(false); });
  }, [url]);

  return { data, loading, error };
}

// Now use it anywhere:
function UserPage() {
  const { data, loading, error } = useFetch('/api/user');
  if (loading) return <Spinner />;
  return <Profile user={data} />;
}
\`\`\`

## useLocalStorage Hook

\`\`\`jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  const setStoredValue = (newValue) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, setStoredValue];
}

// Usage
const [theme, setTheme] = useLocalStorage('theme', 'dark');
\`\`\`

## useTimer Hook

\`\`\`jsx
function useTimer(initialSeconds) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds(s => s - 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  return { seconds, running, start: () => setRunning(true), stop: () => setRunning(false) };
}
\`\`\``,
        codeExample: `// useDebounce — delays a value update
function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Usage in a search component
function SearchBar() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery) {
      console.log('Searching for:', debouncedQuery);
    }
  }, [debouncedQuery]);

  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}`,
        exercise: 'Build a useWindowSize hook that returns { width, height } and updates on window resize. Use it in a component that shows "Mobile view" or "Desktop view" depending on the width.',
        keyTakeaways: [
          'Custom hooks are functions starting with "use"',
          'They can use any built-in hooks inside',
          'They let you share stateful logic without duplicating code',
          'Return whatever the consumer needs — values, functions, objects',
        ],
      },
      {
        id: 'react-6',
        title: 'Context API — Global State',
        duration: '30 min',
        content: `# Context — Sharing State Without Prop Drilling

**Prop drilling** happens when you pass data through many component levels just to reach a deeply nested component. Context solves this.

## The Problem

\`\`\`jsx
// Without context — passing theme through 3 layers
<App theme="dark">
  <Layout theme="dark">
    <Sidebar theme="dark">
      <MenuItem theme="dark" /> {/* finally uses it */}
    </Sidebar>
  </Layout>
</App>
\`\`\`

## Creating Context

\`\`\`jsx
import { createContext, useContext, useState } from 'react';

// 1. Create
const ThemeContext = createContext('light');

// 2. Provide — wrap your app or part of it
function App() {
  const [theme, setTheme] = useState('dark');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Layout />
    </ThemeContext.Provider>
  );
}

// 3. Consume — anywhere inside the Provider
function MenuItem() {
  const { theme } = useContext(ThemeContext);
  return <div className={theme === 'dark' ? 'dark-item' : 'light-item'}>Menu</div>;
}
\`\`\`

## Real Pattern — Auth Context

\`\`\`jsx
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// Usage anywhere in the tree
function ProfileButton() {
  const { user, logout } = useAuth();
  return <button onClick={logout}>{user.name}</button>;
}
\`\`\`

## When to Use Context

✅ Theme, language, authenticated user, feature flags
❌ High-frequency updates (use Zustand/Redux instead)`,
        codeExample: `// Complete notification context
const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <div style={{ position: 'fixed', bottom: 20, right: 20 }}>
        {notifications.map(n => (
          <div key={n.id} style={{ background: '#333', color: '#fff', padding: 12, marginTop: 8, borderRadius: 8 }}>
            {n.message}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export const useNotification = () => useContext(NotificationContext);`,
        exercise: 'Build a ThemeContext that stores "dark" or "light". Create a toggle button that switches between them. Apply the theme as a background color to your entire app.',
        keyTakeaways: [
          'Context avoids prop drilling through many layers',
          'createContext → Provider → useContext',
          'Wrap only the subtree that needs the data',
          'Best for global, low-frequency state (theme, auth)',
        ],
      },
    ],
  },
  {
    id: 'javascript',
    title: 'JavaScript Deep Dive',
    description: 'Master JS fundamentals that matter: closures, async/await, array methods, and more.',
    icon: '🟨',
    color: '#F7DF1E',
    totalLessons: 5,
    estimatedHours: '5–7 hrs',
    lessons: [
      {
        id: 'js-1',
        title: 'Closures and Scope',
        duration: '25 min',
        content: `# Closures — JavaScript's Superpower

A **closure** is a function that remembers the variables from its outer scope, even after that outer function has returned.

## Scope First

\`\`\`js
let global = 'I am global';

function outer() {
  let outerVar = 'I am outer';

  function inner() {
    let innerVar = 'I am inner';
    console.log(outerVar); // ✅ can access outer
    console.log(global);   // ✅ can access global
  }

  inner();
  // console.log(innerVar); // ❌ cannot access inner
}
\`\`\`

## Closures in Action

\`\`\`js
function makeCounter() {
  let count = 0; // lives in makeCounter's scope

  return function() {
    count++;       // inner function closes over count
    return count;
  };
}

const counter = makeCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3
// count is private — can't access it directly
\`\`\`

## Practical Use Cases

**Private variables:**
\`\`\`js
function createBankAccount(initialBalance) {
  let balance = initialBalance; // private!

  return {
    deposit: (amount) => { balance += amount; },
    withdraw: (amount) => { balance -= amount; },
    getBalance: () => balance,
  };
}

const account = createBankAccount(1000);
account.deposit(500);
console.log(account.getBalance()); // 1500
// console.log(balance); // ❌ ReferenceError
\`\`\`

**Memoization:**
\`\`\`js
function memoize(fn) {
  const cache = {};
  return function(n) {
    if (cache[n]) return cache[n];
    cache[n] = fn(n);
    return cache[n];
  };
}
\`\`\``,
        codeExample: `// Event handler factory — classic closure use case
function makeClickHandler(buttonId) {
  let clickCount = 0;

  return function() {
    clickCount++;
    console.log(\`Button \${buttonId} clicked \${clickCount} times\`);
  };
}

const btn1Handler = makeClickHandler('submit');
const btn2Handler = makeClickHandler('cancel');

btn1Handler(); // Button submit clicked 1 times
btn1Handler(); // Button submit clicked 2 times
btn2Handler(); // Button cancel clicked 1 times
// Each handler has its own independent clickCount`,
        exercise: 'Build a makeMultiplier(x) function that returns a new function. The returned function takes a number and multiplies it by x. Test: const double = makeMultiplier(2); double(5) === 10.',
        keyTakeaways: [
          'A closure remembers its outer scope after the outer function returns',
          'Useful for private state, factory functions, and memoization',
          'Each closure instance has its own copy of the outer variables',
          'This is how module patterns work in older JS',
        ],
      },
      {
        id: 'js-2',
        title: 'Promises and Async/Await',
        duration: '30 min',
        content: `# Async JavaScript — Promises and Async/Await

JavaScript is single-threaded but non-blocking. Async operations (fetch, timers, file reads) use the event loop.

## The Old Way — Callbacks

\`\`\`js
// Callback hell 😱
fetchUser(id, function(user) {
  fetchPosts(user.id, function(posts) {
    fetchComments(posts[0].id, function(comments) {
      // deeply nested, hard to read
    });
  });
});
\`\`\`

## Promises

A Promise represents a value that will be available in the future:

\`\`\`js
const promise = fetch('https://api.example.com/user');

promise
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error))
  .finally(() => setLoading(false));
\`\`\`

**Promise states:**
- **Pending** — waiting
- **Fulfilled** — success, has a value
- **Rejected** — failed, has an error

## Async/Await — Clean Syntax

\`\`\`js
async function getUser(id) {
  try {
    const response = await fetch(\`/api/users/\${id}\`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed:', error);
    throw error;
  }
}
\`\`\`

## Parallel Requests

\`\`\`js
// Sequential — slow (waits for each)
const user = await fetchUser(id);
const posts = await fetchPosts(id);

// Parallel — fast (runs at same time)
const [user, posts] = await Promise.all([
  fetchUser(id),
  fetchPosts(id),
]);
\`\`\``,
        codeExample: `// Real-world: retry logic with async/await
async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      console.log(\`Attempt \${i + 1} failed, retrying...\`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

// Usage
const data = await fetchWithRetry('https://api.example.com/data');`,
        exercise: 'Write an async function loadRandomUser() that fetches from https://randomuser.me/api/ and returns an object with name, email, and country. Handle errors gracefully.',
        keyTakeaways: [
          'Promises represent future values',
          'async/await is syntactic sugar over Promises',
          'Use try/catch for error handling in async functions',
          'Promise.all() runs multiple async operations in parallel',
        ],
      },
      {
        id: 'js-3',
        title: 'Array Methods — map, filter, reduce',
        duration: '25 min',
        content: `# Array Methods — The Holy Trinity

These three methods handle 90% of data transformation in modern JS.

## .map() — Transform Every Item

Returns a **new array** with each item transformed:

\`\`\`js
const prices = [10, 20, 30, 40];
const withTax = prices.map(p => p * 1.18);
// [11.8, 23.6, 35.4, 47.2]

const users = [{ name: 'Ahmad' }, { name: 'Ali' }];
const names = users.map(u => u.name);
// ['Ahmad', 'Ali']
\`\`\`

## .filter() — Keep What Matches

Returns a **new array** with only items that pass the test:

\`\`\`js
const scores = [45, 78, 92, 55, 88];
const passed = scores.filter(s => s >= 60);
// [78, 92, 88]

const products = [{ name: 'Laptop', inStock: true }, { name: 'Phone', inStock: false }];
const available = products.filter(p => p.inStock);
// [{ name: 'Laptop', inStock: true }]
\`\`\`

## .reduce() — Collapse to One Value

Reduces an array to a single value:

\`\`\`js
const nums = [1, 2, 3, 4, 5];
const sum = nums.reduce((acc, num) => acc + num, 0);
// 15

// Count occurrences
const fruits = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple'];
const count = fruits.reduce((acc, fruit) => {
  acc[fruit] = (acc[fruit] || 0) + 1;
  return acc;
}, {});
// { apple: 3, banana: 2, orange: 1 }
\`\`\`

## Chaining

\`\`\`js
const topStudents = students
  .filter(s => s.score >= 80)
  .map(s => ({ name: s.name, grade: s.score >= 90 ? 'A' : 'B' }))
  .sort((a, b) => a.name.localeCompare(b.name));
\`\`\``,
        codeExample: `const transactions = [
  { type: 'income', amount: 5000, category: 'salary' },
  { type: 'expense', amount: 1200, category: 'rent' },
  { type: 'expense', amount: 300, category: 'food' },
  { type: 'income', amount: 800, category: 'freelance' },
  { type: 'expense', amount: 150, category: 'transport' },
];

const income = transactions
  .filter(t => t.type === 'income')
  .reduce((sum, t) => sum + t.amount, 0);
// 5800

const expenses = transactions
  .filter(t => t.type === 'expense')
  .reduce((sum, t) => sum + t.amount, 0);
// 1650

const byCategory = transactions.reduce((acc, t) => {
  acc[t.category] = (acc[t.category] || 0) + t.amount;
  return acc;
}, {});
// { salary: 5000, rent: 1200, food: 300, freelance: 800, transport: 150 }`,
        exercise: 'Given an array of 5 students with name and score, use map+filter+reduce to: (1) filter only those who passed (≥60), (2) add a letter grade A/B/C to each, (3) calculate the class average of those who passed.',
        keyTakeaways: [
          'map() transforms — same length array, different values',
          'filter() selects — smaller or equal length array',
          'reduce() collapses — one output from many inputs',
          'Chain them together for powerful data pipelines',
        ],
      },
      {
        id: 'js-4',
        title: 'Destructuring and Spread',
        duration: '20 min',
        content: `# Destructuring and Spread — Modern JS Essentials

## Destructuring

Extract values from arrays and objects cleanly:

**Array destructuring:**
\`\`\`js
const [first, second, ...rest] = [1, 2, 3, 4, 5];
// first = 1, second = 2, rest = [3, 4, 5]

// Swap variables
let a = 1, b = 2;
[a, b] = [b, a];
// a = 2, b = 1
\`\`\`

**Object destructuring:**
\`\`\`js
const user = { name: 'Ahmad', role: 'CSM', city: 'Lucknow' };
const { name, role } = user;

// Rename while destructuring
const { name: userName, role: userRole } = user;

// Default values
const { theme = 'dark', lang = 'en' } = settings;
\`\`\`

**In function params:**
\`\`\`js
// Old
function greet(user) {
  return \`Hello \${user.name}\`;
}

// New — destructure in params
function greet({ name, role = 'user' }) {
  return \`Hello \${name}, you are a \${role}\`;
}
\`\`\`

## Spread Operator

Expand iterables into individual elements:

\`\`\`js
// Merge arrays
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const merged = [...arr1, ...arr2]; // [1,2,3,4,5,6]

// Clone + modify objects
const user = { name: 'Ahmad', score: 100 };
const updated = { ...user, score: 200 }; // score overwritten

// Merge objects
const defaults = { theme: 'dark', lang: 'en' };
const userPrefs = { lang: 'ur' };
const config = { ...defaults, ...userPrefs };
// { theme: 'dark', lang: 'ur' }
\`\`\``,
        codeExample: `// API response transformation using destructuring
async function processUser(userId) {
  const response = await fetch(\`/api/users/\${userId}\`);
  const {
    id,
    name: fullName,
    email,
    address: { city, country } = {},
    roles: [primaryRole] = ['viewer'],
  } = await response.json();

  return {
    id,
    displayName: fullName,
    contact: email,
    location: \`\${city}, \${country}\`,
    access: primaryRole,
  };
}

// Spread in React state updates
const updateUserScore = (userId, newScore) => {
  setUsers(prev => prev.map(user =>
    user.id === userId
      ? { ...user, score: newScore, updatedAt: new Date() }
      : user
  ));
};`,
        exercise: 'Given a config object with 10 properties, write a function that takes the config and returns a new object with only name, email, and role — using destructuring. Set defaults for missing values.',
        keyTakeaways: [
          'Destructuring extracts values from arrays and objects',
          'Spread (...) expands iterables or copies objects',
          'Use spread to clone + modify without mutating',
          'Destructure function params for cleaner signatures',
        ],
      },
      {
        id: 'js-5',
        title: 'Modules — import and export',
        duration: '20 min',
        content: `# JavaScript Modules

Modules let you split code into separate files and import only what you need.

## Named Exports

\`\`\`js
// utils.js
export function formatDate(date) {
  return date.toLocaleDateString();
}
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
export const MAX_ITEMS = 100;

// app.js — import specific names
import { formatDate, capitalize } from './utils';
\`\`\`

## Default Export

Each file can have one default export:

\`\`\`js
// UserCard.js
export default function UserCard({ user }) {
  return <div>{user.name}</div>;
}

// app.js — import with any name you want
import UserCard from './UserCard';
import Card from './UserCard'; // also valid
\`\`\`

## Re-exporting (Barrel Files)

\`\`\`js
// components/index.js — barrel file
export { default as Button } from './Button';
export { default as Input } from './Input';
export { default as Modal } from './Modal';

// app.js — clean imports
import { Button, Input, Modal } from './components';
\`\`\`

## Dynamic Imports

Load modules only when needed:

\`\`\`js
// Load a heavy chart library only when needed
async function showChart() {
  const { Chart } = await import('chart.js');
  new Chart(canvas, config);
}
\`\`\``,
        codeExample: `// api/index.js — organizing API calls as a module
const BASE_URL = 'https://api.example.com';

async function get(endpoint) {
  const res = await fetch(\`\${BASE_URL}\${endpoint}\`);
  if (!res.ok) throw new Error(\`API Error: \${res.status}\`);
  return res.json();
}

async function post(endpoint, data) {
  const res = await fetch(\`\${BASE_URL}\${endpoint}\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export const api = {
  getUser: (id) => get(\`/users/\${id}\`),
  getTopics: () => get('/topics'),
  addTopic: (topic) => post('/topics', topic),
};

// Usage anywhere
import { api } from './api';
const user = await api.getUser(1);`,
        exercise: 'Refactor: take a file with 5 utility functions (formatDate, formatCurrency, truncateText, slugify, debounce) and split it into two modules — formatters.js and utils.js. Create an index.js that re-exports everything.',
        keyTakeaways: [
          'Named exports use { curly braces } on import',
          'Default export can be imported with any name',
          'Barrel files (index.js) create clean public APIs',
          'Dynamic imports load code lazily for better performance',
        ],
      },
    ],
  },
  {
    id: 'python',
    title: 'Python for Builders',
    description: 'Python from scratch — syntax, data structures, file I/O, APIs, and automation scripts.',
    icon: '🐍',
    color: '#3776AB',
    totalLessons: 5,
    estimatedHours: '6–8 hrs',
    lessons: [
      {
        id: 'py-1',
        title: 'Python Basics — Variables, Types, Control Flow',
        duration: '25 min',
        content: `# Python Basics

Python is designed to be readable. No semicolons, indentation defines blocks.

## Variables and Types

\`\`\`python
# No type declaration needed
name = "Ahmad"
age = 28
score = 94.5
is_open = True

# Type checking
print(type(name))   # <class 'str'>
print(type(age))    # <class 'int'>

# f-strings (modern string formatting)
print(f"Hello, {name}! You are {age} years old.")
\`\`\`

## Lists, Dicts, Tuples, Sets

\`\`\`python
# List — ordered, mutable
skills = ["Python", "React", "Salesforce"]
skills.append("Node.js")
skills[0]   # "Python"
skills[-1]  # "Node.js" (last item)

# Dict — key-value pairs
user = {"name": "Ahmad", "score": 95, "active": True}
user["name"]          # "Ahmad"
user.get("age", 0)    # 0 (default if missing)

# Tuple — immutable list
point = (10, 20)

# Set — unique items
tags = {"python", "react", "python"}  # {"python", "react"}
\`\`\`

## Control Flow

\`\`\`python
# if/elif/else
score = 87
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
else:
    grade = "C"

# for loop
for skill in skills:
    print(f"- {skill}")

# while loop
count = 0
while count < 5:
    count += 1

# List comprehension
squared = [x**2 for x in range(10)]
filtered = [x for x in range(20) if x % 2 == 0]
\`\`\``,
        codeExample: `# Real example: process a list of students
students = [
    {"name": "Ahmad", "score": 87},
    {"name": "Ali", "score": 52},
    {"name": "Sara", "score": 94},
    {"name": "Reza", "score": 61},
]

# Add grade, filter passed students
def get_grade(score):
    if score >= 90: return "A"
    elif score >= 80: return "B"
    elif score >= 60: return "C"
    else: return "F"

passed = [
    {**s, "grade": get_grade(s["score"])}
    for s in students
    if s["score"] >= 60
]

avg = sum(s["score"] for s in passed) / len(passed)
print(f"Average (passed): {avg:.1f}")
for s in passed:
    print(f"{s['name']}: {s['score']} ({s['grade']})")`,
        exercise: 'Write a Python script that takes a list of 6 product prices, applies a 10% discount to anything over ₹1000, and prints the original vs. discounted price for each using an f-string.',
        keyTakeaways: [
          'Python uses indentation — no curly braces',
          'f-strings are the modern way to format strings',
          'Lists, dicts, tuples, and sets are your core data structures',
          'List comprehensions are concise and Pythonic',
        ],
      },
      {
        id: 'py-2',
        title: 'Functions and Error Handling',
        duration: '25 min',
        content: `# Functions in Python

## Defining Functions

\`\`\`python
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

print(greet("Ahmad"))           # Hello, Ahmad!
print(greet("Ahmad", "Hi"))     # Hi, Ahmad!
\`\`\`

## *args and **kwargs

\`\`\`python
def add(*numbers):          # accepts any number of args
    return sum(numbers)

add(1, 2, 3, 4)  # 10

def create_user(**kwargs):  # accepts any keyword args
    return kwargs

create_user(name="Ahmad", role="CSM", city="Lucknow")
\`\`\`

## Lambda Functions

\`\`\`python
# One-liner functions
double = lambda x: x * 2
square = lambda x: x ** 2

# Often used with map/filter/sorted
names = ["Ahmad", "Zara", "Ali"]
sorted_names = sorted(names, key=lambda n: len(n))
\`\`\`

## Error Handling

\`\`\`python
try:
    number = int(input("Enter a number: "))
    result = 100 / number
    print(f"Result: {result}")
except ValueError:
    print("That's not a number!")
except ZeroDivisionError:
    print("Can't divide by zero!")
except Exception as e:
    print(f"Unexpected error: {e}")
finally:
    print("Always runs")
\`\`\`

## Custom Exceptions

\`\`\`python
class InsufficientFundsError(Exception):
    def __init__(self, amount, balance):
        super().__init__(f"Cannot withdraw {amount}, balance is {balance}")

def withdraw(amount, balance):
    if amount > balance:
        raise InsufficientFundsError(amount, balance)
    return balance - amount
\`\`\``,
        codeExample: `import re

def validate_email(email):
    """Validates email format."""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(pattern, email):
        raise ValueError(f"Invalid email: {email}")
    return True

def process_user_registrations(users):
    valid = []
    errors = []

    for user in users:
        try:
            validate_email(user["email"])
            if not user.get("name"):
                raise ValueError("Name is required")
            valid.append(user)
        except ValueError as e:
            errors.append({"user": user, "error": str(e)})

    return valid, errors

users = [
    {"name": "Ahmad", "email": "ahmad@example.com"},
    {"name": "", "email": "ali@example.com"},
    {"name": "Sara", "email": "not-an-email"},
]
valid, errors = process_user_registrations(users)`,
        exercise: 'Write a function safe_divide(a, b) that handles ZeroDivisionError and TypeError (non-numeric input). Return the result or a descriptive error message. Test it with 5 different inputs including edge cases.',
        keyTakeaways: [
          'Default arguments make functions flexible',
          '*args collects positional args, **kwargs collects keyword args',
          'try/except/finally handles errors gracefully',
          'Raise custom exceptions for domain-specific errors',
        ],
      },
      {
        id: 'py-3',
        title: 'File I/O and JSON',
        duration: '20 min',
        content: `# File I/O and JSON in Python

## Reading and Writing Files

\`\`\`python
# Write a file
with open("notes.txt", "w") as f:
    f.write("First line\\n")
    f.write("Second line\\n")

# Read entire file
with open("notes.txt", "r") as f:
    content = f.read()

# Read line by line
with open("notes.txt", "r") as f:
    for line in f:
        print(line.strip())

# Append to existing
with open("notes.txt", "a") as f:
    f.write("Added later\\n")
\`\`\`

Always use \`with\` — it auto-closes the file.

## Working with JSON

\`\`\`python
import json

# Python dict → JSON string
user = {"name": "Ahmad", "score": 95, "skills": ["Python", "React"]}
json_str = json.dumps(user, indent=2)

# JSON string → Python dict
parsed = json.loads(json_str)

# Read JSON file
with open("data.json", "r") as f:
    data = json.load(f)

# Write JSON file
with open("output.json", "w") as f:
    json.dump(user, f, indent=2)
\`\`\`

## Working with CSV

\`\`\`python
import csv

# Read CSV
with open("students.csv", "r") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row["name"], row["score"])

# Write CSV
with open("output.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["name", "score"])
    writer.writeheader()
    writer.writerows([{"name": "Ahmad", "score": 95}])
\`\`\``,
        codeExample: `import json
from pathlib import Path

def save_roadmap(roadmap, filename):
    """Save a learning roadmap to a JSON file."""
    path = Path(filename)
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w") as f:
        json.dump(roadmap, f, indent=2)
    print(f"Saved to {path}")

def load_roadmap(filename):
    """Load a roadmap, return None if file doesn't exist."""
    path = Path(filename)
    if not path.exists():
        return None
    with open(path, "r") as f:
        return json.load(f)

roadmap = {
    "title": "React Mastery",
    "topics": ["Components", "Hooks", "Context", "React Query"],
    "completed": [],
    "created": "2026-08-16"
}

save_roadmap(roadmap, "roadmaps/react.json")
loaded = load_roadmap("roadmaps/react.json")
print(f"Loaded: {loaded['title']} — {len(loaded['topics'])} topics")`,
        exercise: 'Write a script that reads a list of names from a text file (one per line), sorts them alphabetically, removes duplicates, and saves the cleaned list to a new JSON file with a count field.',
        keyTakeaways: [
          'Always use with open() — auto-closes files',
          'json.dumps/loads for strings, json.dump/load for files',
          'pathlib.Path is the modern way to handle file paths',
          'csv.DictReader/DictWriter for spreadsheet-style data',
        ],
      },
      {
        id: 'py-4',
        title: 'APIs and requests Library',
        duration: '25 min',
        content: `# Calling APIs with Python

## The requests Library

\`\`\`bash
pip install requests
\`\`\`

\`\`\`python
import requests

# GET request
response = requests.get("https://api.github.com/users/ahmadbaig1")
print(response.status_code)  # 200
data = response.json()       # parse JSON
print(data["name"])
\`\`\`

## With Parameters and Headers

\`\`\`python
# Query params
response = requests.get(
    "https://api.example.com/search",
    params={"q": "python", "limit": 10}
)
# builds: /search?q=python&limit=10

# With auth header
response = requests.get(
    "https://api.example.com/protected",
    headers={"Authorization": f"Bearer {API_KEY}"}
)
\`\`\`

## POST Requests

\`\`\`python
response = requests.post(
    "https://api.example.com/users",
    json={"name": "Ahmad", "email": "ahmad@example.com"},
    headers={"Authorization": f"Bearer {API_KEY}"}
)
new_user = response.json()
\`\`\`

## Error Handling

\`\`\`python
try:
    response = requests.get(url, timeout=10)
    response.raise_for_status()  # raises for 4xx/5xx
    data = response.json()
except requests.Timeout:
    print("Request timed out")
except requests.HTTPError as e:
    print(f"HTTP error: {e.response.status_code}")
except requests.RequestException as e:
    print(f"Request failed: {e}")
\`\`\``,
        codeExample: `import requests
import os

GROQ_API_KEY = os.environ.get("GROQ_API_KEY")

def ask_ai(question, system="You are a helpful assistant."):
    """Call Groq API — same pattern you used in Haider Notices."""
    response = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json",
        },
        json={
            "model": "llama-3.1-8b-instant",
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": question},
            ],
            "temperature": 0.7,
        },
        timeout=30,
    )
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"]

answer = ask_ai("Explain Python list comprehensions in 2 sentences.")
print(answer)`,
        exercise: 'Build a script that fetches the top 5 repositories of github.com/ahmadbaig1 using the GitHub API (no auth needed for public data), and prints each repo name, description, and star count.',
        keyTakeaways: [
          'requests.get/post/put/delete map to HTTP methods',
          'response.json() parses the JSON body',
          'response.raise_for_status() throws on 4xx/5xx',
          'Always set a timeout to prevent hanging requests',
        ],
      },
      {
        id: 'py-5',
        title: 'Classes and OOP Basics',
        duration: '25 min',
        content: `# Object-Oriented Programming in Python

## Classes and Objects

\`\`\`python
class User:
    def __init__(self, name, email):  # constructor
        self.name = name
        self.email = email
        self.score = 0          # default attribute

    def greet(self):
        return f"Hi, I'm {self.name}"

    def add_score(self, points):
        self.score += points
        return self

# Creating instances
user = User("Ahmad", "ahmad@example.com")
print(user.greet())   # Hi, I'm Ahmad
user.add_score(10)
print(user.score)     # 10
\`\`\`

## Inheritance

\`\`\`python
class Admin(User):
    def __init__(self, name, email, permissions):
        super().__init__(name, email)   # call parent __init__
        self.permissions = permissions

    def greet(self):                    # override parent method
        return f"[Admin] {super().greet()}"

admin = Admin("Ahmad", "a@x.com", ["delete", "ban"])
print(admin.greet())  # [Admin] Hi, I'm Ahmad
\`\`\`

## Properties

\`\`\`python
class BankAccount:
    def __init__(self, initial_balance):
        self._balance = initial_balance  # _prefix = private by convention

    @property
    def balance(self):
        return self._balance

    @balance.setter
    def balance(self, amount):
        if amount < 0:
            raise ValueError("Balance cannot be negative")
        self._balance = amount

account = BankAccount(1000)
print(account.balance)  # 1000
account.balance = 500   # calls setter
\`\`\``,
        codeExample: `class LearningTracker:
    def __init__(self, user_name):
        self.user_name = user_name
        self.topics = []
        self.completed = []

    def add_topic(self, title, priority=1):
        self.topics.append({"title": title, "priority": priority, "done": False})
        return self  # enables chaining

    def complete(self, title):
        for topic in self.topics:
            if topic["title"] == title:
                topic["done"] = True
                self.completed.append(title)
        return self

    @property
    def progress(self):
        if not self.topics: return 0
        return len(self.completed) / len(self.topics) * 100

    def __repr__(self):
        return f"LearningTracker({self.user_name}, {self.progress:.0f}% done)"

tracker = (LearningTracker("Ahmad")
           .add_topic("React Hooks")
           .add_topic("Python Classes")
           .complete("Python Classes"))

print(tracker)          # LearningTracker(Ahmad, 50% done)
print(tracker.progress) # 50.0`,
        exercise: 'Build a Course class with: title, lessons list, and a current_lesson index. Add methods: next_lesson(), prev_lesson(), and a progress property (0–100%). Initialize with 5 lesson names.',
        keyTakeaways: [
          '__init__ is the constructor — runs on object creation',
          'super() calls the parent class method',
          '@property creates getter/setter for clean access',
          'self refers to the instance — always the first param',
        ],
      },
    ],
  },
  {
    id: 'sql',
    title: 'SQL for Data Work',
    description: 'Write real queries. SELECT, JOIN, GROUP BY, subqueries, and window functions.',
    icon: '🗄️',
    color: '#336791',
    totalLessons: 4,
    estimatedHours: '4–5 hrs',
    lessons: [
      {
        id: 'sql-1',
        title: 'SELECT, WHERE, and ORDER BY',
        duration: '20 min',
        content: `# SQL Fundamentals — Querying Data

SQL is declarative — you describe *what* you want, not *how* to get it.

## SELECT

\`\`\`sql
-- Get all columns
SELECT * FROM users;

-- Get specific columns
SELECT name, email, created_at FROM users;

-- With alias
SELECT name AS customer_name, email AS contact FROM users;

-- Expressions
SELECT name, score * 1.1 AS adjusted_score FROM students;
\`\`\`

## WHERE — Filtering Rows

\`\`\`sql
-- Comparison
SELECT * FROM users WHERE country = 'India';
SELECT * FROM orders WHERE amount > 1000;

-- Multiple conditions
SELECT * FROM users
WHERE country = 'India' AND active = true;

SELECT * FROM products
WHERE price < 500 OR category = 'sale';

-- Pattern matching
SELECT * FROM users WHERE email LIKE '%@gmail.com';
SELECT * FROM products WHERE name LIKE 'iPhone%';

-- IN and BETWEEN
SELECT * FROM users WHERE country IN ('India', 'USA', 'UK');
SELECT * FROM orders WHERE amount BETWEEN 100 AND 500;
SELECT * FROM users WHERE created_at BETWEEN '2026-01-01' AND '2026-12-31';

-- NULL checks
SELECT * FROM users WHERE phone IS NULL;
SELECT * FROM users WHERE phone IS NOT NULL;
\`\`\`

## ORDER BY and LIMIT

\`\`\`sql
SELECT name, score FROM students
ORDER BY score DESC
LIMIT 10;

-- Multiple sort columns
SELECT name, city, score FROM users
ORDER BY city ASC, score DESC;
\`\`\``,
        codeExample: `-- Real-world: find high-value customers in India who signed up this year
SELECT
  u.name,
  u.email,
  COUNT(o.id) AS total_orders,
  SUM(o.amount) AS total_spent
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE
  u.country = 'India'
  AND u.created_at >= '2026-01-01'
  AND u.active = true
GROUP BY u.id, u.name, u.email
HAVING SUM(o.amount) > 10000
ORDER BY total_spent DESC
LIMIT 20;`,
        exercise: 'Write queries to: (1) Find all users from India or Pakistan. (2) Find products priced between ₹500 and ₹2000 with "Pro" in the name. (3) Get the 5 most recent orders over ₹1000.',
        keyTakeaways: [
          'SELECT specifies columns, FROM specifies the table',
          'WHERE filters rows before grouping',
          'LIKE uses % for wildcards',
          'ORDER BY + LIMIT for sorting and pagination',
        ],
      },
      {
        id: 'sql-2',
        title: 'JOINs — Combining Tables',
        duration: '25 min',
        content: `# JOINs — The Heart of SQL

Most real data lives across multiple tables. JOINs let you combine them.

## Types of JOINs

\`\`\`
users table:       orders table:
id | name          id | user_id | amount
1  | Ahmad         1  | 1       | 500
2  | Ali           2  | 1       | 300
3  | Sara          3  | 2       | 800
                   4  | 99      | 200  ← user doesn't exist
\`\`\`

**INNER JOIN** — only matching rows in both tables:
\`\`\`sql
SELECT users.name, orders.amount
FROM users
INNER JOIN orders ON users.id = orders.user_id;
-- Ahmad: 500, Ahmad: 300, Ali: 800 (Sara excluded, order 4 excluded)
\`\`\`

**LEFT JOIN** — all left table rows + matching right:
\`\`\`sql
SELECT users.name, orders.amount
FROM users
LEFT JOIN orders ON users.id = orders.user_id;
-- Ahmad: 500, Ahmad: 300, Ali: 800, Sara: NULL
\`\`\`

**RIGHT JOIN** — all right table + matching left:
\`\`\`sql
-- Ahmad: 500, Ahmad: 300, Ali: 800, NULL: 200
\`\`\`

## Multiple JOINs

\`\`\`sql
SELECT
  u.name,
  o.amount,
  p.name AS product
FROM orders o
JOIN users u ON u.id = o.user_id
JOIN products p ON p.id = o.product_id
WHERE o.status = 'completed';
\`\`\``,
        codeExample: `-- Customer health report: users + subscriptions + support tickets
SELECT
  u.name,
  u.email,
  s.plan AS subscription_plan,
  s.mrr AS monthly_revenue,
  COUNT(t.id) AS open_tickets,
  MAX(t.created_at) AS last_ticket_date,
  CASE
    WHEN s.mrr > 500 AND COUNT(t.id) > 3 THEN 'At Risk'
    WHEN s.mrr > 500 THEN 'Healthy'
    ELSE 'Standard'
  END AS health_status
FROM users u
LEFT JOIN subscriptions s ON s.user_id = u.id
LEFT JOIN tickets t ON t.user_id = u.id AND t.status = 'open'
WHERE s.active = true
GROUP BY u.id, u.name, u.email, s.plan, s.mrr
ORDER BY s.mrr DESC;`,
        exercise: 'Given users, orders, and products tables: write a query that shows each user\'s name, their most recent order date, and the name of the most expensive product they\'ve ordered.',
        keyTakeaways: [
          'INNER JOIN returns only rows with matches in both tables',
          'LEFT JOIN returns all left rows, NULL for unmatched right',
          'Use table aliases (u, o, p) to keep queries readable',
          'You can join as many tables as needed in one query',
        ],
      },
      {
        id: 'sql-3',
        title: 'GROUP BY and Aggregate Functions',
        duration: '20 min',
        content: `# Aggregates — Summarizing Data

## Aggregate Functions

\`\`\`sql
SELECT
  COUNT(*)           AS total_users,
  COUNT(phone)       AS users_with_phone,  -- excludes NULLs
  SUM(orders)        AS total_orders,
  AVG(score)         AS avg_score,
  MIN(created_at)    AS first_signup,
  MAX(created_at)    AS last_signup
FROM users;
\`\`\`

## GROUP BY

Aggregate by category:

\`\`\`sql
SELECT
  country,
  COUNT(*) AS user_count,
  AVG(score) AS avg_score
FROM users
GROUP BY country
ORDER BY user_count DESC;
\`\`\`

**Rule:** In a GROUP BY query, every column in SELECT must either be in GROUP BY or inside an aggregate function.

## HAVING — Filter After Grouping

WHERE filters rows. HAVING filters groups:

\`\`\`sql
-- Countries with more than 100 users
SELECT country, COUNT(*) AS count
FROM users
GROUP BY country
HAVING COUNT(*) > 100
ORDER BY count DESC;

-- Products with average rating > 4
SELECT product_id, AVG(rating) AS avg_rating, COUNT(*) AS reviews
FROM reviews
GROUP BY product_id
HAVING AVG(rating) > 4 AND COUNT(*) >= 10;
\`\`\`

## Query Order of Operations

\`\`\`
FROM → JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT
\`\`\`

This is why you can't use a SELECT alias in WHERE — it hasn't been computed yet.`,
        codeExample: `-- Monthly revenue and growth report
SELECT
  DATE_TRUNC('month', created_at) AS month,
  COUNT(DISTINCT user_id) AS active_customers,
  SUM(amount) AS total_revenue,
  AVG(amount) AS avg_order_value,
  COUNT(*) AS total_orders,
  SUM(amount) / COUNT(DISTINCT user_id) AS revenue_per_customer
FROM orders
WHERE
  status = 'completed'
  AND created_at >= '2026-01-01'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month;`,
        exercise: 'Write queries to: (1) Count orders per status (pending, completed, cancelled). (2) Find the top 3 product categories by total revenue. (3) Find users who have placed more than 5 orders.',
        keyTakeaways: [
          'Aggregate functions (COUNT, SUM, AVG) collapse many rows to one',
          'GROUP BY splits aggregation by category',
          'HAVING filters groups, WHERE filters rows',
          'Query executes: FROM → WHERE → GROUP BY → HAVING → SELECT',
        ],
      },
      {
        id: 'sql-4',
        title: 'Subqueries and CTEs',
        duration: '25 min',
        content: `# Subqueries and CTEs — Complex Queries Made Readable

## Subqueries

A query inside a query:

\`\`\`sql
-- Find users who have placed at least one order
SELECT name FROM users
WHERE id IN (SELECT DISTINCT user_id FROM orders);

-- Find products priced above average
SELECT name, price FROM products
WHERE price > (SELECT AVG(price) FROM products);

-- Correlated subquery — references outer query
SELECT name, score,
  (SELECT AVG(score) FROM students s2
   WHERE s2.class = s1.class) AS class_avg
FROM students s1;
\`\`\`

## CTEs — Common Table Expressions

CTEs are named subqueries defined with WITH. Much more readable:

\`\`\`sql
-- Without CTE — hard to read
SELECT * FROM (
  SELECT user_id, SUM(amount) as total
  FROM orders GROUP BY user_id
) top_buyers
WHERE total > 10000;

-- With CTE — clear and readable
WITH top_buyers AS (
  SELECT user_id, SUM(amount) AS total
  FROM orders
  GROUP BY user_id
)
SELECT u.name, tb.total
FROM top_buyers tb
JOIN users u ON u.id = tb.user_id
WHERE tb.total > 10000;
\`\`\`

## Multiple CTEs

\`\`\`sql
WITH
monthly_revenue AS (
  SELECT DATE_TRUNC('month', created_at) AS month, SUM(amount) AS revenue
  FROM orders GROUP BY 1
),
avg_revenue AS (
  SELECT AVG(revenue) AS avg FROM monthly_revenue
)
SELECT month, revenue,
  revenue - avg_revenue.avg AS vs_average
FROM monthly_revenue, avg_revenue
ORDER BY month;
\`\`\``,
        codeExample: `-- Customer success: find at-risk accounts
-- (high MRR + declining engagement + open tickets)
WITH
account_mrr AS (
  SELECT account_id, SUM(mrr) AS total_mrr
  FROM subscriptions WHERE active = true
  GROUP BY account_id
),
recent_logins AS (
  SELECT user_id, MAX(logged_in_at) AS last_login
  FROM login_events
  WHERE logged_in_at >= NOW() - INTERVAL '30 days'
  GROUP BY user_id
),
open_tickets AS (
  SELECT account_id, COUNT(*) AS ticket_count
  FROM support_tickets WHERE status = 'open'
  GROUP BY account_id
)
SELECT
  a.name AS account,
  am.total_mrr,
  rl.last_login,
  ot.ticket_count
FROM accounts a
JOIN account_mrr am ON am.account_id = a.id
LEFT JOIN recent_logins rl ON rl.user_id = a.primary_user_id
LEFT JOIN open_tickets ot ON ot.account_id = a.id
WHERE am.total_mrr > 500
  AND (rl.last_login IS NULL OR rl.last_login < NOW() - INTERVAL '14 days')
ORDER BY am.total_mrr DESC;`,
        exercise: 'Using CTEs, write a query that finds the top 3 customers by revenue in each country. (Hint: you\'ll need a CTE for totals, then a ROW_NUMBER() window function to rank within country.)',
        keyTakeaways: [
          'Subqueries can go in SELECT, FROM, WHERE, and HAVING',
          'CTEs (WITH) make complex queries readable and reusable',
          'Multiple CTEs can reference each other',
          'CTEs are often faster to reason about than nested subqueries',
        ],
      },
    ],
  },
];
