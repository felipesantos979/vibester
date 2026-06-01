import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:mobile/models/event/event_model.dart';
import 'package:mobile/utils/colors.dart';

class IWillGoEventCard extends StatelessWidget {
  final EventModel event;
  final VoidCallback? onTap;

  const IWillGoEventCard({super.key, required this.event, this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Card(
        margin: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: BorderSide(color: Color(colorAmbar).withAlpha(50), width: 1),
        ),
        clipBehavior: Clip.antiAlias,
        child: SizedBox(
          height: 150,
          child: Container(
            color: Color(colorNavy),
            child: Column(
              children: [
                Expanded(
                  child: Row(
                    children: [
                      Expanded(
                        flex: 2,
                        child: Stack(
                          fit: StackFit.expand,
                          children: [
                            Image.network(
                              'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400',
                              fit: BoxFit.cover,
                              errorBuilder: (_, __, ___) => const Placeholder(),
                            ),

                            // data
                            Positioned(
                              bottom: 8,
                              left: 8,
                              child: Container(
                                width: 60,
                                height: 60,
                                decoration: BoxDecoration(
                                  color: Color(colorNavy).withAlpha(150),
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(
                                    color: Color(colorAmbar),
                                    width: 0,
                                  ),
                                ),
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Text(
                                      DateFormat("dd", "pt_BR")
                                          .format(event.dataDoEvento)
                                          .toUpperCase(),
                                      style: TextStyle(
                                        fontSize: 21,
                                        color: Colors.white,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    Text(
                                      DateFormat("MMM", "pt_BR")
                                          .format(event.dataDoEvento)
                                          .toUpperCase(),
                                      style: TextStyle(
                                        fontSize: 14,
                                        color: Color(colorAmbar),
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),

                      SizedBox(width: 3),

                      Expanded(
                        flex: 3,
                        child: Stack(
                          fit: StackFit.expand,
                          children: [
                            // Ver evento
                            Positioned(
                              bottom: 8,
                              left: 0,
                              right: 0,
                              child: Center(
                                child: Container(
                                  width: 100,
                                  height: 25,
                                  decoration: BoxDecoration(
                                    color: Color(colorAmbar).withAlpha(20),
                                    borderRadius: BorderRadius.circular(15),
                                    border: Border.all(
                                      color: Color(colorAmbar),
                                      width: 1,
                                    ),
                                  ),
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Text(
                                        "Ver Evento",
                                        style: TextStyle(
                                          fontSize: 12,
                                          color: Colors.white,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),

                            // Tipo
                            Positioned(
                              top: 8,
                              right: 8,
                              child: Container(
                                width: 60,
                                height: 25,
                                decoration: BoxDecoration(
                                  color: Color(colorAmbar).withAlpha(20),
                                  borderRadius: BorderRadius.circular(15),
                                  border: Border.all(
                                    color: Color(colorAmbar),
                                    width: 1,
                                  ),
                                ),
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Text(
                                      event.categoria,
                                      style: TextStyle(
                                        fontSize: 8,
                                        color: Color(colorAmbar),
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),

                            Positioned(
                              top: 40,
                              left: 10,
                              child: Container(
                                width: 150,
                                height: 60,
                                decoration: BoxDecoration(
                                  color: Color(colorNavy),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Column(
                                  children: [
                                    Row(
                                      children: [
                                        Expanded(
                                          child: Text(
                                            event.titulo.toUpperCase(),
                                            overflow: TextOverflow.ellipsis,
                                            maxLines: 1,
                                            style: TextStyle(
                                              fontSize: 14,
                                              color: Colors.white,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                    Row(
                                      children: [
                                        Text(
                                          DateFormat("EEE  HH:mm", "pt_BR")
                                              .format(event.dataDoEvento)
                                              .toUpperCase(),
                                          style: TextStyle(
                                            fontSize: 13,
                                            color: Colors.white38,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ],
                                    ),
                                    Row(
                                      children: [
                                        Text(
                                          "Voce confirmou sua presença!",
                                          style: TextStyle(
                                            fontSize: 10,
                                            color: Color(colorAmbar),
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
