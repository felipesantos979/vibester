import 'package:flutter/material.dart';
import 'package:mobile/models/place/place_model.dart';
import 'package:mobile/service/places/place_service.dart';
import 'package:mobile/utils/data_freshness.dart';

class PlaceListProvider extends ChangeNotifier {
  final PlaceService _service = PlaceService();
  bool isLoading = false;
  String? error;

  List<PlaceModel> _places = [];
  DateTime? _lastFetchedAt;

  List<PlaceModel> get places => _places;

  List<PlaceModel> get favorites =>
      _places.where((p) => p.isFavorite == true).toList();

  /// Busca os estabelecimentos.
  ///
  /// Se já houver dados carregados e ainda dentro da janela de validade
  /// ([staleDataAfter]), não refaz a requisição — a menos que [force] seja
  /// true (usado no pull-to-refresh). Passada essa janela, a próxima chamada
  /// (ex: ao entrar na tela) já dispara uma nova busca automaticamente.
  Future<void> fetchPlaces({bool force = false}) async {
    if (_places.isNotEmpty && !force && !isDataStale(_lastFetchedAt)) return;

    isLoading = true;
    error = null;
    notifyListeners();

    try {
      _places = await _service.getPlaces();
      _lastFetchedAt = DateTime.now();
    } catch (e) {
      error = 'Não foi possível carregar os estabelecimentos';
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
