import 'package:flutter/material.dart';
import 'package:mobile/models/user/user_model.dart';

class UserProvider extends ChangeNotifier {
  final _userMock = UserModel(
    nome: 'Victor Marchi',
    nomeUsuario: '@vitin',
    bio: 'founder of vibester.',
    seguidores: 1302,
    seguindo: 32,
    eventosVisitados: 123,
    fotoPerfil: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCNBLmnNWfkgI83S1NuVF2k6dMjISlhRVMKQ&s',
    interesses: 'O caba gosta de codar',
    email: 'victor.marchi@gmail.com',
    telefone: '+55 (44) 9 9999-9999',
    dataNascimento: '07/03/2006',
    cidade: 'Maringá, PR',
  );

  UserModel get user => _userMock;

  void atualizarCampo(String campo, String valor) {
    switch (campo) {
      case 'nome':
        _userMock.nome = valor;
        break;
      case 'nomeUsuario':
        _userMock.nomeUsuario = valor;
        break;
      case 'bio':
        _userMock.bio = valor;
        break;
      case 'interesses':
        _userMock.interesses = valor;
        break;
      case 'email':
        _userMock.email = valor;
        break;
      case 'telefone':
        _userMock.telefone = valor;
        break;
      case 'dataNascimento':
        _userMock.dataNascimento = valor;
        break;
      case 'cidade':
        _userMock.cidade = valor;
        break;
    }
    notifyListeners();
  }
}