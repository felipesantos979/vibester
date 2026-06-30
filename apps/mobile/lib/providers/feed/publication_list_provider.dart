import 'package:flutter/material.dart';
import 'package:mobile/models/feed/feed_item_model.dart';
import 'package:mobile/models/feed/publication_model.dart';
import 'package:mobile/service/feed/feed_service.dart';
import 'package:mobile/service/posts/post_service.dart';

class PublicationListProvider extends ChangeNotifier {
  final FeedService _feedService = FeedService();
  final PostService _postService = PostService();

  final List<PublicationModel> _publications = [];
  String? _nextCursor;
  String? _userId;
  bool _isLoading = false;
  bool _isLoadingMore = false;
  bool _hasMore = true;
  String? _erro;

  List<PublicationModel> get publications => _publications;
  bool get isLoading => _isLoading;
  bool get isLoadingMore => _isLoadingMore;
  bool get hasMore => _hasMore;
  String? get erro => _erro;

  Future<void> fetchPublications(String userId) async {
    _userId = userId;
    _isLoading = true;
    _erro = null;
    _publications.clear();
    _nextCursor = null;
    _hasMore = true;
    notifyListeners();

    try {
      final page = await _feedService.getFeed(userId: userId);
      _aplicarPagina(page);
    } catch (e) {
      _erro = 'Não foi possível carregar o feed';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> loadMore() async {
    if (_isLoadingMore || !_hasMore || _userId == null) return;

    _isLoadingMore = true;
    notifyListeners();

    try {
      final page = await _feedService.getFeed(
        userId: _userId!,
        cursor: _nextCursor,
      );
      _aplicarPagina(page);
    } catch (_) {
      // mantém a lista atual se der erro ao carregar mais
    } finally {
      _isLoadingMore = false;
      notifyListeners();
    }
  }

  void _aplicarPagina(FeedPage page) {
    final posts = page.items
        .where((item) => item.itemType == FeedItemType.userPost)
        .map((item) => PublicationModel.fromFeedItem(item))
        .toList();

    _publications.addAll(posts);
    _nextCursor = page.nextCursor;
    _hasMore = page.nextCursor != null && page.items.isNotEmpty;
  }

  void addPublication(PublicationModel publication) {
    _publications.insert(0, publication);
    notifyListeners();
  }

  Future<void> toggleLike(String? id, String? userId) async {
    if (id == null || userId == null) return;

    final index = _publications.indexWhere((p) => p.id == id);
    if (index == -1) return;

    final pub = _publications[index];
    final wasLiked = pub.isLiked;

    _publications[index] = pub.copyWith(
      isLiked: !wasLiked,
      likes: wasLiked ? pub.likes - 1 : pub.likes + 1,
    );
    notifyListeners();

    try {
      if (wasLiked) {
        await _postService.unlikePost(postId: id, userId: userId);
      } else {
        await _postService.likePost(postId: id, userId: userId);
      }
    } catch (e) {
      final is409 =
          e.toString().contains('409') ||
          e.toString().contains('already liked') ||
          e.toString().contains('already unliked');
      if (!is409) {
        _publications[index] = pub;
        notifyListeners();
      }
    }
  }
}
