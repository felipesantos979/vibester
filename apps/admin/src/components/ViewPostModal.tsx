import { useState, useEffect } from 'react';
import { X, Heart, Trash2, Loader2 } from 'lucide-react';
import { formatTimeAgo } from '../lib/dateUtils';
import { getProfile } from '../api/profile';
import { listComments, listLikes, likePost, unlikePost, createComment } from '../api/posts';
import type { ApiPost, ApiComment } from '../lib/apiTypes';

const profileNameCache = new Map<string, string>();

async function resolveDisplayName(userId: string): Promise<string> {
  if (profileNameCache.has(userId)) return profileNameCache.get(userId)!;
  try {
    const profile = await getProfile(userId);
    const name = profile?.name || profile?.username || `Usuário ${userId.slice(0, 6)}`;
    profileNameCache.set(userId, name);
    return name;
  } catch {
    return `Usuário ${userId.slice(0, 6)}`;
  }
}

function CommentRow({ comment, currentUserId }: { comment: ApiComment, currentUserId: string | null }) {
  const isOwner = currentUserId === comment.userId;
  const [authorName, setAuthorName] = useState(isOwner ? 'Neon Pub' : `Usuário ${comment.userId.slice(0, 6)}`);
  
  useEffect(() => { 
    if (!isOwner) {
      resolveDisplayName(comment.userId).then(setAuthorName); 
    }
  }, [comment.userId, isOwner]);

  if (isOwner) {
    return (
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-brand-fire/20 border border-brand-fire/30 flex items-center justify-center text-xs text-brand-fire shrink-0 font-bold">NP</div>
        <div className="flex-1">
          <p className="text-sm text-gray-300 leading-snug"><span className="font-bold text-brand-fire mr-2">Neon Pub</span>{comment.content}</p>
          <span className="text-xs text-gray-500 font-medium mt-1.5 block">{formatTimeAgo(comment.createdAt)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs text-white shrink-0 font-bold uppercase">{authorName.slice(0, 2)}</div>
      <div className="flex-1">
        <p className="text-sm text-gray-300 leading-snug"><span className="font-bold text-white mr-2">{authorName}</span>{comment.content}</p>
        <span className="text-xs text-gray-500 font-medium mt-1.5 block">{formatTimeAgo(comment.createdAt)}</span>
      </div>
    </div>
  );
}

export default function ViewPostModal({ post, accountId, onClose, onDelete }: {
  post: ApiPost; accountId: string | null; onClose: () => void; onDelete: (id: string) => void;
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [localLikes, setLocalLikes] = useState(post.totalLikes);
  const [comments, setComments] = useState<ApiComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [newCommentText, setNewCommentText] = useState('');
  const [sendingComment, setSendingComment] = useState(false);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  useEffect(() => {
    let active = true;
    setLoadingComments(true);
    listComments(post.postId).then((list) => { if (active) setComments(list.filter((c) => !c.isDeleted)); }).catch(() => {}).finally(() => active && setLoadingComments(false));
    if (accountId) { listLikes(post.postId).then((likes) => { if (active) setIsLiked(likes.some((l) => l.userId === accountId)); }).catch(() => {}); }
    return () => { active = false; };
  }, [post.postId, accountId]);

  const handleLike = async () => {
    if (!accountId) return;
    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    setLocalLikes((n) => (nextLiked ? n + 1 : Math.max(0, n - 1)));
    try {
      if (nextLiked) { await likePost(post.postId, accountId); } else { await unlikePost(post.postId, accountId); }
    } catch { setIsLiked(!nextLiked); setLocalLikes((n) => (nextLiked ? Math.max(0, n - 1) : n + 1)); }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !accountId || sendingComment) return;
    setSendingComment(true);
    try {
      const created = await createComment(post.postId, accountId, newCommentText.trim());
      setComments((prev) => [created, ...prev]);
      setNewCommentText('');
    } catch {} finally { setSendingComment(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-0 md:p-4" onClick={onClose}>
      <div className="relative w-full max-w-4xl h-full md:h-[85vh] bg-bg-card md:rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors z-20 bg-black/50 rounded-full backdrop-blur-sm"><X className="w-6 h-6" /></button>
        <div className="w-full md:w-[55%] h-[40vh] md:h-full bg-black flex items-center justify-center shrink-0 border-b md:border-b-0 md:border-r border-white/10">
          <img src={post.imageUrls[0]} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="w-full md:w-[45%] flex-1 flex flex-col relative min-h-0 bg-bg-card">
          <div className="p-4 border-b border-white/10 flex items-start justify-between shrink-0">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-fire/20 border border-brand-fire/30 flex items-center justify-center text-sm font-bold text-brand-fire shrink-0">NP</div>
              <div>
                <p className="font-bold text-white text-sm">Neon Pub</p>
                <p className="text-gray-300 text-sm mt-1 leading-relaxed">{post.caption}</p>
                <p className="text-xs text-gray-500 mt-2">{formatTimeAgo(post.createdAt)}</p>
              </div>
            </div>
            <button onClick={() => onDelete(post.postId)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors shrink-0"><Trash2 className="w-4 h-4" /></button>
          </div>
          <div className="px-4 py-3 border-b border-white/10 flex items-center gap-3 shrink-0 bg-white/[0.02]">
            <button onClick={handleLike} disabled={!accountId} className="hover:scale-110 transition-transform active:scale-95 disabled:opacity-40">
              <Heart className={`w-6 h-6 transition-colors ${isLiked ? 'fill-brand-fire text-brand-fire' : 'text-white'}`} />
            </button>
            <span className="font-bold text-white text-sm">{localLikes} curtidas</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {loadingComments ? (<div className="flex items-center justify-center py-8 text-gray-500"><Loader2 className="w-5 h-5 animate-spin" /></div>)
              : comments.length === 0 ? (<p className="text-sm text-gray-500 text-center py-8">Nenhum comentário ainda.</p>)
              : (comments.map((c) => <CommentRow key={c.commentId} comment={c} currentUserId={accountId} />))}
          </div>
          <div className="p-4 border-t border-white/10 shrink-0 bg-bg-card">
            <form onSubmit={handleAddComment} className="flex items-center gap-3">
              <input type="text" value={newCommentText} onChange={(e) => setNewCommentText(e.target.value)} placeholder={accountId ? 'Adicione um comentário...' : 'Faça login para comentar'} disabled={!accountId || sendingComment} className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-gray-500 disabled:opacity-50" />
              <button type="submit" disabled={!newCommentText.trim() || !accountId || sendingComment} className="text-brand-fire font-bold text-sm disabled:opacity-50 transition-opacity">
                {sendingComment ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publicar'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
