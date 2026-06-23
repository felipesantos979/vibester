class UserModel {
  String? id;
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
    this.id,
    required this.nome,
    required this.nomeUsuario,
    this.bio = '',
    this.seguidores = 0,
    this.seguindo = 0,
    this.eventosVisitados = 0,
    this.fotoPerfil = '',
    this.interesses = '',
    required this.email,
    this.telefone = '',
    required this.dataNascimento,
    this.cidade = '',
  });

  //Json pra dart, é pra quando os dados virem da API.
  //Não ha validação pra caso venha null, valores reserva apenas para testes. Mudar depois!
  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'],
      nome: json['name'] ?? '',
      nomeUsuario: json['username'] ?? '',
      bio: json['bio'] ?? '',
      seguidores: json['followersCount'] ?? 0,
      seguindo: json['followingCount'] ?? 0,
      eventosVisitados: json['eventsVisited'] ?? 0,
      fotoPerfil: json['avatarUrl'] ?? '',
      email: json['email'] ?? '',
      telefone: json['phone'] ?? '',
      dataNascimento: json['bornAt'] ?? '',
      cidade: json['city'] ?? '',
    );
  }

  //Dart pra json, pra quando for mandar pra API
  Map<String, dynamic> toJson() {
    return {
      'name': nome,
      'username': nomeUsuario,
      'bio': bio,
      'avatarUrl': fotoPerfil,
      'email': email,
      'phone': telefone,
      'bornAt': dataNascimento,
      'city': cidade,
    };
  }
}