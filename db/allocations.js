// db/allocations.js

import { getDb } from './database';
import * as Crypto from 'expo-crypto';
import { logError } from './errorlogs';

export async function getAllocationsByAccountId(accountId) {
    try {
        const db = await getDb();

        const results = await db.getAllAsync(
            `
            SELECT id, allocation_account, allocation_name, allocation_amount
            FROM allocations
            WHERE allocation_account = ?
            `,
            accountId
        );

        return results; // returns array of matching allocations
    } catch (error) {
        logError(error.message, error.stack);
        return []; // empty array if something fails
    }
}

export async function addNewAllocation({ allocationAccountId, allocationName, allocationAmount }) {
    try {
        const db = await getDb();

        // Generate UUID for allocation ID
        const id = await Crypto.randomUUID();
        await db.runAsync(
            `
            INSERT INTO allocations (id, allocation_account, allocation_name, allocation_amount)
            VALUES (?, ?, ?, ?)
            `,
            id,
            allocationAccountId,
            allocationName,
            allocationAmount
        );

        return true;
    } catch (error) {
        logError(error.message, error.stack);
        return false;
    }
}

export async function updateAllocation({ allocationId, allocationAccountId, allocationName, allocationAmount }) {
    try {
        const db = await getDb();

        await db.runAsync(
            `
            UPDATE allocations
            SET allocation_account = ?, allocation_name = ?, allocation_amount = ?
            WHERE id = ?
            `,
            allocationAccountId,
            allocationName,
            allocationAmount,
            allocationId
        );

        return true;
    } catch (error) {
        logError(error.message, error.stack);
        return false;
    }
}
