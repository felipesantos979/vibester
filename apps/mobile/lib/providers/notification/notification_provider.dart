import 'package:flutter/material.dart';
import 'package:mobile/models/notification/notification_model.dart';
import 'package:mobile/service/notification/notification_service.dart';
import 'package:mobile/utils/data_freshness.dart';

class NotificationProvider extends ChangeNotifier {
  final NotificationService _service = NotificationService();
  bool isLoading = false;
  String? error;

  List<NotificationModel> _notifications = [];
  DateTime? _lastFetchedAt;

  int unreadCount = 0;

  List<NotificationModel> get notifications => _notifications;

  /// Busca as notificações do usuário.
  ///
  /// Se já houver dados carregados e ainda dentro da janela de validade,
  /// não refaz a requisição — a menos que [force] seja true (pull-to-refresh).
  Future<void> fetchNotifications(String userId, {bool force = false}) async {
    if (_notifications.isNotEmpty && !force && !isDataStale(_lastFetchedAt)) {
      return;
    }

    isLoading = true;
    error = null;
    notifyListeners();

    try {
      _notifications = await _service.getNotifications(userId);
      _lastFetchedAt = DateTime.now();
    } catch (e) {
      error = 'Não foi possível carregar as notificações';
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  /// Atualiza só o contador de não vistas (badge), sem afetar a lista
  /// carregada. Chamado com frequência (boot do app, troca de aba) já que é
  /// uma chamada barata, sem cache/staleness.
  Future<void> fetchUnreadCount(String userId) async {
    try {
      unreadCount = await _service.getUnreadCount(userId);
      notifyListeners();
    } catch (_) {
      // Mantém o valor atual em tela caso a atualização falhe.
    }
  }

  /// Marca todas as notificações como lidas no backend e zera o badge
  /// localmente, sem round-trip. A lista já carregada (`notifications`)
  /// não é alterada aqui — a tela usa o `lida` retornado pelo fetch mais
  /// recente para separar Novas/Visualizadas durante a visita atual.
  Future<void> markAllRead(String userId) async {
    try {
      await _service.markAllRead(userId);
      unreadCount = 0;
      notifyListeners();
    } catch (_) {
      // Se falhar, o badge continua mostrando o valor anterior.
    }
  }
}
