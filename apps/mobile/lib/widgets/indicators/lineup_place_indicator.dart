import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/models/highlights/lineup_highlight_model.dart';
import 'package:mobile/utils/colors.dart';

class LineupPlaceIndicator extends StatelessWidget {
  static const String _foto =
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgpnQNClh0kA43xMUXgiu_GKAqIL97g2dMY80DJ4A15pnck6ZxZ6APvn2KKdSIxajG8RSdRq6mesWTCn0kIItn6tlCqAZkE8Nx-snm2TCW&s=10";

  List<LineupHighlightModel> get lineup => [
    LineupHighlightModel(
      nome: "Sonia Blade",
      url: _foto,
      cor: Colors.red,
      avaliacao: 4.5,
      nivelPreco: 2,
    ),
    LineupHighlightModel(
      nome: "Wesley Safadão",
      url: _foto,
      cor: Colors.orange,
      avaliacao: 4.8,
      nivelPreco: 3,
    ),
    LineupHighlightModel(
      nome: "Emicida",
      url: _foto,
      cor: Colors.purple,
      avaliacao: 4.2,
      nivelPreco: 2,
    ),
    LineupHighlightModel(
      nome: "Fresno",
      url: _foto,
      cor: Colors.blue,
      avaliacao: 3.9,
      nivelPreco: 1,
    ),
    LineupHighlightModel(
      nome: "Ludmilla",
      url: _foto,
      cor: Colors.pink,
      avaliacao: 4.7,
      nivelPreco: 3,
    ),
    LineupHighlightModel(
      nome: "Alok",
      url: _foto,
      cor: Colors.cyan,
      avaliacao: 4.6,
      nivelPreco: 3,
    ),
    LineupHighlightModel(
      nome: "Ivete Sangalo",
      url: _foto,
      cor: Colors.yellow,
      avaliacao: 4.9,
      nivelPreco: 2,
    ),
    LineupHighlightModel(
      nome: "Thiaguinho",
      url: _foto,
      cor: Colors.green,
      avaliacao: 4.3,
      nivelPreco: 2,
    ),
    LineupHighlightModel(
      nome: "Anitta",
      url: _foto,
      cor: Colors.teal,
      avaliacao: 4.5,
      nivelPreco: 3,
    ),
    LineupHighlightModel(
      nome: "Diogo Nogueira",
      url: _foto,
      cor: Colors.amber,
      avaliacao: 4.1,
      nivelPreco: 1,
    ),
  ];

  const LineupPlaceIndicator({super.key});

  @override
  Widget build(BuildContext context) {
    if ( /*lineup == null ||*/ lineup.isEmpty) {
      return const SizedBox();
    }

    return SizedBox(
      height: 160,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: lineup.length,
        separatorBuilder: (_, __) => const SizedBox(width: 16),
        itemBuilder: (context, index) {
          final artista = lineup[index];
          return Column(
            children: [
              Container(
                width: 86,
                height: 86,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(color: artista.cor, width: 2),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(3),
                  child: Container(
                    width: 80,
                    height: 80,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(color: Color(colorNoturno), width: 0),
                    ),
                    child: ClipOval(
                      child: Image.network(
                        artista.url,
                        fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) => const Placeholder(),
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 15),
              Text(
                artista.nome,
                style: GoogleFonts.inter(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                  fontSize: 12,
                ),
                overflow: TextOverflow.ellipsis,
              ),

              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.star_border, color: Color(colorBrasa), size: 12),
                  SizedBox(width: 6),
                  Text(
                    '${artista.avaliacao}',
                    style: TextStyle(color: Colors.white54, fontSize: 11),
                  ),
                  SizedBox(width: 8),
                  Icon(Icons.circle, color: Colors.white38, size: 4),
                  SizedBox(width: 8),
                  Text(
                    '\$' * artista.nivelPreco,
                    style: TextStyle(color: Colors.white54, fontSize: 11),
                  ),
                ],
              ),
            ],
          );
        },
      ),
    );
  }
}
