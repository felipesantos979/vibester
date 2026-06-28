class PlaceModel {
  final String? id;
  final String nome;
  final int nivelMovimento;
  final String categoria;
  final double avaliacao;
  final String nivelPrecoMedio;
  final String bio;
  final String endereco;
  final int qtdAvaliacoes;
  final List<double> distribuicao;
  final double? distancia;
  final String profileImage;
  bool isFavorite;

  PlaceModel({
    this.id,
    required this.nome,
    required this.nivelMovimento,
    required this.categoria,
    required this.avaliacao,
    required this.nivelPrecoMedio,
    required this.bio,
    required this.endereco,
    required this.distribuicao,
    required this.qtdAvaliacoes,
    this.profileImage = '',
    this.distancia,
    this.isFavorite = false,
  });

  //Json pra dart, é pra quando os dados virem da API, pra q eles possam ser usados pelo dart
  factory PlaceModel.fromJson(Map<String, dynamic> json) {
    return PlaceModel(
      id: json['id'],
      nome: json['name'] ?? '',
      nivelMovimento: json['movementLevel'] ?? 0,
      categoria: json['category'] ?? '',
      avaliacao: (json['averageRating'] as num?)?.toDouble() ?? 0,
      nivelPrecoMedio: json['priceIndicator'] ?? '',
      bio: json['bio'] ?? '',
      endereco: json['address'] ?? '',
      qtdAvaliacoes: json['reviewCount'] ?? 0,
      distribuicao: json['ratingDistribution'] != null
          ? List<double>.from(json['ratingDistribution'])
          : [],
      profileImage: json['photoUrl'] ?? json['profileImage'] ?? '',
    );
  }

  //Dart pra json, é o contrario do de cima, pra quando for mandar pra API
  Map<String, dynamic> toJson() {
    return {
      'name': nome,
      'movementLevel': nivelMovimento,
      'category': categoria,
      'rating': avaliacao,
      'priceLevel': nivelPrecoMedio,
      'bio': bio,
      'address': endereco,
      'reviewCount': qtdAvaliacoes,
      'ratingDistribution': distribuicao,
      'profileImage': profileImage,
    };
  }
}
