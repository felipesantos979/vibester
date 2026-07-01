/// Janela padrão até os dados de um provider serem considerados desatualizados.
///
/// Passado esse tempo, a próxima chamada ao fetch (ex: ao entrar na tela)
/// dispara uma nova requisição mesmo sem pull-to-refresh manual.
const staleDataAfter = Duration(minutes: 5);

bool isDataStale(
  DateTime? lastFetchedAt, [
  Duration staleAfter = staleDataAfter,
]) {
  if (lastFetchedAt == null) return true;
  return DateTime.now().difference(lastFetchedAt) > staleAfter;
}
