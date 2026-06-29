import { apiFetch, uploadFileToPresignedUrl } from '../lib/apiClient';
import type { ApiComment, ApiLike, ApiPost, UploadUrlResult } from '../lib/apiTypes';

export function listPostsByEstablishment(establishmentId: string): Promise<ApiPost[]> {
  return apiFetch<ApiPost[]>(`/post/establishments/${establishmentId}/posts`, { auth: false });
}

export function getPost(postId: string): Promise<ApiPost> {
  return apiFetch<ApiPost>(`/post/posts/${postId}`, { auth: false });
}

interface CreatePostInput {
  userId: string;
  establishmentId?: string;
  imageUrls: string[];
  caption?: string;
}

export function createPost(input: CreatePostInput): Promise<ApiPost> {
  return apiFetch<ApiPost>('/post/posts', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updatePostCaption(postId: string, caption: string): Promise<ApiPost> {
  return apiFetch<ApiPost>(`/post/posts/${postId}`, {
    method: 'PATCH',
    body: JSON.stringify({ caption }),
  });
}

export function deletePost(postId: string): Promise<void> {
  return apiFetch<void>(`/post/posts/${postId}`, { method: 'DELETE' });
}

// ---- Upload de imagens (fluxo de 2 passos: pega URL pré-assinada, depois PUT direto no bucket) ----

export async function getUploadUrls(userId: string, count: number): Promise<UploadUrlResult[]> {
  return apiFetch<UploadUrlResult[]>('/post/posts/upload-url', {
    method: 'POST',
    body: JSON.stringify({ userId, count }),
  });
}

/**
 * Recebe os arquivos escolhidos pelo usuário, pega as URLs pré-assinadas,
 * envia cada arquivo direto pro bucket e retorna as publicUrls finais
 * (na mesma ordem dos arquivos), prontas pra usar em createPost().
 */
export async function uploadPostImages(userId: string, files: File[]): Promise<string[]> {
  if (files.length === 0) return [];
  const slots = await getUploadUrls(userId, files.length);
  await Promise.all(slots.map((slot, i) => uploadFileToPresignedUrl(slot.uploadUrl, files[i])));
  return slots.map((slot) => {
    // Backend API validation requires a valid URI. Se o publicUrl vier
    // só como "cdn.vibester.com.br/...", adicionamos o protocolo:
    return slot.publicUrl.startsWith('http') ? slot.publicUrl : `https://${slot.publicUrl}`;
  });
}

// ---- Likes ----

export function likePost(postId: string, userId: string): Promise<ApiLike> {
  return apiFetch<ApiLike>(`/post/posts/${postId}/likes`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });
}

export function unlikePost(postId: string, userId: string): Promise<void> {
  return apiFetch<void>(`/post/posts/${postId}/likes`, {
    method: 'DELETE',
    body: JSON.stringify({ userId }),
  });
}

export function listLikes(postId: string): Promise<ApiLike[]> {
  return apiFetch<ApiLike[]>(`/post/posts/${postId}/likes`, { auth: false });
}

// ---- Comentários ----

export function listComments(postId: string): Promise<ApiComment[]> {
  return apiFetch<ApiComment[]>(`/post/posts/${postId}/comments`, { auth: false });
}

export function createComment(postId: string, userId: string, content: string): Promise<ApiComment> {
  return apiFetch<ApiComment>('/post/comments', {
    method: 'POST',
    body: JSON.stringify({ postId, userId, content }),
  });
}

export function updateComment(commentId: string, userId: string, content: string): Promise<ApiComment> {
  return apiFetch<ApiComment>(`/post/comments/${commentId}`, {
    method: 'PATCH',
    body: JSON.stringify({ userId, content }),
  });
}

export function deleteComment(commentId: string, userId: string): Promise<void> {
  return apiFetch<void>(`/post/comments/${commentId}`, {
    method: 'DELETE',
    body: JSON.stringify({ userId }),
  });
}
