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

  // Eventos em destaque
  List<EventModel> _featuredEvents = [];
  bool isLoadingFeatured = false;
  String? featuredError;

  List<EventModel> get featuredEvents => _featuredEvents;

  Future<void> fetchFeaturedEvents() async {
    isLoadingFeatured = true;
    notifyListeners();

    try {
      final resultado = await _service.getEventsFeatured();
      // Só substitui a lista guardada se a busca realmente trouxe dados
      if (resultado.isNotEmpty) {
        _featuredEvents = resultado;
        featuredError = null;
      }
    } catch (e) {
      featuredError = 'Não foi possível carregar os destaques';
    } finally {
      isLoadingFeatured = false;
      notifyListeners();
    }
  }

  // Eventos da semana
  List<EventModel> _weekEvents = [];
  bool isLoadingWeek = false;
  String? weekError;

  List<EventModel> get weekEvents => _weekEvents;

  Future<void> fetchWeekEvents({DateTime? date}) async {
    isLoadingWeek = true;
    notifyListeners();

    try {
      final resultado = await _service.getEventsWeek(date: date);
      if (resultado.isNotEmpty) {
        _weekEvents = resultado;
        weekError = null;
      }
    } catch (e) {
      weekError = 'Não foi possível carregar os eventos da semana';
    } finally {
      isLoadingWeek = false;
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