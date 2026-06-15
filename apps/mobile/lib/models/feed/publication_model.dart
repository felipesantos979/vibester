import 'dart:math';

class PublicationModel {
  final int id;
  final String autor;
  final String autorProfileImage;
  final String publicationImage;
  final String description;
  final String? location;
  final DateTime publicatedAt;
  final int likes;
  final bool isLiked;

  PublicationModel({
    int? id,
    required this.autor,
    required this.autorProfileImage,
    required this.publicationImage,
    required this.description,
    required this.location,
    required this.publicatedAt,
    this.likes = 0,
    this.isLiked = false,
  }) : id = id ?? Random().nextInt(99999);

  PublicationModel copyWith({int? likes, bool? isLiked}) {
    return PublicationModel(
      id: id,
      autor: autor,
      autorProfileImage: autorProfileImage,
      publicationImage: publicationImage,
      description: description,
      location: location,
      publicatedAt: publicatedAt,
      likes: likes ?? this.likes,
      isLiked: isLiked ?? this.isLiked,
    );
  }
}
