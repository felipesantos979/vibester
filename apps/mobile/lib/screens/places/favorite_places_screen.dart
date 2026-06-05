import 'package:flutter/material.dart';
import 'package:mobile/models/place/place_model.dart';
import 'package:mobile/providers/place/place_list_provider.dart';
import 'package:mobile/screens/places/place_detail_screen.dart';
import 'package:mobile/utils/colors.dart';
import 'package:mobile/widgets/cards/place_card.dart';
import 'package:provider/provider.dart';

class FavoritePlacesScreen extends StatefulWidget {
  const FavoritePlacesScreen({super.key});

  @override
  State<FavoritePlacesScreen> createState() => _FavoritePlacesScreenState();
}

class _FavoritePlacesScreenState extends State<FavoritePlacesScreen> {
  @override
  Widget build(BuildContext context) {
    final List<PlaceModel> places = context.read<PlaceListProvider>().places;
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

                return PlaceCard(
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
