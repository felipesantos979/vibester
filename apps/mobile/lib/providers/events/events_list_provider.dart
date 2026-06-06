import 'package:flutter/material.dart';
import 'package:mobile/models/event/event_model.dart';
import 'package:mobile/models/event/lineup_model.dart';

class EventsListProvider extends ChangeNotifier {
  static const String _foto =
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgpnQNClh0kA43xMUXgiu_GKAqIL97g2dMY80DJ4A15pnck6ZxZ6APvn2KKdSIxajG8RSdRq6mesWTCn0kIItn6tlCqAZkE8Nx-snm2TCW&s=10";

  final List<EventModel> _events = [
    EventModel(
      dataDoEvento: DateTime(2026, 6, 10, 17, 0),
      titulo: "Noite do Sertanejo",
      lineUp: [
        LineupModel(nome: "Sonia Blade", url: _foto),
        LineupModel(nome: "Wesley Safadão", url: _foto),
      ],
      categoria: "Show",
      artistas: "Sonia blade",
      imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3',
      localizacao: "Paraná Expo - Maringá, PR",
      informacoes:
          "Classificação do evento: 16+\nMenores de 16 anos somente acompanhados dos pais ou responsáveis legais, mediante apresentação de documento oficial com foto.\nAcesso à área open bar restrito a maiores de 18 anos.\nProibida a venda de bebida alcoólica para menores de 18 anos (Lei Federal 13.106/16).\nDescumprimento da classificação indicativa pode impedir a entrada no evento sem direito a reembolso.",
    ),
    EventModel(
      dataDoEvento: DateTime(2026, 7, 4, 21, 0),
      titulo: "Festa do Forró",
      lineUp: [LineupModel(nome: "Wesley Safadão", url: _foto)],
      categoria: "Show",
      artistas: "Wesley Safadão",
      imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
      localizacao: "Arena Fonte Nova - Salvador, BA",
      informacoes:
          "Classificação do evento: 16+\nMenores de 16 anos somente acompanhados dos pais ou responsáveis legais, mediante apresentação de documento oficial com foto.\nAcesso à área open bar restrito a maiores de 18 anos.\nProibida a venda de bebida alcoólica para menores de 18 anos (Lei Federal 13.106/16).\nDescumprimento da classificação indicativa pode impedir a entrada no evento sem direito a reembolso.",
    ),
    EventModel(
      dataDoEvento: DateTime(2026, 8, 15, 20, 0),
      titulo: "Hip Hop Nation",
      lineUp: [LineupModel(nome: "Emicida", url: _foto)],
      categoria: "Festival",
      artistas: "Emicida",
      imageUrl: 'https://images.unsplash.com/photo-1503095396549-807759245b35',
      localizacao: "Allianz Parque - São Paulo, SP",
      informacoes:
          "Classificação do evento: 16+\nMenores de 16 anos somente acompanhados dos pais ou responsáveis legais, mediante apresentação de documento oficial com foto.\nAcesso à área open bar restrito a maiores de 18 anos.\nProibida a venda de bebida alcoólica para menores de 18 anos (Lei Federal 13.106/16).\nDescumprimento da classificação indicativa pode impedir a entrada no evento sem direito a reembolso.",
    ),
    EventModel(
      dataDoEvento: DateTime(2026, 9, 20, 18, 0),
      titulo: "Rock in Curitiba",
      lineUp: [LineupModel(nome: "Fresno", url: _foto)],
      categoria: "Festival",
      artistas: "Fresno",
      localizacao: "Pedreira Paulo Leminski - Curitiba, PR",
      imageUrl:
          'https://lets.events/blog/wp-content/uploads/2017/09/top-da-balada-o-que-faz-uma-balada-ter-sucesso.jpeg',
      informacoes:
          "Classificação do evento: 16+\nMenores de 16 anos somente acompanhados dos pais ou responsáveis legais, mediante apresentação de documento oficial com foto.\nAcesso à área open bar restrito a maiores de 18 anos.\nProibida a venda de bebida alcoólica para menores de 18 anos (Lei Federal 13.106/16).\nDescumprimento da classificação indicativa pode impedir a entrada no evento sem direito a reembolso.",
    ),
    EventModel(
      dataDoEvento: DateTime(2026, 10, 3, 22, 0),
      titulo: "Noite do Funk",
      lineUp: [LineupModel(nome: "Ludmilla", url: _foto)],
      categoria: "Baile",
      artistas: "Ludmilla",
      localizacao: "Jeunesse Arena - Rio de Janeiro, RJ",
      imageUrl:
          'https://lets.events/blog/wp-content/uploads/2017/09/top-da-balada-o-que-faz-uma-balada-ter-sucesso.jpeg',
      informacoes:
          "Classificação do evento: 18+\nAcesso restrito a maiores de 18 anos mediante apresentação de documento oficial com foto.\nProibida a venda de bebida alcoólica para menores de 18 anos (Lei Federal 13.106/16).\nDescumprimento da classificação indicativa pode impedir a entrada no evento sem direito a reembolso.",
    ),
    EventModel(
      dataDoEvento: DateTime(2026, 11, 7, 19, 0),
      titulo: "Eletrônica BR",
      lineUp: [LineupModel(nome: "Alok", url: _foto)],
      categoria: "Festival",
      artistas: "Alok",
      localizacao: "Complexo do Ibirapuera - São Paulo, SP",
      imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f',
      informacoes:
          "Classificação do evento: 18+\nAcesso restrito a maiores de 18 anos mediante apresentação de documento oficial com foto.\nProibida a venda de bebida alcoólica para menores de 18 anos (Lei Federal 13.106/16).\nDescumprimento da classificação indicativa pode impedir a entrada no evento sem direito a reembolso.",
    ),
    EventModel(
      dataDoEvento: DateTime(2026, 12, 31, 23, 0),
      titulo: "Réveillon do Sol",
      lineUp: [LineupModel(nome: "Ivete Sangalo", url: _foto)],
      categoria: "Festa",
      artistas: "Ivete Sangalo",
      localizacao: "Praia de Copacabana - Rio de Janeiro, RJ",
      imageUrl: 'https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2',
      informacoes:
          "Classificação do evento: 16+\nMenores de 16 anos somente acompanhados dos pais ou responsáveis legais, mediante apresentação de documento oficial com foto.\nAcesso à área open bar restrito a maiores de 18 anos.\nProibida a venda de bebida alcoólica para menores de 18 anos (Lei Federal 13.106/16).\nDescumprimento da classificação indicativa pode impedir a entrada no evento sem direito a reembolso.",
    ),
    EventModel(
      dataDoEvento: DateTime(2027, 1, 15, 21, 0),
      titulo: "Pagode de Verão",
      lineUp: [LineupModel(nome: "Thiaguinho", url: _foto)],
      categoria: "Show",
      artistas: "Thiaguinho",
      localizacao: "Via Funchal - São Paulo, SP",
      imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
      informacoes:
          "Classificação do evento: 16+\nMenores de 16 anos somente acompanhados dos pais ou responsáveis legais, mediante apresentação de documento oficial com foto.\nAcesso à área open bar restrito a maiores de 18 anos.\nProibida a venda de bebida alcoólica para menores de 18 anos (Lei Federal 13.106/16).\nDescumprimento da classificação indicativa pode impedir a entrada no evento sem direito a reembolso.",
    ),
    EventModel(
      dataDoEvento: DateTime(2027, 2, 20, 20, 0),
      titulo: "Carnaval Eletrônico",
      lineUp: [LineupModel(nome: "Anitta", url: _foto)],
      categoria: "Festa",
      artistas: "Anitta",
      localizacao: "Sambódromo do Anhembi - São Paulo, SP",
      imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a',
      informacoes:
          "Classificação do evento: 18+\nAcesso restrito a maiores de 18 anos mediante apresentação de documento oficial com foto.\nProibida a venda de bebida alcoólica para menores de 18 anos (Lei Federal 13.106/16).\nDescumprimento da classificação indicativa pode impedir a entrada no evento sem direito a reembolso.",
    ),
    EventModel(
      dataDoEvento: DateTime(2027, 3, 12, 18, 30),
      titulo: "Samba do Morro",
      lineUp: [LineupModel(nome: "Diogo Nogueira", url: _foto)],
      categoria: "Show",
      artistas: "Diogo Nogueira",
      localizacao: "Circo Voador - Rio de Janeiro, RJ",
      imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3',
      informacoes:
          "Classificação do evento: 16+\nMenores de 16 anos somente acompanhados dos pais ou responsáveis legais, mediante apresentação de documento oficial com foto.\nAcesso à área open bar restrito a maiores de 18 anos.\nProibida a venda de bebida alcoólica para menores de 18 anos (Lei Federal 13.106/16).\nDescumprimento da classificação indicativa pode impedir a entrada no evento sem direito a reembolso.",
    ),
  ];

  List<EventModel> get events => _events;
}
