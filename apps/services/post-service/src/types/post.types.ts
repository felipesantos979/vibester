export interface Post {
  postId: string;
  userId: string;
  establishmentId?: string;
  imageUrls: string[];
  caption: string;
  totalLikes: number;
  totalComments: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreatePostInput {
  userId: string;
  establishmentId?: string;
  imageUrls: string[];
  caption: string;
}

export interface UpdatePostInput {
  postId: string;
  caption: string;
}