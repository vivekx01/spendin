import { getDb } from './database.js';

const TABLES = [
  `CREATE TABLE IF NOT EXISTS accounts (
    id TEXT PRIMARY KEY,
    account_type TEXT CHECK(account_type IN ('Bank', 'Credit')) NOT NULL,
    account_name TEXT NOT NULL,
    account_balance REAL NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS allocations (
    id TEXT PRIMARY KEY,
    allocation_account TEXT NOT NULL,
    allocation_name TEXT NOT NULL,
    allocation_amount REAL NOT NULL,
    FOREIGN KEY (allocation_account) REFERENCES accounts(id)
  );`,
  `CREATE TABLE IF NOT EXISTS spends (
    id TEXT PRIMARY KEY,
    spend_category TEXT NOT NULL,
    spend_source TEXT NOT NULL,
    spend_amount REAL NOT NULL,
    spend_datetime INTEGER NOT NULL,
    spend_name TEXT NOT NULL,
    spend_notes TEXT,
    transaction_type TEXT NOT NULL DEFAULT 'Expense',
    FOREIGN KEY (spend_category) REFERENCES allocations(id),
    FOREIGN KEY (spend_source) REFERENCES accounts(id)
  );`,
  `CREATE TABLE IF NOT EXISTS presets (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    account TEXT NOT NULL,
    allocation TEXT NOT NULL,
    FOREIGN KEY (account) REFERENCES accounts(id),
    FOREIGN KEY (allocation) REFERENCES allocations(id)
  );`,
  `CREATE TABLE IF NOT EXISTS userinfo (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
  );`
];

async function setupDatabase() {
  try {
    const db = await getDb();

    for (const query of TABLES) {
      await db.execAsync(query);
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

export { setupDatabase };
