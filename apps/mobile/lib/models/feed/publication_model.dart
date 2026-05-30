class PublicationModel {
  final String autor;
  final String autorProfileImage;
  final String publicationImage;
  final String description;
  final String location;
  final DateTime publicatedAt;

  PublicationModel({
    required this.autor,
    required this.autorProfileImage,
    required this.publicationImage,
    required this.description,
    required this.location,
    required this.publicatedAt,
  });
}
