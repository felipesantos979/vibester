import 'package:flutter/material.dart';
import 'package:mobile/models/feed/feed_item_model.dart';

class PublicationModel {
  final String? id;
  final String? authorId;
  final String autor;
  final String autorProfileImage;
  final String publicationImage;
  final String description;
  final String? location;
  final DateTime publicatedAt;
  final int likes;
  final bool isLiked;

  PublicationModel({
    this.id,
    this.authorId,
    required this.autor,
    required this.autorProfileImage,
    required this.publicationImage,
    required this.description,
    this.location,
    required this.publicatedAt,
    this.likes = 0,
    this.isLiked = false,
  });

  PublicationModel copyWith({
    String? id,
    String? authorId,
    String? autor,
    String? autorProfileImage,
    String? publicationImage,
    String? description,
    String? location,
    DateTime? publicatedAt,
    int? likes,
    bool? isLiked,
  }) {
    return PublicationModel(
      id: id ?? this.id,
      authorId: authorId ?? this.authorId,
      autor: autor ?? this.autor,
      autorProfileImage: autorProfileImage ?? this.autorProfileImage,
      publicationImage: publicationImage ?? this.publicationImage,
      description: description ?? this.description,
      location: location ?? this.location,
      publicatedAt: publicatedAt ?? this.publicatedAt,
      likes: likes ?? this.likes,
      isLiked: isLiked ?? this.isLiked,
    );
  }

  factory PublicationModel.fromFeedItem(FeedItemModel item) {
    debugPrint('>>> post ${item.itemId} isLiked: ${item.isLiked}');
    return PublicationModel(
      id: item.itemId,
      authorId: item.authorId,
      autor: item.authorUsername ?? '',
      autorProfileImage: item.authorProfilePicture ?? '',
      publicationImage: item.imageUrls.isNotEmpty ? item.imageUrls.first : '',
      description: item.content ?? '',
      location: item.establishmentName,
      publicatedAt: item.createdAt,
      likes: item.totalLikes,
      isLiked: item.isLiked,
    );
  }
}
