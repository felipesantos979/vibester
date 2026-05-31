import 'package:flutter/material.dart';
import 'package:mobile/models/place/place_model.dart';
import 'package:mobile/screens/places/place_detail_screen.dart';
import 'package:mobile/utils/colors.dart';
import 'package:mobile/widgets/cards/place_card_for_favorites.dart';

class FavoritesScreen extends StatefulWidget {
  const FavoritesScreen({super.key});

  @override
  State<FavoritesScreen> createState() => _FavoritesScreenState();
}

class _FavoritesScreenState extends State<FavoritesScreen> {
  final List<PlaceModel> favorites = [
    PlaceModel(
      nome: 'Café Central',
      nivelMovimento: 5,
      categoria: 'Café',
      avaliacao: 4.0,
      nivelPrecoMedio: 'alto',
      bio: 'O point favorito dos trabalhadores do centro.',
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
      bio: 'A balada que não precisa de apresentação.',
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
      bio: 'Churrasco de verdade, sem frescura e sem preço salgado.',
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
      bio: 'Escondido no subsolo, drinques autorais e vibe única.',
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
      bio: 'Experiência japonesa autêntica com precisão em cada peça.',
      endereco: 'Av. das Nações, 210',
      qtdAvaliacoes: 2100,
      distribuicao: [0.85, 0.10, 0.03, 0.01, 0.01],
    ),
    PlaceModel(
      nome: 'Boteco do Léo',
      nivelMovimento: 5,
      categoria: 'Bar',
      avaliacao: 4.1,
      nivelPrecoMedio: 'baixo',
      bio: 'Cerveja gelada, petisco farto e conversa até depois da meia-noite.',
      endereco: 'R. das Acácias, 19',
      qtdAvaliacoes: 1240,
      distribuicao: [0.75, 0.15, 0.05, 0.03, 0.02],
    ),
    PlaceModel(
      nome: 'Pizza Roma',
      nivelMovimento: 4,
      categoria: 'Pizzaria',
      avaliacao: 4.3,
      nivelPrecoMedio: 'medio',
      bio: 'Massa fina, forno a lenha e receitas italianas de verdade.',
      endereco: 'R. Floriano Peixoto, 415',
      qtdAvaliacoes: 980,
      distribuicao: [0.65, 0.18, 0.10, 0.04, 0.03],
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
                        'Seus lugares favoritos',
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
                        'Os lugares que você ama acompanhar de perto.',
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

          return PlaceCardForFavorites(
            place: favorites[index - 1],
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) =>
                      PlaceDetailScreen(place: favorites[index - 1]),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
