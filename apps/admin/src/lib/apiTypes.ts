// Tipos que espelham os schemas reais documentados em
// https://api.vibester.com.br/docs (openapi.json).
// Mantenha isso em dia se o backend mudar os schemas.

export interface MovementLevel {
  level: string;
  source: string;
  updatedAt: string;
}

// Resposta de GET /establishment/establishments e GET /establishment/establishments/open
export interface Establishment {
  id: string;
  googlePlaceId: string | null;
  name: string;
  photoUrl: string | null;
  bannerUrl: string | null;
  category: string;
  priceIndicator: string | null;
  averageRating: number;
  latitude: number;
  longitude: number;
  movementLevel: MovementLevel | null;
  distanceTo?: number;
}

// Resposta de GET /establishment/establishments/{id}
export interface EstablishmentProfile {
  icon: string | null;
  name: string;
  banner: string | null;
  location: { latitude: number; longitude: number };
  category: string;
  priceIndicator: string | null;
  rating: number;
  movementLevel: MovementLevel | null;
}

// ---- Auth ----
export interface LoginResponse {
  authId: string;
  token: string;
  accountId: string;
}

export interface RegisterResponse {
  authId: string;
  accountId: string;
  username: string;
  name: string;
  email: string;
  bornAt: string;
  createdAt: string;
  updatedAt: string;
}

// ---- Posts ----
export interface ApiPost {
  postId: string;
  userId: string;
  establishmentId: string | null;
  imageUrls: string[];
  caption: string;
  totalLikes: number;
  totalComments: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface UploadUrlResult {
  uploadUrl: string;
  key: string;
  publicUrl: string;
}

export interface ApiComment {
  commentId: string;
  postId: string;
  userId: string;
  content: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface ApiLike {
  postId: string;
  userId: string;
  likedAt: string;
}

// ---- Profile ----
export interface UserProfile {
  accountId: string;
  name: string | null;
  username: string | null;
  avatarUrl: string | null;
  bio: string | null;
  followers: number;
  following: number;
  totalPosts: number;
  createdAt: string;
  updatedAt: string;
}
