class UserModel {
  String nome;
  String nomeUsuario;
  String bio;
  int seguidores;
  int seguindo;
  int eventosVisitados;
  String fotoPerfil;
  String interesses;
  String email;
  String telefone;
  String dataNascimento;
  String cidade;

  UserModel({
    required this.nome,
    required this.nomeUsuario,
    required this.bio,
    required this.seguidores,
    required this.seguindo,
    required this.eventosVisitados,
    required this.fotoPerfil,
    required this.interesses,
    required this.email,
    required this.telefone,
    required this.dataNascimento,
    required this.cidade,
  });
}