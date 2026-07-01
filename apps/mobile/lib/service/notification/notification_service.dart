import 'package:dio/dio.dart';
import 'package:mobile/models/notification/notification_model.dart';
import 'package:mobile/service/api_client.dart';
import 'package:mobile/service/api_endpoints.dart';

class NotificationService {
  Future<List<NotificationModel>> getNotifications(String userId) async {
    try {
      final response = await ApiClient.dio.get(
        ApiEndpoints.notifications(userId),
      );

      final items = response.data['items'] as List<dynamic>? ?? [];
      return items.map((json) => NotificationModel.fromJson(json)).toList();
    } on DioException catch (e) {
      final mensagem =
          e.response?.data?['message'] ?? 'Erro ao buscar notificações';
      throw Exception(mensagem);
    }
  }

  Future<int> getUnreadCount(String userId) async {
    try {
      final response = await ApiClient.dio.get(
        ApiEndpoints.notificationsUnreadCount(userId),
      );
      return response.data['count'] ?? 0;
    } on DioException catch (e) {
      final mensagem =
          e.response?.data?['message'] ?? 'Erro ao buscar notificações';
      throw Exception(mensagem);
    }
  }

  Future<void> markAllRead(String userId) async {
    try {
      await ApiClient.dio.patch(ApiEndpoints.notificationsMarkRead(userId));
    } on DioException catch (e) {
      final mensagem =
          e.response?.data?['message'] ??
          'Erro ao marcar notificações como lidas';
      throw Exception(mensagem);
    }
  }
}
