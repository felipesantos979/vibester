import 'package:flutter/material.dart';
import 'package:mobile/models/user/user_model.dart';

class UserProvider extends ChangeNotifier {
  final _userMock = UserModel(
    nome: 'Victor Marchi',
    nomeUsuario: 'vitin',
    bio: 'founder of vibester.',
    seguidores: 1302,
    seguindo: 32,
    eventosVisitados: 123,
    fotoPerfil:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCNBLmnNWfkgI83S1NuVF2k6dMjISlhRVMKQ&s',
  );

  UserModel get user => _userMock;
}
