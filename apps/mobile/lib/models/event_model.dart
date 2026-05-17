import 'package:mobile/models/lineup_model.dart';

class EventModel {
  final DateTime dataDoEvento;
  final String titulo;
  final List<LineupModel>? lineUp;
  final String categoria;
  final String localizacao;
  final String informacoes;
  final String artistas;

  EventModel({
    required this.dataDoEvento,
    required this.titulo,
    this.lineUp,
    required this.categoria,
    required this.localizacao,
    required this.informacoes,
    required this.artistas
  });
}