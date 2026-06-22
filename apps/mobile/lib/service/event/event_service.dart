import 'package:mobile/models/event/event_model.dart';
import 'package:mobile/service/api_client.dart';

class EventService {

  //Requisição de dados pra listagem
  Future<List<EventModel>> getEvents() async {
    final response = await ApiClient.dio.get('/events');
    final List data = response.data;
    return data.map((json) => EventModel.fromJson(json)).toList();
  }

  //...
}