import 'package:diacritic/diacritic.dart';
import 'package:flutter/material.dart';
import 'package:mobile/models/place/place_model.dart';
import 'package:mobile/screens/places/place_detail_screen.dart';
import 'package:mobile/utils/colors.dart';
import 'package:mobile/widgets/cards/place_card.dart';
import 'package:mobile/utils/search_bar.dart';

class HotPlacesScreen extends StatefulWidget {
  const HotPlacesScreen({super.key});

  @override
  State<HotPlacesScreen> createState() => _HotPlacesScreenState();
}

class _HotPlacesScreenState extends State<HotPlacesScreen> {
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
    PlaceModel(
      nome: 'Boteco do Léo',
      nivelMovimento: 5,
      categoria: 'Bar',
      avaliacao: 4.1,
      nivelPrecoMedio: 'baixo',
      bio:
          'O Léo conhece todo mundo pelo nome. Cerveja gelada, petisco farto e aquela conversa que se estende até depois da meia-noite.',
      endereco: 'R. das Acácias, 19',
      qtdAvaliacoes: 1240,
      distribuicao: [0.75, 0.15, 0.05, 0.03, 0.02],
    ),
    PlaceModel(
      nome: 'La Trattoria',
      nivelMovimento: 3,
      categoria: 'Italiano',
      avaliacao: 4.6,
      nivelPrecoMedio: 'alto',
      bio:
          'Massas frescas feitas no dia, carta de vinhos cuidadosa e um salão que faz qualquer jantar parecer especial.',
      endereco: 'Av. Brasil, 788',
      qtdAvaliacoes: 1875,
      distribuicao: [0.78, 0.14, 0.05, 0.02, 0.01],
    ),
    PlaceModel(
      nome: 'Hamburgueria 404',
      nivelMovimento: 4,
      categoria: 'Hamburgueria',
      avaliacao: 4.4,
      nivelPrecoMedio: 'medio',
      bio:
          'Referência não encontrada? Aqui não. Os hambúrgueres são artesanais, os combos são absurdos e o lugar é pequeno de propósito.',
      endereco: 'R. Marechal Deodoro, 301',
      qtdAvaliacoes: 1105,
      distribuicao: [0.68, 0.18, 0.08, 0.04, 0.02],
    ),
    PlaceModel(
      nome: 'Bistrô do Porto',
      nivelMovimento: 2,
      categoria: 'Bistrô',
      avaliacao: 4.5,
      nivelPrecoMedio: 'medio',
      bio:
          'Cardápio enxuto que muda com a estação. Ambiente aconchegante para quem quer comer bem sem pressa.',
      endereco: 'Av. Beira Rio, 55',
      qtdAvaliacoes: 430,
      distribuicao: [0.72, 0.16, 0.07, 0.03, 0.02],
    ),
    PlaceModel(
      nome: 'Tapiocaria Sol',
      nivelMovimento: 3,
      categoria: 'Lanchonete',
      avaliacao: 4.0,
      nivelPrecoMedio: 'baixo',
      bio:
          'Tapiocas recheadas na hora, suco natural e aquele café da manhã que faz a diferença antes de encarar o dia.',
      endereco: 'R. Independência, 123',
      qtdAvaliacoes: 560,
      distribuicao: [0.54, 0.22, 0.14, 0.06, 0.04],
    ),
    PlaceModel(
      nome: 'Churrascaria Gaúcha',
      nivelMovimento: 5,
      categoria: 'Churrascaria',
      avaliacao: 4.8,
      nivelPrecoMedio: 'alto',
      bio:
          'Rodízio completo com cortes nobres e gaúchos de verdade na churrasqueira. Venha com fome e saia feliz.',
      endereco: 'Av. Paraná, 940',
      qtdAvaliacoes: 2780,
      distribuicao: [0.87, 0.08, 0.03, 0.01, 0.01],
    ),
    PlaceModel(
      nome: 'Empório Vegano',
      nivelMovimento: 2,
      categoria: 'Vegano',
      avaliacao: 4.3,
      nivelPrecoMedio: 'alto',
      bio:
          'Culinária plant-based que convence até quem não é vegano. Ingredientes orgânicos, sabor sem concessão.',
      endereco: 'R. das Flores, 77',
      qtdAvaliacoes: 390,
      distribuicao: [0.63, 0.20, 0.10, 0.04, 0.03],
    ),
    PlaceModel(
      nome: 'Bar da Esquina',
      nivelMovimento: 4,
      categoria: 'Bar',
      avaliacao: 3.9,
      nivelPrecoMedio: 'medio',
      bio:
          'Aquele bar de bairro que todo mundo tem saudade. Jogo na TV, mesa de plástico e doses generosas.',
      endereco: 'R. Almirante Barroso, 228',
      qtdAvaliacoes: 715,
      distribuicao: [0.50, 0.22, 0.15, 0.08, 0.05],
    ),
    PlaceModel(
      nome: 'Doceria Mel',
      nivelMovimento: 1,
      categoria: 'Doceria',
      avaliacao: 4.7,
      nivelPrecoMedio: 'baixo',
      bio:
          'Doces artesanais feitos com amor e receitas de família. Um pedaço de bolo aqui vale mais que qualquer sobremesa chique.',
      endereco: 'R. Dom Pedro II, 11',
      qtdAvaliacoes: 290,
      distribuicao: [0.82, 0.11, 0.04, 0.02, 0.01],
    ),
  ];

  final TextEditingController pesquisaController = TextEditingController();
  List<PlaceModel> listaFiltrada = [];

  @override
  void initState() {
    super.initState();
    listaFiltrada = List.from(places);
  }

  void pesquisaPlaces() {
    final query = removeDiacritics(pesquisaController.text.toUpperCase());
    listaFiltrada = places
        .where(
          (place) =>
              removeDiacritics(place.nome.toUpperCase()).contains(query) ||
              removeDiacritics(place.categoria.toUpperCase()).contains(query),
        )
        .toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(colorNoturno),
      body: ListView.builder(
        padding: const EdgeInsets.symmetric(vertical: 16),
        itemCount: listaFiltrada.isEmpty ? 2 : listaFiltrada.length + 1,
        itemBuilder: (context, index) {
          if (index == 0) {
            return Padding(
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Populares Agora',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text.rich(
                    TextSpan(
                      text: 'Os locais mais movimentados da cidade ',
                      style: TextStyle(color: Colors.white54, fontSize: 14),
                      children: [
                        TextSpan(
                          text: 'ao vivo!',
                          style: TextStyle(
                            color: Color(colorAmbar),
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                  CustomSearchBar(
                    controller: pesquisaController,
                    onChanged: () {
                      pesquisaPlaces();
                      setState(() {});
                    },
                  ),
                ],
              ),
            );
          }

          if (listaFiltrada.isEmpty) {
            return Padding(
              padding: const EdgeInsets.symmetric(vertical: 120),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.search_off,
                    color: Color(colorAmbar).withAlpha(200),
                    size: 64,
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'Nenhum lugar encontrado',
                    style: TextStyle(
                      color: Colors.white38,
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Tente buscar por outro nome ou categoria',
                    style: TextStyle(color: Colors.white24, fontSize: 13),
                  ),
                ],
              ),
            );
          }

          return PlaceCard(
            place: listaFiltrada[index - 1],
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) =>
                      PlaceDetailScreen(place: listaFiltrada[index - 1]),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
