import 'package:dio/dio.dart';
import 'package:mobile/models/place/place_model.dart';
import 'package:mobile/service/api_client.dart';
import 'package:mobile/service/api_endpoints.dart';

class PlaceService {
  Future<List<PlaceModel>> getPlaces() async {
    final response = await ApiClient.dio.get(ApiEndpoints.establishments());
    final List data = response.data;
    return data.map((json) => PlaceModel.fromJson(json)).toList();
  }

  Future<List<PlaceModel>> getPlacesByCategory(String category) async {
    try {
      final response = await ApiClient.dio.get(
        ApiEndpoints.establishmentsByCategory(category),
      );
      final List data = response.data;
      return data.map((json) => PlaceModel.fromJson(json)).toList();
    } on DioException catch (e) {
      final mensagem =
          e.response?.data?['message'] ??
          'Erro ao buscar estabelecimentos por categoria';
      throw Exception(mensagem);
    }
  }

  Future<PlaceModel> getPlaceById(String id) async {
    try {
      final response = await ApiClient.dio.get(
        ApiEndpoints.establishmentDetail(id),
      );
      return PlaceModel.fromJson(response.data);
    } on DioException catch (e) {
      final mensagem =
          e.response?.data?['message'] ??
          'Erro ao buscar perfil do estabelecimento';
      throw Exception(mensagem);
    }
  }
}