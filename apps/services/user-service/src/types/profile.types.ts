export interface CreateProfileInput {
  accountId: string;
}

export interface UpdateBioInput {
  accountId: string;
  bio: string;
}

export interface UpdateAvatarInput {
  accountId: string;
  avatarUrl: string;
}
