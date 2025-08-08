// utils/fetchLatestEmails.ts
import { ParseGmailApi, IEmail } from 'gmail-api-parse-message-ts';

interface SimpleEmail {
    id: string;
    from: string;
    subject: string;
    date: string;
    body: string;
}

export async function fetchLatestEmails(
    accessToken: string
): Promise<SimpleEmail[]> {
    const parse = new ParseGmailApi();

    // Step 1: List the latest 10 messages
    const listRes = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10&orderBy=internalDate`,
        {
            headers: { Authorization: `Bearer ${accessToken}` },
        }
    );

    const listJson = await listRes.json();
    const messages = listJson.messages || [];

    // Step 2: Fetch and parse each
    const emailPromises = messages.map(async (msg: { id: string }) => {
        const msgRes = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        const msgJson = await msgRes.json();

        const parsed: any = parse.parseMessage(msgJson);

        return {
            id: msg.id,
            from: parsed.headers.from || '',
            subject: parsed.headers.subject || '',
            date: parsed.internalDate
                ? new Date(Number(parsed.internalDate)).toISOString()
                : parsed.headers.date || '',
            body: parsed.textPlain || parsed.textHtml || '',
        } as SimpleEmail;
    });

    const emails = await Promise.all(emailPromises);
    return emails;
}
