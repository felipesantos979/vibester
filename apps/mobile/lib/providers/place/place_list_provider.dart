import 'package:flutter/material.dart';
import 'package:mobile/models/place/place_model.dart';
import 'package:mobile/service/places/place_service.dart';

class PlaceListProvider extends ChangeNotifier {
  final PlaceService _service = PlaceService();
  bool isLoading = false;
  String? error;

  List<PlaceModel> _places = [];

  List<PlaceModel> get places => _places;

  List<PlaceModel> get favorites =>
      _places.where((p) => p.isFavorite == true).toList();

  Future<void> fetchPlaces({bool force = false}) async {
    if (_places.isNotEmpty && !force) return;

    isLoading = true;
    error = null;
    notifyListeners();

    try {
      _places = await _service.getPlaces();
      print('Places carregados: ${_places.length}');
    } catch (e) {
      error = 'Não foi possível carregar os estabelecimentos';
      print('Erro ao buscar places: $e');
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  void toggleFavorite(String nome) {
    final place = _places.firstWhere((p) => p.nome == nome);
    place.isFavorite = !place.isFavorite;
    notifyListeners();
  }
}
