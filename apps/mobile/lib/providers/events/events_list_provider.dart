import 'package:flutter/material.dart';
import 'package:mobile/models/event/event_model.dart';
import 'package:mobile/service/event/event_service.dart';

class EventsListProvider extends ChangeNotifier {
  final EventService _service = EventService();

  List<EventModel> _events = [];
  bool isLoading = false;
  String? error;

  List<EventModel> get events => _events;

  List<EventModel> get favorites =>
      _events.where((e) => e.isFavorite == true).toList();

  Future<void> fetchEvents({bool force = false}) async {
  if (_events.isNotEmpty && !force) return;

  isLoading = true;
  error = null;
  notifyListeners();

  try {
    _events = await _service.getEvents();
  } catch (e) {
    error = 'Não foi possível carregar os eventos';
  } finally {
    isLoading = false;
    notifyListeners();
  }
}

  //isso meche só com dados locais, eu não mexi ainda, mas quando conectar a API certo isso vai ter que mudar
  void toggleFavorite(String titulo) {
    final event = _events.firstWhere((e) => e.titulo == titulo);
    event.isFavorite = !event.isFavorite;
    notifyListeners();
  }
}