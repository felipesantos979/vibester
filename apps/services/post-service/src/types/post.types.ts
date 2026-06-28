export interface Post {
    postId: string;
    userId: string;
    userUsername?: string;
    userProfilePicture?: string;
    userVerified?: boolean;
    establishmentId?: string;
    establishmentName?: string;
    establishmentLogo?: string;
    establishmentCategory?: string;
    imageUrls: string[];
    caption: string;
    tags?: string[];
    totalLikes: number;
    totalComments: number;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt?: Date;
}

export interface CreatePostInput {
    userId: string;
    userUsername?: string;
    userProfilePicture?: string;
    userVerified?: boolean;
    establishmentId?: string;
    establishmentName?: string;
    establishmentLogo?: string;
    establishmentCategory?: string;
    caption: string;
    tags?: string[];
    imageUrls: string[];
}

export interface UpdatePostInput {
    postId: string;
    caption: string;
}

export interface CreatePostData {
  userId: string;
  establishmentId?: string;
  caption: string;
  imageUrls: string[];
}