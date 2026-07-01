import 'package:intl/intl.dart';

/// Formata uma data em texto relativo curto pt-BR ("agora", "5min", "2h",
/// "3d"), caindo para uma data curta ("1 mar") depois de uma semana.
String formatRelativeTime(DateTime dateTime) {
  final local = dateTime.toLocal();
  final diff = DateTime.now().difference(local);

  if (diff.inSeconds < 60) return 'agora';
  if (diff.inMinutes < 60) return '${diff.inMinutes}min';
  if (diff.inHours < 24) return '${diff.inHours}h';
  if (diff.inDays < 7) return '${diff.inDays}d';

  return DateFormat('d MMM', 'pt_BR').format(local);
}
