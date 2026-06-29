import 'package:mobile/providers/user/user_provider.dart';
import 'package:provider/provider.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/models/user/user_model.dart';
import 'package:mobile/service/user/user_service.dart';
import 'package:mobile/utils/colors.dart';
import 'package:mobile/widgets/cards/users/editing_avatar.dart';

class PersonalInformationSettingsScreen extends StatefulWidget {
  const PersonalInformationSettingsScreen({super.key});

  @override
  State<PersonalInformationSettingsScreen> createState() =>
      _PersonalInformationSettingsScreenState();
}

class _PersonalInformationSettingsScreenState
    extends State<PersonalInformationSettingsScreen> {
  final _userService = UserService();

  // Repopula o provider com o resultado da API, preservando o token
  void _atualizarProviderComResposta(Map<String, dynamic> response) {
    final tokenAtual = context.read<UserProvider>().user?.token;
    final accountId = context.read<UserProvider>().user?.accountId ?? '';

    final usuarioAtualizado = UserModel.fromProfileJson(
      response,
      accountId: accountId,
      token: tokenAtual,
    );

    context.read<UserProvider>().setUser(usuarioAtualizado);
  }

  void _mostrarErro(String mensagem) {
    if (!mounted) return;
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text(mensagem)));
  }

  Future<void> _salvarNome(String novoNome) async {
    final user = context.read<UserProvider>().user;
    final accountId = user?.accountId ?? '';

    try {
      final response = await _userService.updateName(
        accountId: accountId,
        name: novoNome,
        username: user?.nomeUsuario ?? '',
      );
      if (!mounted) return;
      _atualizarProviderComResposta(response);
    } catch (e) {
      _mostrarErro(e.toString().replaceFirst('Exception: ', ''));
    }
  }

  Future<void> _salvarUsername(String novoUsername) async {
    final user = context.read<UserProvider>().user;
    final accountId = user?.accountId ?? '';

    // Normaliza: sem espaços, e sempre começando com @.
    var usernameFormatado = novoUsername.replaceAll(' ', '');
    if (!usernameFormatado.startsWith('@')) {
      usernameFormatado = '@$usernameFormatado';
    }

    try {
      final response = await _userService.updateName(
        accountId: accountId,
        name: user?.nome ?? '',
        username: usernameFormatado,
      );
      if (!mounted) return;
      _atualizarProviderComResposta(response);
    } catch (e) {
      _mostrarErro(e.toString().replaceFirst('Exception: ', ''));
    }
  }

  Future<void> _salvarBio(String novaBio) async {
    final user = context.read<UserProvider>().user;
    final accountId = user?.accountId ?? '';

    try {
      final response = await _userService.updateBio(
        accountId: accountId,
        bio: novaBio,
      );
      if (!mounted) return;
      _atualizarProviderComResposta(response);
    } catch (e) {
      _mostrarErro(e.toString().replaceFirst('Exception: ', ''));
    }
  }

  void _editarCampo(
    String titulo,
    String valorAtual,
    Function(String) onSalvar, {
    int? maxCaracteres, // ← parâmetro opcional
  }) {
    final controller = TextEditingController(text: valorAtual);
    final focusNode = FocusNode();
    showDialog(
      context: context,
      builder: (context) => Dialog(
        backgroundColor: Colors.transparent,
        child: Container(
          decoration: BoxDecoration(
            color: Color(colorDarkGrey).withAlpha(230),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // cabeçalho com cor diferente
              Container(
                width: double.infinity,
                padding: EdgeInsets.symmetric(vertical: 16),
                decoration: BoxDecoration(
                  color: Color(colorNavy).withAlpha(230),
                  borderRadius: BorderRadius.only(
                    topLeft: Radius.circular(16),
                    topRight: Radius.circular(16),
                  ),
                ),
                child: Text(
                  'Alterar $titulo',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),

              // corpo com o campo
              Padding(
                padding: EdgeInsets.symmetric(horizontal: 24, vertical: 20),
                child: TextField(
                  controller: controller,
                  focusNode: focusNode,
                  autofocus: true,
                  maxLength: maxCaracteres,
                  style: TextStyle(color: Colors.white),
                  cursorColor: Color(colorAmbar),
                  decoration: InputDecoration(
                    enabledBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: Colors.white38),
                    ),
                    focusedBorder: UnderlineInputBorder(
                      borderSide: BorderSide(color: Color(colorAmbar)),
                    ),
                    counterStyle: TextStyle(color: Colors.white38),
                  ),
                ),
              ),

              // botões
              Padding(
                padding: EdgeInsets.only(bottom: 12),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    TextButton(
                      onPressed: () {
                        focusNode.unfocus();
                        onSalvar(controller.text);
                        Navigator.pop(context);
                      },
                      style: TextButton.styleFrom(
                        backgroundColor: Colors.green,
                        foregroundColor: Colors.white,
                        padding: EdgeInsets.symmetric(
                          horizontal: 24,
                          vertical: 12,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                      child: Text(
                        'Confirmar',
                        style: GoogleFonts.inter(fontWeight: FontWeight.bold),
                      ),
                    ),
                    SizedBox(width: 16),
                    TextButton(
                      onPressed: () {
                        focusNode.unfocus();
                        Navigator.pop(context);
                      },
                      style: TextButton.styleFrom(
                        backgroundColor: Colors.redAccent,
                        foregroundColor: Colors.white,
                        padding: EdgeInsets.symmetric(
                          horizontal: 24,
                          vertical: 12,
                        ),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                      child: Text(
                        'Cancelar',
                        style: GoogleFonts.inter(fontWeight: FontWeight.bold),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final user = context.watch<UserProvider>().user;

    if (user == null) {
      return Scaffold(
        backgroundColor: Color(colorNoturno),
        appBar: AppBar(
          title: Text('Informações pessoais'),
          backgroundColor: Color(colorNoturno),
          foregroundColor: Colors.white,
        ),
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    final Color _color = Color(colorDarkGrey);

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Informações pessoais',
          style: GoogleFonts.inter(fontWeight: FontWeight.bold),
        ),
        backgroundColor: Color(colorNoturno),
        foregroundColor: Colors.white,
      ),
      backgroundColor: Color(colorNoturno),
      body: SingleChildScrollView(
        child: Column(
          children: [
            SizedBox(height: 30),

            Container(
              margin: EdgeInsets.only(left: 16, right: 16),
              width: double.infinity,
              height: 240,
              padding: EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: _color,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: Colors.white38, width: 1),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  SizedBox(height: 4),
                  EditableAvatar(
                    radius: 64,
                    imageUrl:
                        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCNBLmnNWfkgI83S1NuVF2k6dMjISlhRVMKQ&s',
                  ),
                  Text(
                    user.nome,
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 5),
                ],
              ),
            ),

            SizedBox(height: 30),

            Container(
              margin: EdgeInsets.only(left: 30),
              child: Row(
                children: [
                  Text(
                    "DADOS",
                    style: GoogleFonts.inter(
                      color: Colors.white54,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),

            SizedBox(height: 10),

            Container(
              margin: EdgeInsets.only(left: 16, right: 16),
              width: double.infinity,
              height: 320,
              padding: EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: _color,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: Colors.white38, width: 1),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  GestureDetector(
                    onTap: () => _editarCampo("Nome", user.nome, (valor) {
                      _salvarNome(valor);
                    }, maxCaracteres: 30),
                    child: Row(
                      children: [
                        SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                "Nome",
                                style: GoogleFonts.inter(
                                  color: Colors.white,
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              SizedBox(height: 2),
                              Text(
                                user.nome,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: GoogleFonts.inter(
                                  color: Colors.white60,
                                  fontSize: 15,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                          ),
                        ),
                        Icon(
                          Icons.edit_outlined,
                          color: Colors.white38,
                          size: 18,
                        ),
                        SizedBox(width: 5),
                      ],
                    ),
                  ),
                  Container(
                    margin: EdgeInsets.only(left: 5, right: 5),
                    color: Colors.white38,
                    width: double.infinity,
                    height: 1,
                  ),
                  SizedBox(height: 12),
                  GestureDetector(
                    onTap: () => _editarCampo(
                      "Nome de Usuário",
                      user.nomeUsuario,
                      (valor) {
                        _salvarUsername(valor);
                      },
                      maxCaracteres: 30,
                    ),
                    child: Row(
                      children: [
                        SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                "Nome de usuário",
                                style: GoogleFonts.inter(
                                  color: Colors.white,
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              SizedBox(height: 2),
                              Text(
                                user.nomeUsuario,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: GoogleFonts.inter(
                                  color: Colors.white60,
                                  fontSize: 15,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                          ),
                        ),
                        Icon(
                          Icons.edit_outlined,
                          color: Colors.white38,
                          size: 18,
                        ),
                        SizedBox(width: 5),
                      ],
                    ),
                  ),
                  Container(
                    margin: EdgeInsets.only(left: 5, right: 5),
                    color: Colors.white38,
                    width: double.infinity,
                    height: 1,
                  ),
                  SizedBox(height: 12),
                  GestureDetector(
                    onTap: () => _editarCampo("Bio", user.bio, (valor) {
                      _salvarBio(valor);
                    }, maxCaracteres: 150,),
                    child: Row(
                      children: [
                        SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                "Bio",
                                style: GoogleFonts.inter(
                                  color: Colors.white,
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              SizedBox(height: 2),
                              Text(
                                user.bio,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: GoogleFonts.inter(
                                  color: Colors.white60,
                                  fontSize: 15,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                          ),
                        ),
                        Icon(
                          Icons.edit_outlined,
                          color: Colors.white38,
                          size: 18,
                        ),
                        SizedBox(width: 5),
                      ],
                    ),
                  ),
                  Container(
                    margin: EdgeInsets.only(left: 5, right: 5),
                    color: Colors.white38,
                    width: double.infinity,
                    height: 1,
                  ),
                  SizedBox(height: 12),
                  GestureDetector(
                    onTap: () =>
                        _editarCampo("Interesses", user.interesses, (valor) {
                          context.read<UserProvider>().atualizarCampo(
                            'interesses',
                            valor,
                          );
                        }),
                    child: Row(
                      children: [
                        SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                "Interesses",
                                style: GoogleFonts.inter(
                                  color: Colors.white,
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              SizedBox(height: 2),
                              Text(
                                user.interesses,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: TextStyle(
                                  color: Colors.white60,
                                  fontSize: 15,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        ),
                        Icon(
                          Icons.edit_outlined,
                          color: Colors.white38,
                          size: 18,
                        ),
                        SizedBox(width: 5),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            SizedBox(height: 30),

            Container(
              margin: EdgeInsets.only(left: 30),
              child: Row(
                children: [
                  Text(
                    "INFORMAÇÕES DA CONTA",
                    style: GoogleFonts.inter(
                      color: Colors.white54,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),

            SizedBox(height: 10),

            Container(
              margin: EdgeInsets.only(left: 16, right: 16),
              width: double.infinity,
              height: 320,
              padding: EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: _color,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: Colors.white38, width: 1),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  GestureDetector(
                    onTap: () => _editarCampo("E-mail", user.email, (valor) {
                      context.read<UserProvider>().atualizarCampo(
                        'email',
                        valor,
                      );
                    }),
                    child: Row(
                      children: [
                        SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                "E-mail",
                                style: GoogleFonts.inter(
                                  color: Colors.white,
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              SizedBox(height: 2),
                              Text(
                                user.email,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: GoogleFonts.inter(
                                  color: Colors.white60,
                                  fontSize: 15,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                          ),
                        ),
                        Icon(
                          Icons.edit_outlined,
                          color: Colors.white38,
                          size: 18,
                        ),
                        SizedBox(width: 5),
                      ],
                    ),
                  ),
                  Container(
                    margin: EdgeInsets.only(left: 5, right: 5),
                    color: Colors.white38,
                    width: double.infinity,
                    height: 1,
                  ),
                  GestureDetector(
                    onTap: () =>
                        _editarCampo("Telefone", user.telefone, (valor) {
                          context.read<UserProvider>().atualizarCampo(
                            'telefone',
                            valor,
                          );
                        }),
                    child: Row(
                      children: [
                        SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                "Telefone",
                                style: GoogleFonts.inter(
                                  color: Colors.white,
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              SizedBox(height: 2),
                              Text(
                                user.telefone,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: GoogleFonts.inter(
                                  color: Colors.white60,
                                  fontSize: 15,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                          ),
                        ),
                        Icon(
                          Icons.edit_outlined,
                          color: Colors.white38,
                          size: 18,
                        ),
                        SizedBox(width: 5),
                      ],
                    ),
                  ),
                  Container(
                    margin: EdgeInsets.only(left: 5, right: 5),
                    color: Colors.white38,
                    width: double.infinity,
                    height: 1,
                  ),
                  GestureDetector(
                    onTap: () => _editarCampo(
                      "Data de Nascimento",
                      user.dataNascimento,
                      (valor) {
                        context.read<UserProvider>().atualizarCampo(
                          'dataNascimento',
                          valor,
                        );
                      },
                    ),
                    child: Row(
                      children: [
                        SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                "Data de nascimento",
                                style: GoogleFonts.inter(
                                  color: Colors.white,
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              SizedBox(height: 2),
                              Text(
                                user.dataNascimento,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: GoogleFonts.inter(
                                  color: Colors.white60,
                                  fontSize: 15,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                          ),
                        ),
                        Icon(
                          Icons.edit_outlined,
                          color: Colors.white38,
                          size: 18,
                        ),
                        SizedBox(width: 5),
                      ],
                    ),
                  ),
                  Container(
                    margin: EdgeInsets.only(left: 5, right: 5),
                    color: Colors.white38,
                    width: double.infinity,
                    height: 1,
                  ),
                  GestureDetector(
                    onTap: () => _editarCampo("Cidade", user.cidade, (valor) {
                      context.read<UserProvider>().atualizarCampo(
                        'cidade',
                        valor,
                      );
                    }),
                    child: Row(
                      children: [
                        SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                "Cidade",
                                style: GoogleFonts.inter(
                                  color: Colors.white,
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              SizedBox(height: 2),
                              Text(
                                user.cidade,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: GoogleFonts.inter(
                                  color: Colors.white60,
                                  fontSize: 15,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        ),
                        Icon(
                          Icons.edit_outlined,
                          color: Colors.white38,
                          size: 18,
                        ),
                        SizedBox(width: 5),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            SizedBox(height: 30),
          ],
        ),
      ),
    );
  }
}
