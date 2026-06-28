import 'package:dio/dio.dart';
import 'package:mobile/models/highlights/highlight_model.dart';
import 'package:mobile/service/api_client.dart';
import 'package:mobile/service/api_endpoints.dart';

class HighlightsService {
  // Busca os posts de um usuário pelo accountId
  Future<List<HighlightModel>> getHighlightsByAccountId(
    String accountId,
  ) async {
    try {
      final response = await ApiClient.dio.get(
        ApiEndpoints.userPosts(accountId),
      );
      final List data = response.data;
      return data.map((json) => HighlightModel.fromJson(json)).toList();
    } on DioException catch (e) {
      final mensagem =
          e.response?.data?['message'] ?? 'Erro ao buscar destaques';
      throw Exception(mensagem);
    }
  }
}