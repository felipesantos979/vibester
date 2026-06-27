import 'package:mobile/models/place/place_model.dart';
import 'package:mobile/service/api_client.dart';
import 'package:mobile/service/api_endpoints.dart';

class PlaceService {
  Future<List<PlaceModel>> getPlaces() async {
    final response = await ApiClient.dio.get(ApiEndpoints.establishments());
    final List data = response.data;
    return data.map((json) => PlaceModel.fromJson(json)).toList();
  }
}
