import 'package:diacritic/diacritic.dart';
import 'package:flutter/material.dart';
import 'package:mobile/models/place/place_model.dart';
import 'package:mobile/providers/place/place_list_provider.dart';
import 'package:mobile/screens/places/place_detail_screen.dart';
import 'package:mobile/utils/colors.dart';
import 'package:mobile/widgets/cards/place/place_card.dart';
import 'package:mobile/utils/search_bar.dart';
import 'package:provider/provider.dart';

class HotPlacesScreen extends StatefulWidget {
  const HotPlacesScreen({super.key});

  @override
  State<HotPlacesScreen> createState() => _HotPlacesScreenState();
}

class _HotPlacesScreenState extends State<HotPlacesScreen> {
  final TextEditingController pesquisaController = TextEditingController();
  List<PlaceModel> listaFiltrada = [];

  @override
  void initState() {
    super.initState();
    final places = context.read<PlaceListProvider>().places;
    listaFiltrada = List.from(places);
  }

  void pesquisaPlaces() {
    final places = context.read<PlaceListProvider>().places;
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
        padding: const EdgeInsets.fromLTRB(0, 16, 0, 80),
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
              padding: const EdgeInsets.symmetric(vertical: 90),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  SizedBox(
                    height: 200,
                    width: 200,
                    child: Image.asset('assets/img/lupa.png'),
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
