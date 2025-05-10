import * as SQLite from 'expo-sqlite';

export async function migrateDb() {
    const db = await SQLite.openDatabaseAsync('expenses');

    // ---- Define all migrations here ----
    const migrations = [
        {
            toVersion: 1,
            migrate: async () => {
                // Step 1: Create a new table with spend_category as nullable
                await db.execAsync(`
                    CREATE TABLE IF NOT EXISTS spends_temp (
                        id TEXT PRIMARY KEY,
                        spend_category TEXT,
                        spend_source TEXT NOT NULL,
                        spend_amount REAL NOT NULL,
                        spend_datetime INTEGER NOT NULL,
                        spend_name TEXT NOT NULL,
                        spend_notes TEXT,
                        transaction_type TEXT NOT NULL DEFAULT 'Expense',
                        FOREIGN KEY (spend_category) REFERENCES allocations(id),
                        FOREIGN KEY (spend_source) REFERENCES accounts(id)
                    );
                `);

                // Step 2: Copy data from the old table to the new table
                await db.execAsync(`
                    INSERT INTO spends_temp (id, spend_category, spend_source, spend_amount, spend_datetime, spend_name, spend_notes, transaction_type)
                    SELECT id, spend_category, spend_source, spend_amount, spend_datetime, spend_name, spend_notes, transaction_type
                    FROM spends;
                `);

                // Step 3: Drop the original table
                await db.execAsync(`
                    DROP TABLE IF EXISTS spends;
                `);

                // Step 4: Rename the temporary table to the original table name
                await db.execAsync(`
                    ALTER TABLE spends_temp RENAME TO spends;
                `);
            },
        },
    ];

    // --- Helpers ---
    const getPragmaVersion = async() => {
        const result = await db.getAllAsync('PRAGMA user_version;');
        const version = result[0].user_version;
        return version;
    };

    const setPragmaVersion = async(newVersion) => {
        await db.runAsync(`PRAGMA user_version = ${newVersion};`);
        return true;
    };

    // --- Run migrations ---
    let currentVersion = await getPragmaVersion();
    for (const migration of migrations) {
        if (migration.toVersion > currentVersion) {
            await migration.migrate();
            await setPragmaVersion(migration.toVersion);
        }
    }

}
