import 'package:flutter/material.dart';
import 'package:mobile/models/place/place_model.dart';
import 'package:mobile/screens/places/place_detail_screen.dart';
import 'package:mobile/utils/colors.dart';
import 'package:mobile/widgets/cards/place_favorite_card.dart';

class FavoritePlacesScreen extends StatefulWidget {
  const FavoritePlacesScreen({super.key});

  @override
  State<FavoritePlacesScreen> createState() => _FavoritePlacesScreenState();
}

class _FavoritePlacesScreenState extends State<FavoritePlacesScreen> {
  final List<PlaceModel> places = [
    PlaceModel(
      nome: 'Café Central',
      nivelMovimento: 5,
      categoria: 'Café',
      avaliacao: 4.0,
      nivelPrecoMedio: 'alto',
      bio:
          'O point favorito dos trabalhadores do centro. Café coado na hora, wi-fi rápido e aquela energia de segunda de manhã o dia todo.',
      endereco: 'Av. Presidente Vargas, 142',
      qtdAvaliacoes: 832,
      distribuicao: [0.55, 0.25, 0.12, 0.05, 0.03],
    ),
    PlaceModel(
      nome: 'Filin',
      nivelMovimento: 5,
      categoria: 'Balada',
      avaliacao: 4.9,
      nivelPrecoMedio: 'medio',
      bio:
          'A balada que não precisa de apresentação. Line-ups de peso, pista sempre lotada e som que você sente no peito.',
      endereco: 'R. das Palmeiras, 87',
      qtdAvaliacoes: 3210,
      distribuicao: [0.92, 0.05, 0.02, 0.01, 0.00],
    ),
    PlaceModel(
      nome: 'Churrasquero House',
      nivelMovimento: 4,
      categoria: 'Restaurante',
      avaliacao: 4.7,
      nivelPrecoMedio: 'baixo',
      bio:
          'Churrasco de verdade, sem frescura e sem preço salgado. Aqui a brasa nunca apaga e a fila anda rápido.',
      endereco: 'R. Tiradentes, 560',
      qtdAvaliacoes: 1540,
      distribuicao: [0.80, 0.12, 0.05, 0.02, 0.01],
    ),
    PlaceModel(
      nome: 'Porão Bar',
      nivelMovimento: 3,
      categoria: 'Bar',
      avaliacao: 4.2,
      nivelPrecoMedio: 'alto',
      bio:
          'Escondido no subsolo, o Porão tem drinques autorais, luz baixa e aquela vibe de quem sabe o que está fazendo.',
      endereco: 'R. Sete de Setembro, 34',
      qtdAvaliacoes: 670,
      distribuicao: [0.62, 0.20, 0.10, 0.05, 0.03],
    ),
    PlaceModel(
      nome: 'Sushi Zen',
      nivelMovimento: 2,
      categoria: 'Japonês',
      avaliacao: 4.8,
      nivelPrecoMedio: 'alto',
      bio:
          'Experiência japonesa autêntica. Cada peça é montada com precisão e o ambiente convida ao silêncio e à boa comida.',
      endereco: 'Av. das Nações, 210',
      qtdAvaliacoes: 2100,
      distribuicao: [0.85, 0.10, 0.03, 0.01, 0.01],
    ),
    PlaceModel(
      nome: 'Pizza Roma',
      nivelMovimento: 4,
      categoria: 'Pizzaria',
      avaliacao: 4.3,
      nivelPrecoMedio: 'medio',
      bio:
          'Massa fina, forno a lenha e receitas que viajaram do interior da Itália até aqui. Simples assim, gostoso assim.',
      endereco: 'R. Floriano Peixoto, 415',
      qtdAvaliacoes: 980,
      distribuicao: [0.65, 0.18, 0.10, 0.04, 0.03],
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(colorNoturno),
      body: places.isEmpty
          ? Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Center(
                  child: SizedBox(
                    height: 100,
                    width: 100,
                    child: Opacity(
                      opacity: 0.8,
                      child: Image.asset('assets/img/lupa.png'),
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  'Nenhum lugar marcado como favorito',
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
              itemCount: places.length + 1,
              itemBuilder: (context, index) {
                if (index == places.length) return SizedBox(height: 80);

                return PlaceFavoriteCard(
                  place: places[index],
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) =>
                            PlaceDetailScreen(place: places[index]),
                      ),
                    );
                  },
                );
              },
            ),
    );
  }
}
