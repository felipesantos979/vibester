export interface PostCursor {
    createdAt: Date;
    postId: string;
}

export function encodeCursor(cursor: PostCursor): string {
    return Buffer.from(JSON.stringify({
        createdAt: cursor.createdAt.toISOString(),
        postId: cursor.postId,
    })).toString("base64url");
}

export function decodeCursor(raw: string | undefined): PostCursor | undefined {
    if (!raw) { return undefined; }

    try {
        const parsed = JSON.parse(Buffer.from(raw, "base64url").toString("utf8"));
        if (!parsed.createdAt || !parsed.postId) { return undefined; }
        return { createdAt: new Date(parsed.createdAt), postId: parsed.postId };
    } catch {
        return undefined;
    }
}
