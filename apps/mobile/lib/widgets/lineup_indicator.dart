import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/models/lineup_model.dart';
import 'package:mobile/utils/colors.dart';

class LineupIndicator extends StatelessWidget {
  final List<LineupModel>? lineup;

  const LineupIndicator({super.key, this.lineup});

  @override
  Widget build(BuildContext context) {
    if (lineup == null || lineup!.isEmpty) {
      return const SizedBox();
    }

    return SizedBox(
      height: 130,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: lineup!.length,
        separatorBuilder: (_, __) => const SizedBox(width: 16),
        itemBuilder: (context, index) {
          final artista = lineup![index];
          return Column(
            children: [
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(color: Color(colorAmbar), width: 3),
                ),
                child: ClipOval(
                  child: Image.network(
                    artista.url,
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => const Placeholder(),
                  ),
                ),
              ),
              const SizedBox(height: 8),
              Text(
                artista.nome,
                style: GoogleFonts.inter(color: Colors.white, fontSize: 13),
                overflow: TextOverflow.ellipsis,
              ),
            ],
          );
        },
      ),
    );
  }
}