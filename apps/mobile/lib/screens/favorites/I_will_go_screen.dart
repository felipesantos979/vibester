import 'package:flutter/material.dart';
import 'package:mobile/models/event/event_model.dart';
import 'package:mobile/providers/events/events_list_provider.dart';
import 'package:mobile/screens/events/event_detail_screen.dart';
import 'package:mobile/utils/colors.dart';
import 'package:mobile/widgets/cards/event/i_will_go_event_card.dart';
import 'package:provider/provider.dart';

class IWillGoScreen extends StatefulWidget {
  const IWillGoScreen({super.key});

  @override
  State<IWillGoScreen> createState() => _IWillGoScreenState();
}

class _IWillGoScreenState extends State<IWillGoScreen> {
  @override
  Widget build(BuildContext context) {
    final List<EventModel> favorites = context
        .watch<EventsListProvider>()
        .favorites;
    return ColoredBox(
      color: Color(colorNoturno),
      child: ListView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        padding: EdgeInsets.only(top: 16),
        itemCount: favorites.length + 1,
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
            event: favorites[index - 1],
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) =>
                      EventDetailScreen(eventModel: favorites[index - 1]),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
