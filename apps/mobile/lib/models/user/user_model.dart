class UserModel {
  final String? nome;
  final String nomeUsuario;
  final String bio;
  final int seguidores;
  final int seguindo;
  final int eventosVisitados;
  final String fotoPerfil;

  UserModel({
    required this.nome,
    required this.nomeUsuario,
    required this.bio,
    required this.seguidores,
    required this.seguindo,
    required this.eventosVisitados,
    required this.fotoPerfil,
  });
}
