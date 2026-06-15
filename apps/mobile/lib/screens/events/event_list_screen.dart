import 'package:flutter/material.dart';
import 'package:mobile/models/event/event_model.dart';
import 'package:mobile/providers/events/events_list_provider.dart';
import 'package:mobile/routes/app_routes.dart';
import 'package:mobile/utils/colors.dart';
import 'package:mobile/widgets/cards/event/event_card.dart';
import 'package:provider/provider.dart';

class EventListScreen extends StatefulWidget {
  const EventListScreen({super.key});

  @override
  State<EventListScreen> createState() => _EventListScreenState();
}

class _EventListScreenState extends State<EventListScreen> {
  @override
  Widget build(BuildContext context) {
    final List<EventModel> event = context.watch<EventsListProvider>().events;
    return Scaffold(
      backgroundColor: Color(colorNoturno),
      body: ListView.builder(
        padding: const EdgeInsets.symmetric(vertical: 16),
        itemCount: event.length,
        itemBuilder: (context, index) {
          return EventCard(
            event: event[index],
            onTap: () {
              Navigator.pushNamed(
                context,
                AppRoutes.eventDetail,
                arguments: event[index],
              );
            },
          );
        },
      ),
    );
  }
}
