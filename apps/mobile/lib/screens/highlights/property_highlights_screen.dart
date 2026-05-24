import 'package:flutter/material.dart';
import 'package:mobile/models/highlights/highlight_model.dart';
import 'package:mobile/utils/colors.dart';
import 'package:mobile/widgets/cards/highlights_card.dart';

class PropertyHighlightsScreen extends StatefulWidget {
  const PropertyHighlightsScreen({super.key});

  @override
  State<PropertyHighlightsScreen> createState() =>
      _PropertyHighlightsScreenState();
}

class _PropertyHighlightsScreenState extends State<PropertyHighlightsScreen> {
  static const String fotos =
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgpnQNClh0kA43xMUXgiu_GKAqIL97g2dMY80DJ4A15pnck6ZxZ6APvn2KKdSIxajG8RSdRq6mesWTCn0kIItn6tlCqAZkE8Nx-snm2TCW&s=10";

  List<HighlightModel> get highlights => [
    HighlightModel(imagemEmDestaque: fotos),
    HighlightModel(imagemEmDestaque: fotos),
    HighlightModel(imagemEmDestaque: fotos),
    HighlightModel(imagemEmDestaque: fotos),
    HighlightModel(imagemEmDestaque: fotos),
    HighlightModel(imagemEmDestaque: fotos),
    HighlightModel(imagemEmDestaque: fotos),
    HighlightModel(imagemEmDestaque: fotos),
    HighlightModel(imagemEmDestaque: fotos),
    HighlightModel(imagemEmDestaque: fotos),
    HighlightModel(imagemEmDestaque: fotos),
    HighlightModel(imagemEmDestaque: fotos),
    HighlightModel(imagemEmDestaque: fotos),
    HighlightModel(imagemEmDestaque: fotos),
    HighlightModel(imagemEmDestaque: fotos),
    HighlightModel(imagemEmDestaque: fotos),
    HighlightModel(imagemEmDestaque: fotos),
    HighlightModel(imagemEmDestaque: fotos),
    HighlightModel(imagemEmDestaque: fotos),
    HighlightModel(imagemEmDestaque: fotos),
    HighlightModel(imagemEmDestaque: fotos),
    HighlightModel(imagemEmDestaque: fotos),
    HighlightModel(imagemEmDestaque: fotos),
    HighlightModel(imagemEmDestaque: fotos),
    HighlightModel(imagemEmDestaque: fotos),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(colorNoturno),

      //Uso o gridview no lugar do listview pq é mais simples de mecher e de montar as imagens
      //O gridview pega toda a largura ta tela, q é dividido pelo crossAC e pelo childAR
      body: GridView.builder(
        itemCount: highlights.length,
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          //pega a largura da tela dividido por 2 (pra dar duas imagens por linha)
          crossAxisCount: 2,
          //define a altura com base na largura 
          childAspectRatio: 0.85,
          
          crossAxisSpacing: 10,
          mainAxisSpacing: 10,
        ),
        padding: const EdgeInsets.all(12),
        itemBuilder: (context, index) {
          return HighlightsCard(highlight: highlights[index]);
        },
      ),
    );
  }
}
