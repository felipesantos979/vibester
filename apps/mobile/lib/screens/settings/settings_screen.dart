import 'dart:io';

import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/screens/settings/account_management_settings_screen.dart';
import 'package:mobile/screens/settings/personal_information_settings_screen.dart';
import 'package:mobile/utils/colors.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  final Color _color = Color(colorDarkGrey);
  bool modoFantasma = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Configurações',
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
              margin: EdgeInsets.only(left: 30),
              child: Row(
                children: [
                  Text(
                    "CONTA",
                    style: GoogleFonts.inter(
                      color: Colors.white70,
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
              height: 190,
              padding: EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: _color,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: Colors.white38, width: 1),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  //Infos
                  InkWell(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) =>
                              PersonalInformationSettingsScreen(),
                        ),
                      );
                    },
                    child: Row(
                      children: [
                        Icon(Icons.person, color: Colors.white54),
                        SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            "Informações Pessoais",
                            style: GoogleFonts.inter(
                              color: Colors.white,
                              fontSize: 18,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                        Icon(Icons.arrow_forward_ios, color: Colors.white),
                      ],
                    ),
                  ),
                  Container(
                    margin: EdgeInsets.only(left: 30, right: 5),
                    color: Colors.white38,
                    width: double.infinity,
                    height: 1,
                  ),

                  //Seguranca
                  InkWell(
                    onTap: () {},
                    child: Row(
                      children: [
                        Icon(Icons.security_outlined, color: Colors.white54),
                        SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            "Segurança",
                            style: GoogleFonts.inter(
                              color: Colors.white,
                              fontSize: 18,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                        Icon(Icons.arrow_forward_ios, color: Colors.white),
                      ],
                    ),
                  ),
                  Container(
                    margin: EdgeInsets.only(left: 30, right: 5),
                    color: Colors.white38,
                    width: double.infinity,
                    height: 1,
                  ),

                  //Gerenciar
                  InkWell(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) =>
                              AccountManagementSettingsScreen(),
                        ),
                      );
                    },
                    child: Row(
                      children: [
                        Icon(Icons.settings_outlined, color: Colors.white54),
                        SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            "Gerenciamento de Conta",
                            style: GoogleFonts.inter(
                              color: Colors.white,
                              fontSize: 18,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                        Icon(Icons.arrow_forward_ios, color: Colors.white),
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
                    "PRIVACIDADE",
                    style: GoogleFonts.inter(
                      color: Colors.white70,
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
              height: Platform.isIOS ? 230 : 180,
              padding: EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: _color,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: Colors.white38, width: 1),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  //Permição
                  InkWell(
                    onTap: () {},
                    child: Row(
                      children: [
                        Icon(Icons.location_on_outlined, color: Colors.white54),
                        SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            "Permissões de Localização",
                            style: GoogleFonts.inter(
                              color: Colors.white,
                              fontSize: 19,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                        Icon(Icons.arrow_forward_ios, color: Colors.white),
                      ],
                    ),
                  ),
                  Container(
                    margin: EdgeInsets.only(left: 30, right: 5),
                    color: Colors.white38,
                    width: double.infinity,
                    height: 1,
                  ),

                  //Fantasma
                  Row(
                    children: [
                      FaIcon(FontAwesomeIcons.ghost, color: Colors.white54),
                      SizedBox(width: 15),
                      Expanded(
                        child: Text(
                          "Ghost Vibe",
                          style: GoogleFonts.inter(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                      Switch(
                        value: modoFantasma,
                        onChanged: (value) {
                          setState(() {
                            modoFantasma = value;
                          });
                        },
                        activeColor: Color(colorBrasa),
                      ),
                    ],
                  ),
                  Container(
                    margin: EdgeInsets.only(left: 30, right: 5),
                    color: Colors.white38,
                    width: double.infinity,
                    height: 1,
                  ),

                  //Gerenciar
                  InkWell(
                    onTap: () {},
                    child: Row(
                      children: [
                        Icon(Icons.visibility_outlined, color: Colors.white60),
                        SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            "Visualizar Vibe Checks",
                            style: GoogleFonts.inter(
                              color: Colors.white,
                              fontSize: 18,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                        Icon(Icons.arrow_forward_ios, color: Colors.white),
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
                    "NOTIFICAÇÕES",
                    style: GoogleFonts.inter(
                      color: Colors.white70,
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
              height: 190,
              padding: EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: _color,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: Colors.white38, width: 1),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  //Friends in the area, fds
                  InkWell(
                    onTap: () {},
                    child: Row(
                      children: [
                        Icon(
                          Icons.notifications_outlined,
                          color: Colors.white54,
                        ),
                        SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            "Amigos na Área",
                            style: GoogleFonts.inter(
                              color: Colors.white,
                              fontSize: 18,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                        Icon(Icons.arrow_forward_ios, color: Colors.white),
                      ],
                    ),
                  ),
                  Container(
                    margin: EdgeInsets.only(left: 30, right: 5),
                    color: Colors.white38,
                    width: double.infinity,
                    height: 1,
                  ),

                  //Eventos
                  InkWell(
                    onTap: () {},
                    child: Row(
                      children: [
                        Icon(
                          Icons.calendar_today_outlined,
                          color: Colors.white54,
                        ),
                        SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            "Atualizações de Eventos",
                            style: GoogleFonts.inter(
                              color: Colors.white,
                              fontSize: 18,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                        Icon(Icons.arrow_forward_ios, color: Colors.white),
                      ],
                    ),
                  ),
                  Container(
                    margin: EdgeInsets.only(left: 30, right: 5),
                    color: Colors.white38,
                    width: double.infinity,
                    height: 1,
                  ),

                  //Parceria
                  InkWell(
                    onTap: () {},
                    child: Row(
                      children: [
                        Icon(
                          Icons.confirmation_number_outlined,
                          color: Colors.white54,
                        ),
                        SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            "Promoções e Parcerias",
                            style: GoogleFonts.inter(
                              color: Colors.white,
                              fontSize: 18,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                        Icon(Icons.arrow_forward_ios, color: Colors.white),
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
                    "AJUDA",
                    style: GoogleFonts.inter(
                      color: Colors.white70,
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
              height: 190,
              padding: EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: _color,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: Colors.white38, width: 1),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  //Ajuda
                  InkWell(
                    onTap: () {},
                    child: Row(
                      children: [
                        Icon(Icons.help_outline, color: Colors.white54),
                        SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            "Central de Ajuda",
                            style: GoogleFonts.inter(
                              color: Colors.white,
                              fontSize: 18,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                        Icon(Icons.arrow_forward_ios, color: Colors.white),
                      ],
                    ),
                  ),
                  Container(
                    margin: EdgeInsets.only(left: 30, right: 5),
                    color: Colors.white38,
                    width: double.infinity,
                    height: 1,
                  ),

                  //Add amigo
                  InkWell(
                    onTap: () {},
                    child: Row(
                      children: [
                        Icon(Icons.group_outlined, color: Colors.white54),
                        SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            "Convidar um Amigo",
                            style: GoogleFonts.inter(
                              color: Colors.white,
                              fontSize: 18,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                        Icon(Icons.arrow_forward_ios, color: Colors.white),
                      ],
                    ),
                  ),
                  Container(
                    margin: EdgeInsets.only(left: 30, right: 5),
                    color: Colors.white38,
                    width: double.infinity,
                    height: 1,
                  ),

                  //Termos
                  InkWell(
                    onTap: () {},
                    child: Row(
                      children: [
                        Icon(Icons.description_outlined, color: Colors.white54),
                        SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            "Termos e Política",
                            style: GoogleFonts.inter(
                              color: Colors.white,
                              fontSize: 18,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                        Icon(Icons.arrow_forward_ios, color: Colors.white),
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
