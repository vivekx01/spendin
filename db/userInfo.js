import { getDb } from './database.js';
import * as Crypto from 'expo-crypto';

export async function getUserInfo () {
    const db = await getDb();
    const info = await db.getFirstAsync("SELECT name FROM userinfo");
    return info;
}

export async function setUserInfo (name) {
    const db = await getDb();
    const userId = await Crypto.randomUUID();
    await db.runAsync(
        "INSERT INTO userinfo (id, name) VALUES (?, ?);",
        userId, name
    );
    console.log("User info set:", name, userId);
    return userId;
}
