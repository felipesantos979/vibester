import 'package:flutter/material.dart';
import 'package:mobile/models/place/place_model.dart';

class PlaceListProvider extends ChangeNotifier {
  final List<PlaceModel> _places = [
    PlaceModel(
      nome: 'Obscuro',
      nivelMovimento: 5,
      categoria: 'Bar',
      avaliacao: 4.0,
      nivelPrecoMedio: 'alto',
      bio:
          'O point favorito dos trabalhadores do centro. Café coado na hora, wi-fi rápido e aquela energia de segunda de manhã o dia todo.',
      endereco: 'Av. Presidente Vargas, 142',
      qtdAvaliacoes: 832,
      distribuicao: [0.55, 0.25, 0.12, 0.05, 0.03],
      profileImage: 'assets/img/places/filin.jpg',
    ),
    PlaceModel(
      nome: 'Douha',
      nivelMovimento: 5,
      categoria: 'Balada',
      avaliacao: 4.9,
      nivelPrecoMedio: 'medio',
      bio:
          'A balada que não precisa de apresentação. Line-ups de peso, pista sempre lotada e som que você sente no peito.',
      endereco: 'R. das Palmeiras, 87',
      qtdAvaliacoes: 3210,
      distribuicao: [0.92, 0.05, 0.02, 0.01, 0.00],
      profileImage: 'assets/img/places/douha.jpg',
    ),
    PlaceModel(
      nome: 'Folks',
      nivelMovimento: 4,
      categoria: 'Balada',
      avaliacao: 4.7,
      nivelPrecoMedio: 'baixo',
      bio:
          'Churrasco de verdade, sem frescura e sem preço salgado. Aqui a brasa nunca apaga e a fila anda rápido.',
      endereco: 'R. Tiradentes, 560',
      qtdAvaliacoes: 1540,
      distribuicao: [0.80, 0.12, 0.05, 0.02, 0.01],
      profileImage: 'assets/img/places/folks.jpg',
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
      profileImage: 'assets/img/places/porao.jpg',
    ),
    PlaceModel(
      nome: 'Coronel',
      nivelMovimento: 2,
      categoria: 'Bar',
      avaliacao: 4.8,
      nivelPrecoMedio: 'alto',
      bio:
          'Experiência japonesa autêntica. Cada peça é montada com precisão e o ambiente convida ao silêncio e à boa comida.',
      endereco: 'Av. das Nações, 210',
      qtdAvaliacoes: 2100,
      distribuicao: [0.85, 0.10, 0.03, 0.01, 0.01],
      profileImage: 'assets/img/places/coronel.jpg',
    ),
    PlaceModel(
      nome: 'Ultra Club',
      nivelMovimento: 4,
      categoria: 'Balada',
      avaliacao: 4.3,
      nivelPrecoMedio: 'medio',
      bio:
          'Massa fina, forno a lenha e receitas que viajaram do interior da Itália até aqui. Simples assim, gostoso assim.',
      endereco: 'R. Floriano Peixoto, 415',
      qtdAvaliacoes: 980,
      distribuicao: [0.65, 0.18, 0.10, 0.04, 0.03],
      profileImage: 'assets/img/places/ultraclub.jpg',
    ),
    PlaceModel(
      nome: 'Primos Beer',
      nivelMovimento: 5,
      categoria: 'Bar',
      avaliacao: 4.1,
      nivelPrecoMedio: 'baixo',
      bio:
          'O Léo conhece todo mundo pelo nome. Cerveja gelada, petisco farto e aquela conversa que se estende até depois da meia-noite.',
      endereco: 'R. das Acácias, 19',
      qtdAvaliacoes: 1240,
      distribuicao: [0.75, 0.15, 0.05, 0.03, 0.02],
      profileImage: 'assets/img/places/primos.jpg',
    ),
    PlaceModel(
      nome: 'Seu Petronio',
      nivelMovimento: 3,
      categoria: 'Italiano',
      avaliacao: 4.6,
      nivelPrecoMedio: 'alto',
      bio:
          'Massas frescas feitas no dia, carta de vinhos cuidadosa e um salão que faz qualquer jantar parecer especial.',
      endereco: 'Av. Brasil, 788',
      qtdAvaliacoes: 1875,
      distribuicao: [0.78, 0.14, 0.05, 0.02, 0.01],
      profileImage: 'assets/img/places/petronio.jpg',
    ),
    PlaceModel(
      nome: 'Caravelha',
      nivelMovimento: 3,
      categoria: 'Bar',
      avaliacao: 4.6,
      nivelPrecoMedio: 'alto',
      bio:
          'Massas frescas feitas no dia, carta de vinhos cuidadosa e um salão que faz qualquer jantar parecer especial.',
      endereco: 'Av. Brasil, 788',
      qtdAvaliacoes: 1875,
      distribuicao: [0.78, 0.14, 0.05, 0.02, 0.01],
      profileImage: 'assets/img/places/caravelha.jpg',
    ),
  ];

  List<PlaceModel> get places => _places;
}
