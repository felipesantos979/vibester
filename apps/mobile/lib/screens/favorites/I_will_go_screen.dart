import 'package:flutter/material.dart';
import 'package:mobile/models/event/event_model.dart';
import 'package:mobile/screens/events/event_detail_screen.dart';
import 'package:mobile/utils/colors.dart';
import 'package:mobile/widgets/cards/i_will_go_event_card.dart';

class IWillGoScreen extends StatefulWidget {
  const IWillGoScreen({super.key});

  @override
  State<IWillGoScreen> createState() => _IWillGoScreenState();
}

class _IWillGoScreenState extends State<IWillGoScreen> {
  final List<EventModel> events = [
    EventModel(
      titulo: 'Noite Eletrônica',
      dataDoEvento: DateTime(2026, 1, 14, 23, 00),
      categoria: 'Eletrônico',
      localizacao: 'Av. Paulista, 1000',
      informacoes: 'Open bar até meia-noite. Entrada a partir das 22h.',
      artistas: 'DJ Marky, Vintage Culture',
    ),
    EventModel(
      titulo: 'Festival de Jazz',
      dataDoEvento: DateTime(2026, 9, 21, 19, 30),
      categoria: 'Jazz',
      localizacao: 'Parque Ibirapuera',
      informacoes: 'Evento ao ar livre. Gratuito.',
      artistas: 'Hermeto Pascoal, Thelonious',
    ),
    EventModel(
      titulo: 'Baile Funk',
      dataDoEvento: DateTime(2026, 3, 28, 22, 00),
      categoria: 'Funk',
      localizacao: 'R. Augusta, 500',
      informacoes: 'Ingressos limitados. 18+.',
      artistas: 'MC Livinho, DJ Tárik',
    ),
    EventModel(
      titulo: 'Rock na Veia',
      dataDoEvento: DateTime(2026, 7, 5, 21, 00),
      categoria: 'Rock',
      localizacao: 'Espaço das Américas',
      informacoes: 'Abertura dos portões às 19h.',
      artistas: 'Fresno, Supercombo',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return ColoredBox(
      color: Color(colorNoturno),
      child: ListView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        padding: const EdgeInsets.symmetric(vertical: 16),
        itemCount: events.length + 1,
        itemBuilder: (context, index) {
          if (index == 0) {
            return Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 24),
              child: Column(
                children: [
                  Row(
                    children: [
                      Text(
                        'Eventos confirmados',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  Row(
                    children: [
                      Text(
                        'Os eventos que você já confirmou presença.',
                        style: TextStyle(
                          color: Colors.white38,
                          fontSize: 12.5,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            );
          }

          return IWillGoEventCard(
            event: events[index - 1],
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) =>
                      EventDetailScreen(eventModel: events[index - 1]),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
