import 'package:flutter/material.dart';
import 'package:mobile/utils/colors.dart';

class PersonalInformationSettingsScreen extends StatefulWidget {
  const PersonalInformationSettingsScreen({super.key});

  @override
  State<PersonalInformationSettingsScreen> createState() =>
      _PersonalInformationSettingsScreenState();
}

class _PersonalInformationSettingsScreenState
    extends State<PersonalInformationSettingsScreen> {
  String nome = "Victor Marchi";
  String nomeUsuario = "Nego.Doce";
  String bio = "fouder of viberter.";
  String interesses = "O caba gosta de codar";
  String email = "victor.marchi@gmail.com";
  String telefone = "+55 (44) 9 9999-9999";
  String dataNascimento = "07/03/2006";
  String cidade = "Maringa, pr";

  void _editarCampo(String titulo, String valorAtual, Function(String) onSalvar) {
    final controller = TextEditingController(text: valorAtual);
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: Color(colorNoturno),
        title: Text(titulo, style: TextStyle(color: Colors.white)),
        content: TextField(
          controller: controller,
          autofocus: true,
          style: TextStyle(color: Colors.white),
          cursorColor: Color(colorAmbar),
          decoration: InputDecoration(
            enabledBorder: UnderlineInputBorder(
              borderSide: BorderSide(color: Colors.white38),
            ),
            focusedBorder: UnderlineInputBorder(
              borderSide: BorderSide(color: Color(colorAmbar)),
            ),
          ),
          onSubmitted: (value) {
            onSalvar(value);
            Navigator.pop(context);
          },
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final Color _color = Color.fromARGB(255, 30, 32, 33);

    return Scaffold(
      backgroundColor: Color(colorNoturno),
      body: SingleChildScrollView(
        child: Column(
          children: [
            Container(
              margin: const EdgeInsets.only(top: 60, left: 16, right: 16),
              child: Stack(
                children: [
                  Align(
                    alignment: Alignment.centerLeft,
                    child: Container(
                      height: 40,
                      width: 40,
                      padding: EdgeInsets.all(0),
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: Color(colorNoturno),
                      ),
                      child: IconButton(
                        onPressed: () {
                          Navigator.pop(context);
                        },
                        splashColor: Colors.transparent,
                        highlightColor: Colors.transparent,
                        icon: Icon(
                          Icons.arrow_back_ios_new,
                          color: Color(colorBrasa),
                        ),
                      ),
                    ),
                  ),
                  Align(
                    alignment: Alignment.center,
                    child: Text(
                      "Informações Pessoais",
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 26,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
            ),

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
                  Container(
                    width: 140,
                    height: 140,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(color: Color(colorNoturno), width: 7),
                    ),
                    child: ClipOval(
                      child: Image.network(
                        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCNBLmnNWfkgI83S1NuVF2k6dMjISlhRVMKQ&s',
                      ),
                    ),
                  ),
                  SizedBox(height: 10),
                  Text(
                    nome,
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
                    style: TextStyle(
                      color: Colors.white54,
                      fontSize: 20,
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
              height: 270,
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
                    onTap: () => _editarCampo("Nome", nome, (valor) {
                      setState(() => nome = valor);
                    }),
                    child: Row(
                      children: [
                        SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text("NOME", style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                              SizedBox(height: 2),
                              Text(nome, maxLines: 1, overflow: TextOverflow.ellipsis, style: TextStyle(color: Colors.white60, fontSize: 15, fontWeight: FontWeight.bold)),
                            ],
                          ),
                        ),
                        Icon(Icons.edit_outlined, color: Colors.white38, size: 18),
                        SizedBox(width: 5),
                      ],
                    ),
                  ),
                  Container(margin: EdgeInsets.only(left: 5, right: 5), color: Colors.white38, width: double.infinity, height: 1),
                  GestureDetector(
                    onTap: () => _editarCampo("Nome de Usuário", nomeUsuario, (valor) {
                      setState(() => nomeUsuario = valor);
                    }),
                    child: Row(
                      children: [
                        SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text("NOME DE USUÁRIO", style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                              SizedBox(height: 2),
                              Text(nomeUsuario, maxLines: 1, overflow: TextOverflow.ellipsis, style: TextStyle(color: Colors.white60, fontSize: 15, fontWeight: FontWeight.bold)),
                            ],
                          ),
                        ),
                        Icon(Icons.edit_outlined, color: Colors.white38, size: 18),
                        SizedBox(width: 5),
                      ],
                    ),
                  ),
                  Container(margin: EdgeInsets.only(left: 5, right: 5), color: Colors.white38, width: double.infinity, height: 1),
                  GestureDetector(
                    onTap: () => _editarCampo("Bio", bio, (valor) {
                      setState(() => bio = valor);
                    }),
                    child: Row(
                      children: [
                        SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text("BIO", style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                              SizedBox(height: 2),
                              Text(bio, maxLines: 1, overflow: TextOverflow.ellipsis, style: TextStyle(color: Colors.white60, fontSize: 15, fontWeight: FontWeight.bold)),
                            ],
                          ),
                        ),
                        Icon(Icons.edit_outlined, color: Colors.white38, size: 18),
                        SizedBox(width: 5),
                      ],
                    ),
                  ),
                  Container(margin: EdgeInsets.only(left: 5, right: 5), color: Colors.white38, width: double.infinity, height: 1),
                  GestureDetector(
                    onTap: () => _editarCampo("Interesses", interesses, (valor) {
                      setState(() => interesses = valor);
                    }),
                    child: Row(
                      children: [
                        SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text("INTERESSES", style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                              SizedBox(height: 2),
                              Text(interesses, maxLines: 1, overflow: TextOverflow.ellipsis, style: TextStyle(color: Colors.white60, fontSize: 15, fontWeight: FontWeight.bold)),
                            ],
                          ),
                        ),
                        Icon(Icons.edit_outlined, color: Colors.white38, size: 18),
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
                    style: TextStyle(
                      color: Colors.white54,
                      fontSize: 20,
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
              height: 270,
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
                    onTap: () => _editarCampo("E-mail", email, (valor) {
                      setState(() => email = valor);
                    }),
                    child: Row(
                      children: [
                        SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text("E-MAIL", style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                              SizedBox(height: 2),
                              Text(email, maxLines: 1, overflow: TextOverflow.ellipsis, style: TextStyle(color: Colors.white60, fontSize: 15, fontWeight: FontWeight.bold)),
                            ],
                          ),
                        ),
                        Icon(Icons.edit_outlined, color: Colors.white38, size: 18),
                        SizedBox(width: 5),
                      ],
                    ),
                  ),
                  Container(margin: EdgeInsets.only(left: 5, right: 5), color: Colors.white38, width: double.infinity, height: 1),
                  GestureDetector(
                    onTap: () => _editarCampo("Telefone", telefone, (valor) {
                      setState(() => telefone = valor);
                    }),
                    child: Row(
                      children: [
                        SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text("TELEFONE", style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                              SizedBox(height: 2),
                              Text(telefone, maxLines: 1, overflow: TextOverflow.ellipsis, style: TextStyle(color: Colors.white60, fontSize: 15, fontWeight: FontWeight.bold)),
                            ],
                          ),
                        ),
                        Icon(Icons.edit_outlined, color: Colors.white38, size: 18),
                        SizedBox(width: 5),
                      ],
                    ),
                  ),
                  Container(margin: EdgeInsets.only(left: 5, right: 5), color: Colors.white38, width: double.infinity, height: 1),
                  GestureDetector(
                    onTap: () => _editarCampo("Data de Nascimento", dataNascimento, (valor) {
                      setState(() => dataNascimento = valor);
                    }),
                    child: Row(
                      children: [
                        SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text("DATA DE NASCIMENTO", style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                              SizedBox(height: 2),
                              Text(dataNascimento, maxLines: 1, overflow: TextOverflow.ellipsis, style: TextStyle(color: Colors.white60, fontSize: 15, fontWeight: FontWeight.bold)),
                            ],
                          ),
                        ),
                        Icon(Icons.edit_outlined, color: Colors.white38, size: 18),
                        SizedBox(width: 5),
                      ],
                    ),
                  ),
                  Container(margin: EdgeInsets.only(left: 5, right: 5), color: Colors.white38, width: double.infinity, height: 1),
                  GestureDetector(
                    onTap: () => _editarCampo("Cidade", cidade, (valor) {
                      setState(() => cidade = valor);
                    }),
                    child: Row(
                      children: [
                        SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text("CIDADE", style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                              SizedBox(height: 2),
                              Text(cidade, maxLines: 1, overflow: TextOverflow.ellipsis, style: TextStyle(color: Colors.white60, fontSize: 15, fontWeight: FontWeight.bold)),
                            ],
                          ),
                        ),
                        Icon(Icons.edit_outlined, color: Colors.white38, size: 18),
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