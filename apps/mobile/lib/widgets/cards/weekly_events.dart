import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import 'package:mobile/models/event/event_model.dart';
import 'package:mobile/utils/colors.dart';

class WeeklyEvents extends StatefulWidget {
  final EventModel evento;
  const WeeklyEvents({super.key, required this.evento});

  @override
  State<WeeklyEvents> createState() => _WeeklyEventsState();
}

class _WeeklyEventsState extends State<WeeklyEvents> {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 17.0),
      child: Container(
        decoration: BoxDecoration(
          border: Border.all(color: Color(colorBrasa), width: 2),
          borderRadius: BorderRadius.circular(30),
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(29),
          child: Container(
            color: Color(colorNavy),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Imagem
                SizedBox(
                  height: widget.evento.titulo.length < 40 ? 180 : 160,
                  width: double.infinity,
                  child: Image.network(
                    'https://lets.events/blog/wp-content/uploads/2017/09/top-da-balada-o-que-faz-uma-balada-ter-sucesso.jpeg',
                    fit: BoxFit.cover,
                  ),
                ),

                // Textos
                Padding(
                  padding: const EdgeInsets.fromLTRB(16, 10, 16, 12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Text(
                        widget.evento.titulo,
                        style: GoogleFonts.inter(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 4),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.calendar_month,
                            color: Colors.white70,
                            size: 22,
                          ),
                          const SizedBox(width: 6),
                          Text(
                            DateFormat(
                              "EEE dd MMM  HH:mm",
                              "pt_BR",
                            ).format(widget.evento.dataDoEvento).toUpperCase(),
                            style: GoogleFonts.inter(
                              color: Colors.white30,
                              fontSize: 13,
                            ),
                          ),
                        ],
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
