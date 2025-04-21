import { getDb } from './db.js';

export async function getUserInfo () {
    const db = await getDb();
    const info = await db.getFirstAsync("SELECT name FROM userinfo");
    return info;
}