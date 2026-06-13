export interface LikePostInput {
    postId: string;
    userId: string;
}

export interface PostLike {
    postId: string;
    userId: string;
    likedAt: Date;
}