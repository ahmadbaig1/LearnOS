export type QuizOption = {
  id: string;
  text: string;
};

export type QuizQuestion = {
  id: string;
  question: string;
  type: 'mcq' | 'code-output' | 'fill';
  options: QuizOption[];
  correctId: string;
  explanation: string;
  hint?: string;
};

export type Quiz = {
  id: string;
  courseId: string;
  lessonId: string;
  title: string;
  questions: QuizQuestion[];
};

// ─────────────────────────────────────────────────────────────────────────────
// REACT FUNDAMENTALS QUIZZES
// ─────────────────────────────────────────────────────────────────────────────

const reactQuiz1: Quiz = {
  id: 'react-q1',
  courseId: 'react-fundamentals',
  lessonId: 'react-1',
  title: 'Components & Props Quiz',
  questions: [
    {
      id: 'r1q1',
      question: 'What is the correct way to pass a prop called "name" to a component?',
      type: 'mcq',
      options: [
        { id: 'a', text: '<Greeting name="Ahmad" />' },
        { id: 'b', text: '<Greeting props.name="Ahmad" />' },
        { id: 'c', text: '<Greeting {name: "Ahmad"} />' },
        { id: 'd', text: 'Greeting.name = "Ahmad"' },
      ],
      correctId: 'a',
      explanation: 'Props are passed as JSX attributes, just like HTML attributes — but you can pass any JS value, not just strings.',
    },
    {
      id: 'r1q2',
      question: 'What does this render?\n\nfunction Greet({ name }) {\n  return <Text>Hi {name}</Text>;\n}\n\n<Greet name="Ahmad" />',
      type: 'code-output',
      options: [
        { id: 'a', text: 'Hi Ahmad' },
        { id: 'b', text: 'Hi {name}' },
        { id: 'c', text: 'Hi undefined' },
        { id: 'd', text: 'Error — "name" is not defined' },
      ],
      correctId: 'a',
      explanation: '`{name}` inside JSX evaluates the JS variable. Since `name` was destructured from props and set to "Ahmad", it prints "Hi Ahmad".',
    },
    {
      id: 'r1q3',
      question: 'Props in React are:',
      type: 'mcq',
      options: [
        { id: 'a', text: 'Mutable — the component can update them directly' },
        { id: 'b', text: 'Read-only — only the parent can change them' },
        { id: 'c', text: 'Stored in the database automatically' },
        { id: 'd', text: 'Only usable in class components' },
      ],
      correctId: 'b',
      explanation: 'Props flow downward (parent → child) and are read-only inside the child. To share changes upward you pass a callback function as a prop.',
    },
    {
      id: 'r1q4',
      question: 'Which of these is a valid functional React component?',
      type: 'mcq',
      options: [
        { id: 'a', text: 'const Card = () => <View><Text>Hello</Text></View>;' },
        { id: 'b', text: 'function card() { return <View /> }' },
        { id: 'c', text: 'const card = function() { <View /> }' },
        { id: 'd', text: 'component Card() { return <View /> }' },
      ],
      correctId: 'a',
      explanation: 'React components must start with an uppercase letter so React knows it\'s a component (not an HTML tag). Arrow functions with JSX returns are the most common modern style.',
    },
    {
      id: 'r1q5',
      question: 'What is `children` in React?',
      type: 'mcq',
      options: [
        { id: 'a', text: 'A special prop holding whatever is between the component\'s opening and closing tags' },
        { id: 'b', text: 'A lifecycle method' },
        { id: 'c', text: 'A hook for managing nested state' },
        { id: 'd', text: 'An array of all child components in the app' },
      ],
      correctId: 'a',
      explanation: '`props.children` (or `{ children }`) contains the JSX you nest inside a component: `<Card><Text>Hello</Text></Card>` — "Hello" is `children`.',
    },
  ],
};

const reactQuiz2: Quiz = {
  id: 'react-q2',
  courseId: 'react-fundamentals',
  lessonId: 'react-2',
  title: 'useState Quiz',
  questions: [
    {
      id: 'r2q1',
      question: 'What does `useState(0)` return?',
      type: 'mcq',
      options: [
        { id: 'a', text: 'An array: [current value, setter function]' },
        { id: 'b', text: 'The number 0' },
        { id: 'c', text: 'An object: { value: 0, setValue: fn }' },
        { id: 'd', text: 'A reference to the DOM element' },
      ],
      correctId: 'a',
      explanation: 'useState returns a 2-element array, which is why we destructure it as `const [count, setCount] = useState(0)`.',
    },
    {
      id: 'r2q2',
      question: 'What is wrong with this code?\n\nconst [count, setCount] = useState(0);\ncount = count + 1; // update count',
      type: 'mcq',
      options: [
        { id: 'a', text: 'You must use setCount(count + 1) — direct mutation does not trigger a re-render' },
        { id: 'b', text: 'Nothing, it works fine' },
        { id: 'c', text: 'useState doesn\'t accept numbers' },
        { id: 'd', text: 'count should be declared with var, not const' },
      ],
      correctId: 'a',
      explanation: 'React only re-renders when you call the setter. Mutating `count` directly is a no-op — React never knows the value changed.',
    },
    {
      id: 'r2q3',
      question: 'What does this print after the button is clicked 3 times?\n\nconst [n, setN] = useState(0);\n<Button onPress={() => setN(n + 1)} />',
      type: 'code-output',
      options: [
        { id: 'a', text: '3' },
        { id: 'b', text: '1' },
        { id: 'c', text: '0' },
        { id: 'd', text: 'Infinity' },
      ],
      correctId: 'a',
      explanation: 'Each button press calls setN with the current n + 1, so: 0 → 1 → 2 → 3. The component re-renders each time.',
    },
    {
      id: 'r2q4',
      question: 'When should you use the functional update form `setCount(prev => prev + 1)`?',
      type: 'mcq',
      options: [
        { id: 'a', text: 'When multiple state updates happen rapidly and you need the latest value' },
        { id: 'b', text: 'Only in class components' },
        { id: 'c', text: 'When the new value is a string' },
        { id: 'd', text: 'Never — it\'s the same as setCount(count + 1)' },
      ],
      correctId: 'a',
      explanation: 'React batches updates. If you call setCount(count + 1) twice in a row, both reads see the same stale `count`. The functional form always gets the latest queued value.',
    },
    {
      id: 'r2q5',
      question: 'Can you call useState inside an if statement?',
      type: 'mcq',
      options: [
        { id: 'a', text: 'No — hooks must be called at the top level, every render, in the same order' },
        { id: 'b', text: 'Yes, but only in functional components' },
        { id: 'c', text: 'Yes, with no restrictions' },
        { id: 'd', text: 'Only if the condition is a constant' },
      ],
      correctId: 'a',
      explanation: 'This is the "Rules of Hooks". React tracks hooks by their call order. Conditional calls break that order across renders and cause bugs.',
    },
  ],
};

const reactQuiz3: Quiz = {
  id: 'react-q3',
  courseId: 'react-fundamentals',
  lessonId: 'react-3',
  title: 'useEffect Quiz',
  questions: [
    {
      id: 'r3q1',
      question: 'When does useEffect with an empty dependency array `[]` run?',
      type: 'mcq',
      options: [
        { id: 'a', text: 'Once, after the first render (component mount)' },
        { id: 'b', text: 'Every render' },
        { id: 'c', text: 'Only when a prop changes' },
        { id: 'd', text: 'Never — empty array means disabled' },
      ],
      correctId: 'a',
      explanation: '`[]` tells React "no dependencies" — so the effect only fires once when the component mounts, equivalent to componentDidMount in class components.',
    },
    {
      id: 'r3q2',
      question: 'What is the cleanup function in useEffect used for?',
      type: 'mcq',
      options: [
        { id: 'a', text: 'Cancelling subscriptions, timers, or async calls when the component unmounts' },
        { id: 'b', text: 'Clearing state back to initial values' },
        { id: 'c', text: 'Resetting the dependency array' },
        { id: 'd', text: 'It has no use — it\'s optional boilerplate' },
      ],
      correctId: 'a',
      explanation: 'The function returned from useEffect runs before the component unmounts (or before the next effect run). Without cleanup, timers and subscriptions leak memory.',
    },
    {
      id: 'r3q3',
      question: 'What happens if you omit the dependency array entirely?\n\nuseEffect(() => { console.log("ran"); });',
      type: 'mcq',
      options: [
        { id: 'a', text: 'The effect runs after every single render' },
        { id: 'b', text: 'The effect never runs' },
        { id: 'c', text: 'Same as passing []' },
        { id: 'd', text: 'Runtime error' },
      ],
      correctId: 'a',
      explanation: 'No array = run every time. `[]` = run once. `[x, y]` = run when x or y change. This is one of the most common React bugs.',
    },
    {
      id: 'r3q4',
      question: 'You fetch data in useEffect and update state, but get an infinite loop. Why?',
      type: 'mcq',
      options: [
        { id: 'a', text: 'The state variable used in fetch is in the dependency array, causing a cycle' },
        { id: 'b', text: 'fetch() is not allowed inside useEffect' },
        { id: 'c', text: 'You forgot to await the fetch' },
        { id: 'd', text: 'setState is not allowed inside useEffect' },
      ],
      correctId: 'a',
      explanation: 'Effect runs → setState → re-render → state change triggers effect again → loop. Fix: check your dep array. Often the fix is `[]` (fetch once) or removing the state variable from deps.',
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// JAVASCRIPT DEEP DIVE QUIZZES
// ─────────────────────────────────────────────────────────────────────────────

const jsQuiz1: Quiz = {
  id: 'js-q1',
  courseId: 'javascript-deep-dive',
  lessonId: 'js-1',
  title: 'Closures & Scope Quiz',
  questions: [
    {
      id: 'j1q1',
      question: 'What does this print?\n\nfunction outer() {\n  let x = 10;\n  function inner() {\n    console.log(x);\n  }\n  return inner;\n}\nconst fn = outer();\nfn();',
      type: 'code-output',
      options: [
        { id: 'a', text: '10' },
        { id: 'b', text: 'undefined' },
        { id: 'c', text: 'ReferenceError: x is not defined' },
        { id: 'd', text: 'null' },
      ],
      correctId: 'a',
      explanation: 'This is a closure. `inner` captures `x` from `outer`\'s scope. Even after `outer` finishes executing, `inner` still has access to `x` via the closure.',
    },
    {
      id: 'j1q2',
      question: 'What is the difference between `let` and `var` in a loop?\n\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0);\n}',
      type: 'code-output',
      options: [
        { id: 'a', text: '3, 3, 3' },
        { id: 'b', text: '0, 1, 2' },
        { id: 'c', text: '1, 2, 3' },
        { id: 'd', text: 'Error' },
      ],
      correctId: 'a',
      explanation: '`var` is function-scoped, not block-scoped. All 3 callbacks close over the same `i`, which is 3 after the loop ends. Using `let` instead prints 0, 1, 2 because each iteration gets its own `i`.',
    },
    {
      id: 'j1q3',
      question: 'What is a practical use for closures?',
      type: 'mcq',
      options: [
        { id: 'a', text: 'Creating private variables that can\'t be accessed from outside a function' },
        { id: 'b', text: 'Making functions run faster' },
        { id: 'c', text: 'Avoiding the need for let/const' },
        { id: 'd', text: 'Replacing async/await' },
      ],
      correctId: 'a',
      explanation: 'Closures let you encapsulate state. A counter function that returns `increment/decrement/getCount` is a classic example — the count variable is private to the closure.',
    },
    {
      id: 'j1q4',
      question: 'What is the output?\n\nlet count = 0;\nfunction add() { count++; }\nadd();\nadd();\nconsole.log(count);',
      type: 'code-output',
      options: [
        { id: 'a', text: '2' },
        { id: 'b', text: '0' },
        { id: 'c', text: '1' },
        { id: 'd', text: 'NaN' },
      ],
      correctId: 'a',
      explanation: '`add` closes over the module-level `count`. Each call increments it. After two calls, `count` is 2.',
    },
    {
      id: 'j1q5',
      question: 'Which scope does a `let` variable declared inside an `if` block have?',
      type: 'mcq',
      options: [
        { id: 'a', text: 'Block scope — only accessible within that if block' },
        { id: 'b', text: 'Function scope — accessible anywhere in the function' },
        { id: 'c', text: 'Global scope' },
        { id: 'd', text: 'Module scope — accessible in any file' },
      ],
      correctId: 'a',
      explanation: '`let` and `const` are block-scoped (bounded by `{}`). `var` is function-scoped, which is why it can leak out of if/for blocks.',
    },
  ],
};

const jsQuiz2: Quiz = {
  id: 'js-q2',
  courseId: 'javascript-deep-dive',
  lessonId: 'js-2',
  title: 'Promises & Async/Await Quiz',
  questions: [
    {
      id: 'j2q1',
      question: 'What does `async` before a function do?',
      type: 'mcq',
      options: [
        { id: 'a', text: 'Makes the function always return a Promise' },
        { id: 'b', text: 'Makes the function run on a separate thread' },
        { id: 'c', text: 'Disables error handling inside the function' },
        { id: 'd', text: 'Nothing — it\'s just a style hint' },
      ],
      correctId: 'a',
      explanation: 'An `async` function always returns a Promise, even if you return a plain value. `async function f() { return 1; }` — calling `f()` gives you `Promise { 1 }`.',
    },
    {
      id: 'j2q2',
      question: 'What is the correct way to handle errors in async/await?',
      type: 'mcq',
      options: [
        { id: 'a', text: 'try { await someCall() } catch (err) { ... }' },
        { id: 'b', text: 'await someCall().catch(err => ...)' },
        { id: 'c', text: 'Both A and B work' },
        { id: 'd', text: 'Errors in async functions are silently swallowed' },
      ],
      correctId: 'c',
      explanation: 'Both patterns work. `try/catch` is cleaner for multiple awaits. `.catch()` chaining is cleaner for a single call. Pick one and be consistent.',
    },
    {
      id: 'j2q3',
      question: 'What is the output order?\n\nconsole.log("A");\nsetTimeout(() => console.log("B"), 0);\nconsole.log("C");',
      type: 'code-output',
      options: [
        { id: 'a', text: 'A, C, B' },
        { id: 'b', text: 'A, B, C' },
        { id: 'c', text: 'B, A, C' },
        { id: 'd', text: 'C, A, B' },
      ],
      correctId: 'a',
      explanation: 'JavaScript is single-threaded with an event loop. Synchronous code (A, C) runs first. The setTimeout callback (B) is queued and runs after the current call stack clears.',
    },
    {
      id: 'j2q4',
      question: 'How do you run 3 async calls in parallel (not sequentially)?',
      type: 'mcq',
      options: [
        { id: 'a', text: 'await Promise.all([fetch(a), fetch(b), fetch(c)])' },
        { id: 'b', text: 'await fetch(a); await fetch(b); await fetch(c);' },
        { id: 'c', text: 'fetch(a).then(() => fetch(b)).then(() => fetch(c))' },
        { id: 'd', text: 'You cannot run async calls in parallel in JS' },
      ],
      correctId: 'a',
      explanation: 'Sequential awaits (option B) wait for each call to finish before starting the next. `Promise.all` fires all three simultaneously and waits for all to finish, which is much faster.',
    },
    {
      id: 'j2q5',
      question: 'What happens if one Promise in `Promise.all` rejects?',
      type: 'mcq',
      options: [
        { id: 'a', text: 'The entire Promise.all rejects immediately (fail-fast)' },
        { id: 'b', text: 'The other Promises are cancelled' },
        { id: 'c', text: 'It returns partial results for the successful ones' },
        { id: 'd', text: 'It retries automatically' },
      ],
      correctId: 'a',
      explanation: '`Promise.all` is "all or nothing". One rejection rejects the whole batch. Use `Promise.allSettled` if you want results for all, including failures.',
    },
  ],
};

const jsQuiz3: Quiz = {
  id: 'js-q3',
  courseId: 'javascript-deep-dive',
  lessonId: 'js-3',
  title: 'map / filter / reduce Quiz',
  questions: [
    {
      id: 'j3q1',
      question: 'What does this return?\n\n[1, 2, 3].map(n => n * 2)',
      type: 'code-output',
      options: [
        { id: 'a', text: '[2, 4, 6]' },
        { id: 'b', text: '6' },
        { id: 'c', text: '[1, 2, 3]' },
        { id: 'd', text: '12' },
      ],
      correctId: 'a',
      explanation: '`map` returns a new array of the same length. Each element is transformed by the callback. Original array is not mutated.',
    },
    {
      id: 'j3q2',
      question: 'What does this return?\n\n[1, 2, 3, 4, 5].filter(n => n % 2 === 0)',
      type: 'code-output',
      options: [
        { id: 'a', text: '[2, 4]' },
        { id: 'b', text: '[1, 3, 5]' },
        { id: 'c', text: 'true' },
        { id: 'd', text: '[2, 4, 6]' },
      ],
      correctId: 'a',
      explanation: '`filter` keeps only elements where the callback returns true. `n % 2 === 0` is true for even numbers: 2 and 4.',
    },
    {
      id: 'j3q3',
      question: 'What does reduce return here?\n\n[1, 2, 3, 4].reduce((acc, n) => acc + n, 0)',
      type: 'code-output',
      options: [
        { id: 'a', text: '10' },
        { id: 'b', text: '[1, 2, 3, 4]' },
        { id: 'c', text: '0' },
        { id: 'd', text: '4' },
      ],
      correctId: 'a',
      explanation: 'reduce accumulates: 0+1=1, 1+2=3, 3+3=6, 6+4=10. The second argument (0) is the initial accumulator value.',
    },
    {
      id: 'j3q4',
      question: 'Which method should you use to find the first element matching a condition?',
      type: 'mcq',
      options: [
        { id: 'a', text: '.find(callback)' },
        { id: 'b', text: '.filter(callback)[0]' },
        { id: 'c', text: '.map(callback)[0]' },
        { id: 'd', text: '.reduce(callback)' },
      ],
      correctId: 'a',
      explanation: '`.find()` stops as soon as it finds a match and returns the element (or undefined). `.filter()[0]` works but scans the whole array even after finding a match — wasteful.',
    },
    {
      id: 'j3q5',
      question: 'What is wrong here?\n\nconst doubled = [1,2,3].map(n => {\n  n * 2;\n});',
      type: 'mcq',
      options: [
        { id: 'a', text: 'Missing return — the block body doesn\'t auto-return. doubled is [undefined, undefined, undefined]' },
        { id: 'b', text: 'Nothing — it works fine' },
        { id: 'c', text: 'map doesn\'t accept block bodies' },
        { id: 'd', text: 'n * 2 is invalid syntax' },
      ],
      correctId: 'a',
      explanation: 'Arrow functions with `{}` need an explicit `return`. Without it, the function returns undefined. Fix: `n => n * 2` (concise) or `n => { return n * 2; }` (block).',
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// SQL QUIZZES
// ─────────────────────────────────────────────────────────────────────────────

const sqlQuiz1: Quiz = {
  id: 'sql-q1',
  courseId: 'sql-for-data',
  lessonId: 'sql-1',
  title: 'SELECT & WHERE Quiz',
  questions: [
    {
      id: 's1q1',
      question: 'Which query returns all columns from the users table?',
      type: 'mcq',
      options: [
        { id: 'a', text: 'SELECT * FROM users;' },
        { id: 'b', text: 'GET ALL FROM users;' },
        { id: 'c', text: 'SELECT ALL users;' },
        { id: 'd', text: 'FETCH users.*;' },
      ],
      correctId: 'a',
      explanation: '`SELECT *` selects all columns. `FROM users` specifies the table. This is the most basic SQL query.',
    },
    {
      id: 's1q2',
      question: 'You want users where age > 18 AND city = "London". Which query is correct?',
      type: 'mcq',
      options: [
        { id: 'a', text: 'SELECT * FROM users WHERE age > 18 AND city = \'London\';' },
        { id: 'b', text: 'SELECT * FROM users IF age > 18 AND city = \'London\';' },
        { id: 'c', text: 'SELECT * FROM users HAVING age > 18 AND city = \'London\';' },
        { id: 'd', text: 'SELECT * FROM users WHERE age > 18 INTERSECT city = \'London\';' },
      ],
      correctId: 'a',
      explanation: 'Use WHERE to filter rows, AND to combine conditions. HAVING is for filtering aggregated results (after GROUP BY). IF and INTERSECT are not valid here.',
    },
    {
      id: 's1q3',
      question: 'What does ORDER BY name DESC do?',
      type: 'mcq',
      options: [
        { id: 'a', text: 'Sorts results alphabetically in reverse (Z → A)' },
        { id: 'b', text: 'Sorts results alphabetically (A → Z)' },
        { id: 'c', text: 'Removes duplicate names' },
        { id: 'd', text: 'Deletes rows where name is null' },
      ],
      correctId: 'a',
      explanation: 'ORDER BY sorts results. ASC is ascending (default, A→Z / smallest first), DESC is descending (Z→A / largest first).',
    },
    {
      id: 's1q4',
      question: 'Which keyword limits results to 10 rows?',
      type: 'mcq',
      options: [
        { id: 'a', text: 'LIMIT 10' },
        { id: 'b', text: 'TOP 10' },
        { id: 'c', text: 'FETCH 10' },
        { id: 'd', text: 'COUNT 10' },
      ],
      correctId: 'a',
      explanation: '`LIMIT` is standard SQL (MySQL, PostgreSQL, SQLite). SQL Server uses `TOP`. PostgreSQL also supports `FETCH FIRST 10 ROWS ONLY`.',
    },
    {
      id: 's1q5',
      question: 'What does DISTINCT do?\n\nSELECT DISTINCT country FROM users;',
      type: 'mcq',
      options: [
        { id: 'a', text: 'Returns only unique country values, removing duplicates' },
        { id: 'b', text: 'Counts how many distinct countries there are' },
        { id: 'c', text: 'Sorts by country' },
        { id: 'd', text: 'Filters out NULL countries' },
      ],
      correctId: 'a',
      explanation: 'DISTINCT deduplicates the result set. If 1000 users are from 3 countries, `SELECT DISTINCT country` returns 3 rows, one per country.',
    },
  ],
};

const sqlQuiz2: Quiz = {
  id: 'sql-q2',
  courseId: 'sql-for-data',
  lessonId: 'sql-2',
  title: 'JOINs Quiz',
  questions: [
    {
      id: 's2q1',
      question: 'What does INNER JOIN return?',
      type: 'mcq',
      options: [
        { id: 'a', text: 'Only rows where the join condition matches in BOTH tables' },
        { id: 'b', text: 'All rows from the left table, NULLs for non-matching right' },
        { id: 'c', text: 'All rows from both tables, matched or not' },
        { id: 'd', text: 'Only rows that DON\'T match' },
      ],
      correctId: 'a',
      explanation: 'INNER JOIN is the intersection. If a user has no orders, they don\'t appear. If an order has no user (orphan), it doesn\'t appear. Only matched pairs.',
    },
    {
      id: 's2q2',
      question: 'You want ALL users, even those with no orders. Which JOIN?',
      type: 'mcq',
      options: [
        { id: 'a', text: 'LEFT JOIN users ON orders.user_id = users.id' },
        { id: 'b', text: 'INNER JOIN orders ON users.id = orders.user_id' },
        { id: 'c', text: 'RIGHT JOIN orders ON orders.user_id = users.id' },
        { id: 'd', text: 'CROSS JOIN orders' },
      ],
      correctId: 'a',
      explanation: 'LEFT JOIN keeps all rows from the "left" table (users). Columns from orders will be NULL for users with no orders. This is the most commonly used JOIN in practice.',
    },
    {
      id: 's2q3',
      question: 'Table A has 3 rows, Table B has 4 rows. A CROSS JOIN returns how many rows?',
      type: 'mcq',
      options: [
        { id: 'a', text: '12 (3 × 4 — every combination)' },
        { id: 'b', text: '7 (3 + 4)' },
        { id: 'c', text: '3 (minimum of the two)' },
        { id: 'd', text: 'Depends on the ON condition' },
      ],
      correctId: 'a',
      explanation: 'CROSS JOIN has no ON condition — it pairs every row from A with every row from B. Rarely useful; mostly used for generating test data or combinations.',
    },
    {
      id: 's2q4',
      question: 'What does this query find?\n\nSELECT u.name, COUNT(o.id) AS order_count\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nGROUP BY u.id;',
      type: 'mcq',
      options: [
        { id: 'a', text: 'Each user\'s name and how many orders they\'ve placed (0 if none)' },
        { id: 'b', text: 'Only users who have placed at least one order' },
        { id: 'c', text: 'The total number of orders' },
        { id: 'd', text: 'Error — you can\'t COUNT after a LEFT JOIN' },
      ],
      correctId: 'a',
      explanation: 'LEFT JOIN + GROUP BY + COUNT is a classic pattern. Users with no orders show count=0 because COUNT(o.id) counts non-NULL values, and LEFT JOIN puts NULL in o.id for unmatched users.',
    },
  ],
};

const sqlQuiz3: Quiz = {
  id: 'sql-q3',
  courseId: 'sql-for-data',
  lessonId: 'sql-3',
  title: 'GROUP BY & Aggregates Quiz',
  questions: [
    {
      id: 's3q1',
      question: 'What do aggregate functions do?',
      type: 'mcq',
      options: [
        { id: 'a', text: 'Collapse multiple rows into a single summary value (e.g., COUNT, SUM, AVG)' },
        { id: 'b', text: 'Sort the result set' },
        { id: 'c', text: 'Filter rows before grouping' },
        { id: 'd', text: 'Join two tables together' },
      ],
      correctId: 'a',
      explanation: 'Aggregates summarize data: COUNT() counts rows, SUM() totals a column, AVG() averages, MIN()/MAX() find extremes. They collapse a group of rows into one output row.',
    },
    {
      id: 's3q2',
      question: 'What is the difference between WHERE and HAVING?',
      type: 'mcq',
      options: [
        { id: 'a', text: 'WHERE filters rows BEFORE grouping; HAVING filters AFTER (on aggregate results)' },
        { id: 'b', text: 'HAVING is faster than WHERE' },
        { id: 'c', text: 'WHERE works on groups, HAVING works on individual rows' },
        { id: 'd', text: 'They are interchangeable' },
      ],
      correctId: 'a',
      explanation: 'ORDER of operations: WHERE → GROUP BY → HAVING. You can\'t use `WHERE COUNT(*) > 5` because grouping hasn\'t happened yet. Use `HAVING COUNT(*) > 5` instead.',
    },
    {
      id: 's3q3',
      question: 'Which query finds the average order value per customer?',
      type: 'mcq',
      options: [
        { id: 'a', text: 'SELECT customer_id, AVG(amount) FROM orders GROUP BY customer_id;' },
        { id: 'b', text: 'SELECT AVG(amount) FROM orders WHERE customer_id;' },
        { id: 'c', text: 'SELECT customer_id, amount FROM orders ORDER BY AVG(amount);' },
        { id: 'd', text: 'SELECT customer_id, AVERAGE(amount) FROM orders;' },
      ],
      correctId: 'a',
      explanation: 'GROUP BY customer_id creates a group per customer. AVG(amount) calculates the average amount within each group. AVERAGE() is not valid SQL — use AVG().',
    },
    {
      id: 's3q4',
      question: 'What does this return?\n\nSELECT department, COUNT(*) AS headcount\nFROM employees\nGROUP BY department\nHAVING COUNT(*) > 5\nORDER BY headcount DESC;',
      type: 'mcq',
      options: [
        { id: 'a', text: 'Departments with more than 5 employees, largest first' },
        { id: 'b', text: 'The 5 largest departments' },
        { id: 'c', text: 'All departments ordered by headcount, descending' },
        { id: 'd', text: 'Error — HAVING cannot reference an alias' },
      ],
      correctId: 'a',
      explanation: 'HAVING COUNT(*) > 5 filters out small departments. ORDER BY headcount DESC sorts the remaining ones largest-first. (Most databases allow referencing the alias in ORDER BY but not in HAVING — use COUNT(*) in HAVING to be safe.)',
    },
  ],
};

const sqlQuiz4: Quiz = {
  id: 'sql-q4',
  courseId: 'sql-for-data',
  lessonId: 'sql-4',
  title: 'Subqueries & CTEs Quiz',
  questions: [
    {
      id: 's4q1',
      question: 'What is a CTE (Common Table Expression)?',
      type: 'mcq',
      options: [
        { id: 'a', text: 'A named temporary result set defined with WITH, used to simplify complex queries' },
        { id: 'b', text: 'A stored procedure that runs on a schedule' },
        { id: 'c', text: 'A type of index' },
        { id: 'd', text: 'A way to create a permanent table from a SELECT' },
      ],
      correctId: 'a',
      explanation: 'WITH cte_name AS (SELECT ...) lets you name a subquery and reference it cleanly. It lives only for the duration of the statement and makes long queries much more readable.',
    },
    {
      id: 's4q2',
      question: 'What does this subquery do?\n\nSELECT name FROM users\nWHERE id IN (SELECT user_id FROM orders WHERE amount > 100);',
      type: 'mcq',
      options: [
        { id: 'a', text: 'Returns names of users who have at least one order over $100' },
        { id: 'b', text: 'Returns all users and their order amounts' },
        { id: 'c', text: 'Deletes orders under $100' },
        { id: 'd', text: 'Error — subqueries can\'t be inside WHERE' },
      ],
      correctId: 'a',
      explanation: 'The inner query finds user_ids of big spenders. The outer query fetches names for those IDs. `IN (subquery)` is a clean way to filter by membership in a derived set.',
    },
    {
      id: 's4q3',
      question: 'When should you prefer a CTE over a subquery?',
      type: 'mcq',
      options: [
        { id: 'a', text: 'When you need to reuse the same intermediate result multiple times in one query' },
        { id: 'b', text: 'Always — CTEs are always faster' },
        { id: 'c', text: 'When writing INSERT statements only' },
        { id: 'd', text: 'When the subquery returns more than 1000 rows' },
      ],
      correctId: 'a',
      explanation: 'CTEs shine when the same intermediate dataset is referenced 2+ times — you write it once, name it, and reuse it. They also make complex logic much easier to read and debug step-by-step.',
    },
    {
      id: 's4q4',
      question: 'What is a correlated subquery?',
      type: 'mcq',
      options: [
        { id: 'a', text: 'A subquery that references a column from the outer query and runs once per outer row' },
        { id: 'b', text: 'A subquery using JOIN' },
        { id: 'c', text: 'A subquery inside a CTE' },
        { id: 'd', text: 'Two subqueries joined with UNION' },
      ],
      correctId: 'a',
      explanation: 'Example: `WHERE salary > (SELECT AVG(salary) FROM employees e2 WHERE e2.dept = e.dept)` — the inner query uses `e.dept` from the outer query. This runs once per outer row, which can be slow on large tables.',
    },
  ],
};

export const QUIZZES: Quiz[] = [
  reactQuiz1, reactQuiz2, reactQuiz3,
  jsQuiz1, jsQuiz2, jsQuiz3,
  sqlQuiz1, sqlQuiz2, sqlQuiz3, sqlQuiz4,
];

export function getQuizForLesson(courseId: string, lessonId: string): Quiz | undefined {
  return QUIZZES.find(q => q.courseId === courseId && q.lessonId === lessonId);
}
