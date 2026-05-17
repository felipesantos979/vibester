import 'package:flutter/material.dart';
import 'package:mobile/models/event_model.dart';
import 'package:mobile/models/lineup_model.dart';
import 'package:mobile/screens/event_detail_screen.dart';
import 'package:mobile/utils/colors.dart';
import 'package:mobile/widgets/event_card.dart';

class EventListScreen extends StatefulWidget {
  const EventListScreen({super.key});

  @override
  State<EventListScreen> createState() => _EventListScreenState();
}

class _EventListScreenState extends State<EventListScreen> {
  final List<LineupModel> lineupEvento = [
    LineupModel(nome: "Ana castelos", url: "url"),
  ];

  List<EventModel> get event => [
    EventModel(
      dataDoEvento: DateTime(2026, 6, 10, 17, 0),
      titulo: "Noite do Sertanejo",
      lineUp: lineupEvento,
      categoria: "Show",
      artistas: "Sonia blade",
      localizacao: "Paraná Expo - Maringá, PR",
      informacoes:
          "Classificação do evento: 16+\nMenores de 16 anos somente acompanhados dos pais ou responsáveis legais, mediante apresentação de documento oficial com foto.\nAcesso à área open bar restrito a maiores de 18 anos.\nProibida a venda de bebida alcoólica para menores de 18 anos (Lei Federal 13.106/16).\nDescumprimento da classificação indicativa pode impedir a entrada no evento sem direito a reembolso.",
    ),
    EventModel(
      dataDoEvento: DateTime(2026, 7, 4, 21, 0),
      titulo: "Festa do Forró",
      lineUp: lineupEvento,
      categoria: "Show",
      artistas: "Wesley Safadão",
      localizacao: "Arena Fonte Nova - Salvador, BA",
      informacoes:
          "Classificação do evento: 16+\nMenores de 16 anos somente acompanhados dos pais ou responsáveis legais, mediante apresentação de documento oficial com foto.\nAcesso à área open bar restrito a maiores de 18 anos.\nProibida a venda de bebida alcoólica para menores de 18 anos (Lei Federal 13.106/16).\nDescumprimento da classificação indicativa pode impedir a entrada no evento sem direito a reembolso.",
    ),

    EventModel(
      dataDoEvento: DateTime(2026, 8, 15, 20, 0),
      titulo: "Hip Hop Nation",
      lineUp: lineupEvento,
      categoria: "Festival",
      artistas: "Emicida",
      localizacao: "Allianz Parque - São Paulo, SP",
      informacoes:
          "Classificação do evento: 16+\nMenores de 16 anos somente acompanhados dos pais ou responsáveis legais, mediante apresentação de documento oficial com foto.\nAcesso à área open bar restrito a maiores de 18 anos.\nProibida a venda de bebida alcoólica para menores de 18 anos (Lei Federal 13.106/16).\nDescumprimento da classificação indicativa pode impedir a entrada no evento sem direito a reembolso.",
    ),

    EventModel(
      dataDoEvento: DateTime(2026, 9, 20, 18, 0),
      titulo: "Rock in Curitiba",
      lineUp: lineupEvento,
      categoria: "Festival",
      artistas: "Fresno",
      localizacao: "Pedreira Paulo Leminski - Curitiba, PR",
      informacoes:
          "Classificação do evento: 16+\nMenores de 16 anos somente acompanhados dos pais ou responsáveis legais, mediante apresentação de documento oficial com foto.\nAcesso à área open bar restrito a maiores de 18 anos.\nProibida a venda de bebida alcoólica para menores de 18 anos (Lei Federal 13.106/16).\nDescumprimento da classificação indicativa pode impedir a entrada no evento sem direito a reembolso.",
    ),

    EventModel(
      dataDoEvento: DateTime(2026, 10, 3, 22, 0),
      titulo: "Noite do Funk",
      lineUp: lineupEvento,
      categoria: "Baile",
      artistas: "Ludmilla",
      localizacao: "Jeunesse Arena - Rio de Janeiro, RJ",
      informacoes:
          "Classificação do evento: 18+\nAcesso restrito a maiores de 18 anos mediante apresentação de documento oficial com foto.\nProibida a venda de bebida alcoólica para menores de 18 anos (Lei Federal 13.106/16).\nDescumprimento da classificação indicativa pode impedir a entrada no evento sem direito a reembolso.",
    ),

    EventModel(
      dataDoEvento: DateTime(2026, 11, 7, 19, 0),
      titulo: "Eletrônica BR",
      lineUp: lineupEvento,
      categoria: "Festival",
      artistas: "Alok",
      localizacao: "Complexo do Ibirapuera - São Paulo, SP",
      informacoes:
          "Classificação do evento: 18+\nAcesso restrito a maiores de 18 anos mediante apresentação de documento oficial com foto.\nProibida a venda de bebida alcoólica para menores de 18 anos (Lei Federal 13.106/16).\nDescumprimento da classificação indicativa pode impedir a entrada no evento sem direito a reembolso.",
    ),

    EventModel(
      dataDoEvento: DateTime(2026, 12, 31, 23, 0),
      titulo: "Réveillon do Sol",
      lineUp: lineupEvento,
      categoria: "Festa",
      artistas: "Ivete Sangalo",
      localizacao: "Praia de Copacabana - Rio de Janeiro, RJ",
      informacoes:
          "Classificação do evento: 16+\nMenores de 16 anos somente acompanhados dos pais ou responsáveis legais, mediante apresentação de documento oficial com foto.\nAcesso à área open bar restrito a maiores de 18 anos.\nProibida a venda de bebida alcoólica para menores de 18 anos (Lei Federal 13.106/16).\nDescumprimento da classificação indicativa pode impedir a entrada no evento sem direito a reembolso.",
    ),

    EventModel(
      dataDoEvento: DateTime(2027, 1, 15, 21, 0),
      titulo: "Pagode de Verão",
      lineUp: lineupEvento,
      categoria: "Show",
      artistas: "Thiaguinho",
      localizacao: "Via Funchal - São Paulo, SP",
      informacoes:
          "Classificação do evento: 16+\nMenores de 16 anos somente acompanhados dos pais ou responsáveis legais, mediante apresentação de documento oficial com foto.\nAcesso à área open bar restrito a maiores de 18 anos.\nProibida a venda de bebida alcoólica para menores de 18 anos (Lei Federal 13.106/16).\nDescumprimento da classificação indicativa pode impedir a entrada no evento sem direito a reembolso.",
    ),

    EventModel(
      dataDoEvento: DateTime(2027, 2, 20, 20, 0),
      titulo: "Carnaval Eletrônico",
      lineUp: lineupEvento,
      categoria: "Festa",
      artistas: "Anitta",
      localizacao: "Sambódromo do Anhembi - São Paulo, SP",
      informacoes:
          "Classificação do evento: 18+\nAcesso restrito a maiores de 18 anos mediante apresentação de documento oficial com foto.\nProibida a venda de bebida alcoólica para menores de 18 anos (Lei Federal 13.106/16).\nDescumprimento da classificação indicativa pode impedir a entrada no evento sem direito a reembolso.",
    ),

    EventModel(
      dataDoEvento: DateTime(2027, 3, 12, 18, 30),
      titulo: "Samba do Morro",
      lineUp: lineupEvento,
      categoria: "Show",
      artistas: "Diogo Nogueira",
      localizacao: "Circo Voador - Rio de Janeiro, RJ",
      informacoes:
          "Classificação do evento: 16+\nMenores de 16 anos somente acompanhados dos pais ou responsáveis legais, mediante apresentação de documento oficial com foto.\nAcesso à área open bar restrito a maiores de 18 anos.\nProibida a venda de bebida alcoólica para menores de 18 anos (Lei Federal 13.106/16).\nDescumprimento da classificação indicativa pode impedir a entrada no evento sem direito a reembolso.",
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(colorNoturno),
      body: ListView.builder(
        padding: const EdgeInsets.symmetric(vertical: 16),
        itemCount: event.length,
        itemBuilder: (context, index) {
          return EventCard(
            event: event[index],
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) =>
                      EventDetailScreen(eventModel: event[index]),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
