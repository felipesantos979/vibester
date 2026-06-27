import 'package:flutter/material.dart';
import 'package:mobile/models/user/user_model.dart';

class UserProvider extends ChangeNotifier {
  UserModel? _user;

  UserModel? get user => _user;

  void setUser(UserModel user) {
    _user = user;
    notifyListeners();
  }

  void atualizarCampo(String campo, String valor) {
    if (_user == null) return;

    switch (campo) {
      case 'nome':
        _user!.nome = valor;
        break;
      case 'nomeUsuario':
        _user!.nomeUsuario = valor;
        break;
      case 'bio':
        _user!.bio = valor;
        break;
      case 'interesses':
        _user!.interesses = valor;
        break;
      case 'email':
        _user!.email = valor;
        break;
      case 'telefone':
        _user!.telefone = valor;
        break;
      case 'dataNascimento':
        _user!.dataNascimento = valor;
        break;
      case 'cidade':
        _user!.cidade = valor;
        break;
    }
    notifyListeners();
  }

  void limpar() {
    _user = null;
    notifyListeners();
  }
}