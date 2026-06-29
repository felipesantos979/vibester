import { useState, useRef, useEffect, useCallback } from 'react';
import { ConfirmDialog } from '../components/ConfirmDialog';
import ViewPostModal from '../components/ViewPostModal';
import { Plus, Trash2, X, ChevronLeft, ChevronRight, Send, Smile, ImagePlus, Loader2 } from 'lucide-react';
import { getEstablishmentId } from '../lib/establishment';
import { getAccountId } from '../lib/session';
import {
  listPostsByEstablishment,
  uploadPostImages,
  createPost,
  deletePost as apiDeletePost,
} from '../api/posts';
import type { ApiPost } from '../lib/apiTypes';

const EMOJIS = ['🔥', '❤️', '🎉', '🎶', '🍹', '👏', '💃', '🕺', '🥂', '✨', '🎤', '🎸', '🎹', '🏆', '👑', '🌙', '⭐', '🎊', '🍾', '🎧'];

export default function Posts() {
  const [establishmentId, setEstablishmentId] = useState<string | null>(null);
  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState<ApiPost | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState('');
  const accountId = getAccountId();

  const [caption, setCaption] = useState('');
  const [photos, setPhotos] = useState<{ file: File; previewUrl: string }[]>([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [showEmojis, setShowEmojis] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const captionRef = useRef<HTMLTextAreaElement>(null);

  const loadPosts = useCallback(async () => {
    setLoading(true); setLoadError('');
    try {
      const estId = await getEstablishmentId();
      setEstablishmentId(estId);
      const list = await listPostsByEstablishment(estId);
      setPosts(list.filter((p) => !p.isDeleted).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Não foi possível carregar os posts.');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadPosts(); }, [loadPosts]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowCreateModal(false); };
    if (showCreateModal) window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [showCreateModal]);

  const handleFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 10 - photos.length;
    const toAdd = files.slice(0, remaining).map((file) => ({ file, previewUrl: URL.createObjectURL(file) }));
    setPhotos((prev) => [...prev, ...toAdd]);
    if (e.target) e.target.value = '';
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    if (carouselIndex >= photos.length - 1 && carouselIndex > 0) setCarouselIndex(carouselIndex - 1);
  };

  const insertEmoji = (emoji: string) => {
    const textarea = captionRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newCaption = caption.slice(0, start) + emoji + caption.slice(end);
      if (newCaption.length <= 250) {
        setCaption(newCaption);
        setTimeout(() => { textarea.selectionStart = textarea.selectionEnd = start + emoji.length; textarea.focus(); }, 0);
      }
    } else {
      if ((caption + emoji).length <= 250) setCaption(caption + emoji);
    }
    setShowEmojis(false);
  };

  const handlePublish = async () => {
    if (photos.length === 0 || !accountId || !establishmentId || publishing) return;
    setPublishing(true); setPublishError('');
    try {
      const imageUrls = await uploadPostImages(accountId, photos.map((p) => p.file));
      const created = await createPost({ userId: accountId, establishmentId, imageUrls, caption: caption || undefined });
      setPosts((prev) => [created, ...prev]);
      setCaption(''); setPhotos([]); setCarouselIndex(0); setShowCreateModal(false);
    } catch (err) {
      setPublishError(err instanceof Error ? err.message : 'Não foi possível publicar o post.');
    } finally { setPublishing(false); }
  };

  const handleDeletePost = (id: string) => { setConfirmDelete(id); };

  const confirmDeleteAction = async () => {
    if (confirmDelete === null) return;
    const id = confirmDelete;
    setConfirmDelete(null); setShowViewModal(null);
    try { await apiDeletePost(id); setPosts((prev) => prev.filter((p) => p.postId !== id)); } catch { loadPosts(); }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Posts &amp; Feed</h2>
          <p className="text-gray-400 mt-1">Publique fotos e atualizações do seu estabelecimento.</p>
        </div>
        <button onClick={() => { setPublishError(''); setShowCreateModal(true); }} disabled={!establishmentId || !accountId} className="bg-brand-fire hover:bg-[#ff571a] text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
          <Plus className="w-5 h-5" /> Criar Post
        </button>
      </div>

      {loadError && (<div className="bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-3 text-red-400 text-sm">{loadError}</div>)}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-500"><Loader2 className="w-6 h-6 animate-spin" /></div>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {posts.map((post) => (
            <div key={post.postId} className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer" onClick={() => setShowViewModal(post)}>
              <img src={post.imageUrls[0]} alt="" className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                <div className="flex items-center gap-4 text-white font-bold">
                  <div className="flex items-center gap-1.5"><span className="text-xl">❤️</span><span>{post.totalLikes}</span></div>
                  <div className="flex items-center gap-1.5"><span className="text-xl">💬</span><span>{post.totalComments}</span></div>
                </div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); handleDeletePost(post.postId); }} className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg font-medium mb-2">Nenhum post ainda</p>
          <p className="text-sm">Clique em "Criar Post" para publicar o primeiro!</p>
        </div>
      )}

      {showViewModal && <ViewPostModal post={showViewModal} accountId={accountId} onClose={() => setShowViewModal(null)} onDelete={handleDeletePost} />}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => !publishing && setShowCreateModal(false)}>
          <div className="bg-bg-card border border-border-subtle rounded-2xl w-full max-w-[600px] max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-white/10 shrink-0">
              <h3 className="text-xl font-bold text-white">Criar Post</h3>
              <button onClick={() => !publishing && setShowCreateModal(false)} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50" disabled={publishing}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {publishError && (<div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">{publishError}</div>)}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-300">Fotos ({photos.length}/10)</label>
                <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFilesSelect} className="hidden" disabled={publishing} />
                {photos.length > 0 ? (
                  <div className="relative">
                    <div className="aspect-square rounded-xl overflow-hidden border border-border-subtle bg-bg-dark">
                      <img src={photos[carouselIndex]?.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    {photos.length > 1 && (<>
                      <button disabled={carouselIndex === 0} onClick={() => setCarouselIndex((i) => i - 1)} className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/60 hover:bg-black text-white rounded-full disabled:opacity-30 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                      <button disabled={carouselIndex === photos.length - 1} onClick={() => setCarouselIndex((i) => i + 1)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/60 hover:bg-black text-white rounded-full disabled:opacity-30 transition-colors"><ChevronRight className="w-5 h-5" /></button>
                    </>)}
                    <button onClick={() => removePhoto(carouselIndex)} className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-full transition-colors" disabled={publishing}><X className="w-4 h-4" /></button>
                    {photos.length > 1 && (<div className="flex justify-center gap-1.5 mt-2">{photos.map((_, i) => (<button key={i} onClick={() => setCarouselIndex(i)} className={`w-2 h-2 rounded-full transition-colors ${i === carouselIndex ? 'bg-brand-fire' : 'bg-white/20'}`} />))}</div>)}
                    {photos.length < 10 && (<button type="button" onClick={() => fileInputRef.current?.click()} disabled={publishing} className="mt-3 flex items-center gap-2 text-sm text-brand-fire hover:text-orange-400 font-medium transition-colors disabled:opacity-50"><ImagePlus className="w-4 h-4" /> Adicionar mais fotos</button>)}
                  </div>
                ) : (
                  <button type="button" onClick={() => fileInputRef.current?.click()} disabled={publishing} className="w-full aspect-video border-2 border-dashed border-border-subtle rounded-xl flex flex-col items-center justify-center gap-3 text-gray-400 hover:text-white hover:border-brand-fire/50 transition-colors disabled:opacity-50">
                    <ImagePlus className="w-8 h-8" /><span className="text-sm font-medium">Clique para adicionar fotos</span><span className="text-xs text-gray-600">Até 10 fotos</span>
                  </button>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-brand-fire/20 border border-brand-fire/30 flex items-center justify-center text-xs font-bold text-brand-fire">NP</div>
                  <span className="text-sm text-white font-medium">Neon Pub</span>
                </div>
                <div className="relative">
                  <textarea ref={captionRef} value={caption} onChange={(e) => setCaption(e.target.value.slice(0, 250))} maxLength={250} rows={4} disabled={publishing} className="w-full bg-bg-dark border border-border-subtle rounded-xl py-3 px-4 text-white focus:outline-none focus:border-brand-fire transition-colors resize-none text-sm disabled:opacity-50" placeholder="Escreva uma legenda..." />
                  <div className="flex justify-between items-center mt-1">
                    <div className="relative">
                      <button type="button" onClick={() => setShowEmojis(!showEmojis)} disabled={publishing} className="p-1.5 text-gray-400 hover:text-brand-fire transition-colors disabled:opacity-50"><Smile className="w-5 h-5" /></button>
                      {showEmojis && (<div className="absolute bottom-full left-0 mb-2 bg-bg-card border border-border-subtle rounded-xl p-3 shadow-xl z-10 grid grid-cols-10 gap-1 w-64">{EMOJIS.map((emoji) => (<button key={emoji} type="button" onClick={() => insertEmoji(emoji)} className="text-xl hover:scale-125 transition-transform p-1">{emoji}</button>))}</div>)}
                    </div>
                    <span className={`text-xs font-medium ${caption.length > 250 ? 'text-red-400' : 'text-gray-500'}`}>{caption.length}/250</span>
                  </div>
                </div>
              </div>
              {photos.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Como vai aparecer no app</p>
                  <div className="bg-bg-dark border border-border-subtle rounded-xl overflow-hidden">
                    <div className="flex items-center gap-2 p-3">
                      <div className="w-7 h-7 rounded-full bg-brand-fire/20 border border-brand-fire/30 flex items-center justify-center text-xs font-bold text-brand-fire">NP</div>
                      <span className="text-xs text-white font-medium">Neon Pub</span>
                    </div>
                    <img src={photos[0].previewUrl} alt="Preview" className="w-full aspect-square object-cover" />
                    {caption && <p className="p-3 text-xs text-gray-300">{caption}</p>}
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-white/10 shrink-0">
              <button onClick={handlePublish} disabled={photos.length === 0 || publishing} className="w-full bg-brand-fire hover:bg-[#ff571a] text-white py-3 rounded-xl font-bold transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
                {publishing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                {publishing ? 'Publicando...' : 'Publicar'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog isOpen={confirmDelete !== null} title="Excluir post?" message="A foto e os comentários serão removidos permanentemente." variant="danger" onConfirm={confirmDeleteAction} onCancel={() => setConfirmDelete(null)} />
    </div>
  );
}
