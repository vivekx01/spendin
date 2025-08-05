export const fetchEmailsFromLastDay = async (accessToken: string) => {
    try {
        // Calculate seconds since epoch for 24 hours ago
        const oneDayAgoUnix = Math.floor((Date.now() - 24 * 60 * 60 * 1000) / 1000);

        // Gmail query for messages after oneDayAgoUnix timestamp
        const query = `after:${oneDayAgoUnix}`;

        // Fetch message IDs matching query
        const listRes = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        const listData = await listRes.json();

        if (!listData.messages || listData.messages.length === 0) {
            return []; // No emails in this timeframe
        }

        // Fetch full message data for each message ID (limit to avoid overload)
        const messagePromises = listData.messages.slice(0, 50).map(async (msg: { id: string }) => {
            const msgRes = await fetch(
                `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`,
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            );
            return await msgRes.json();
        });

        const messages = await Promise.all(messagePromises);
        return messages; // array of full message objects

    } catch (error) {
        console.error('Failed to fetch emails:', error);
        return [];
    }
};