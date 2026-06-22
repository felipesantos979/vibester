import 'package:mobile/models/event/lineup_model.dart';

class EventModel {
  final String? id;
  final String? placeId;
  final DateTime dataDoEvento;
  final String titulo;
  final List<LineupModel>? lineUp;
  final String categoria;
  final String localizacao;
  final String informacoes;
  final String artistas;
  final String imageUrl;
  bool isFavorite;

  EventModel({
    this.id,
    this.placeId,
    required this.dataDoEvento,
    required this.titulo,
    this.lineUp,
    required this.categoria,
    required this.localizacao,
    required this.informacoes,
    required this.artistas,
    this.imageUrl = '',
    this.isFavorite = false,
  });

  //Json pra dart, é pra quando os dados virem da API, pra q eles possam ser usados pelo dart.
  // Não ha validação pra caso venha null, então atribui aqui valores para isso, apenas pra testes. Mudar depois!
  factory EventModel.fromJson(Map<String, dynamic> json) {
    return EventModel(
      id: json['id'],
      placeId: json['placeId'],
      dataDoEvento: json['eventDate'] != null
          ? DateTime.parse(json['eventDate'])
          : DateTime.now(),
      titulo: json['title'] ?? 'Evento sem título',
      categoria: json['category'] ?? 'Sem categoria',
      localizacao: json['location'] ?? 'Local não informado',
      informacoes: json['info'] ?? '',
      artistas: json['artists'] ?? '',
      imageUrl: json['imageUrl'] ?? '',
    );
  }

  //Dart pra json, é o contrario do de cima, pra quando for mandar pra API
  Map<String, dynamic> toJson() {
    return {
      'title': titulo,
      'eventDate': dataDoEvento.toIso8601String(),
      'category': categoria,
      'location': localizacao,
      'info': informacoes,
      'artists': artistas,
      'imageUrl': imageUrl,
      'placeId': placeId,
    };
  }
}
