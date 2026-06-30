import 'package:intl/intl.dart';
import 'package:mobile/models/event/event_model.dart';
import 'package:mobile/service/api_client.dart';
import 'package:mobile/service/api_endpoints.dart';

class EventService {
  List<EventModel> events = [];
  List<EventModel> nearbyEvents = [];
  EventModel? selectedEvent;

  Future<List<EventModel>> getEvents() async {
    final response = await ApiClient.dio.get(ApiEndpoints.events());
    final List data = response.data;
    events = data.map((json) => EventModel.fromJson(json)).toList();
    return events;
  }

  Future<List<EventModel>> getEventsFeatured() async {
    final response = await ApiClient.dio.get(ApiEndpoints.eventsFeatured());
    final List data = response.data;
    return data.map((json) => EventModel.fromJson(json)).toList();
  }

  Future<List<EventModel>> getEventsWeek({DateTime? date}) async {
    final dataFormatada = DateFormat('yyyy-MM-dd').format(date ?? DateTime.now());

    final response = await ApiClient.dio.get(
      ApiEndpoints.eventsWeek(dataFormatada),
    );

    final List data = response.data;
    return data.map((json) => EventModel.fromJson(json)).toList();
  }

  Future<List<EventModel>> getEventsNearby({
    required double latitude,
    required double longitude,
    double radiusKm = 20,
  }) async {
    final response = await ApiClient.dio.get(
      ApiEndpoints.eventNearby(),
      queryParameters: {
        'latitude': latitude.toString(),
        'longitude': longitude.toString(),
        'radiusKm': radiusKm,
      },
    );

    final List data = response.data;
    nearbyEvents = data.map((json) => EventModel.fromJson(json)).toList();
    return nearbyEvents;
  }

  Future<EventModel> getEventById(String eventId) async {
    final response = await ApiClient.dio.get(ApiEndpoints.eventDetail(eventId));
    selectedEvent = EventModel.fromJson(response.data);
    return selectedEvent!;
  }
}