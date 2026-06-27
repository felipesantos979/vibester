export interface Post {
    postId: string;

    userId: string;
    username: string;
    userProfilePicture: string;
    userVerified: boolean;

    establishmentId?: string;
    establishmentName?: string;
    establishmentLogo?: string;
    establishmentCategory?: string;

    imageUrls: string[];
    caption?: string;
    tags?: string[];

    totalLikes: number;
    totalComments: number;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt?: Date;
}