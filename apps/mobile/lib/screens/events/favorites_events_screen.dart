import 'package:flutter/material.dart';
import 'package:mobile/models/event/event_model.dart';
import 'package:mobile/providers/events/events_list_provider.dart';
import 'package:mobile/screens/events/event_detail_screen.dart';
import 'package:mobile/utils/colors.dart';
import 'package:mobile/widgets/cards/event/event_card.dart';
import 'package:provider/provider.dart';

class FavoritesEventsScreen extends StatefulWidget {
  const FavoritesEventsScreen({super.key});

  @override
  State<FavoritesEventsScreen> createState() => _FavoritesEventsScreenState();
}

class _FavoritesEventsScreenState extends State<FavoritesEventsScreen> {
  @override
  Widget build(BuildContext context) {
    final List<EventModel> favorites = context
        .watch<EventsListProvider>()
        .favorites;
    return Scaffold(
      backgroundColor: Color(colorNoturno),
      body: favorites.isEmpty
          ? Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Center(
                  child: SizedBox(
                    height: 200,
                    width: 200,
                    child: Opacity(
                      opacity: 0.8,
                      child: Image.asset('assets/img/mascote/lupa.png'),
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  'Nenhum evento confirmado',
                  style: TextStyle(
                    color: Colors.white38,
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            )
          : ListView.builder(
              padding: const EdgeInsets.symmetric(vertical: 16),
              itemCount: favorites.length,
              itemBuilder: (context, index) {
                return EventCard(
                  event: favorites[index],
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) =>
                            EventDetailScreen(eventModel: favorites[index]),
                      ),
                    );
                  },
                );
              },
            ),
    );
  }
}
