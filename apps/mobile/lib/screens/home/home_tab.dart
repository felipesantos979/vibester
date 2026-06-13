import 'dart:io';

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/screens/feed/feed_screen.dart';
import 'package:mobile/screens/highlights/highlights_section_screen.dart';
import 'package:mobile/screens/places/hot_places_screen.dart';
import 'package:mobile/utils/colors.dart';

class HomeTab extends StatefulWidget {
  //serve só pra passar o valor atual da barra pra tela do feed
  final ValueNotifier<bool> navbarVisibleNotifier;
  final VoidCallback onTabChanged; // volta com a barra ao trocar de aba

  const HomeTab({
    super.key,
    required this.navbarVisibleNotifier,
    required this.onTabChanged,
  });

  @override
  State<HomeTab> createState() => _HomeTabState();
}

class _HomeTabState extends State<HomeTab> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    // Escuta qualquer troca de aba, serve para fazer a barra voltar ao trocar de aba
    _tabController.addListener(() {
      widget.onTabChanged();
    });
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(colorDarkGrey),
      appBar: AppBar(
        toolbarHeight: 45,
        automaticallyImplyLeading: false,
        backgroundColor: Color(colorNavy),
        foregroundColor: Color(colorAmbar),
        flexibleSpace: Container(
          decoration: BoxDecoration(
            color: Color(colorNavy),
            boxShadow: [
              BoxShadow(
                color: Colors.white.withOpacity(0.1),
                blurRadius: 8,
                offset: const Offset(0, 1),
              ),
            ],
          ),
        ),
        title: Image.asset(
          'assets/img/logo/tipografia.png',
          height: 20,
          fit: BoxFit.contain,
        ),
        centerTitle: true,
        bottom: TabBar(
          controller: _tabController,
          unselectedLabelColor: Colors.white54,
          labelColor: Color(colorAmbar),
          dividerColor: Colors.transparent,
          indicatorColor: Color(colorAmbar),
          labelPadding: const EdgeInsets.all(10),
          labelStyle: GoogleFonts.inter(
            fontSize: Platform.isIOS ? 14 : 16,
            fontWeight: FontWeight.bold,
          ),
          tabs: const <Widget>[
            Tab(text: 'FEED'),
            Tab(text: 'DESTAQUES'),
            Tab(text: 'EM ALTA'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          //Chama passando o estado da barra
          FeedScreen(navbarVisibleNotifier: widget.navbarVisibleNotifier),
          HighlightsSectionScreen(),
          HotPlacesScreen(),
        ],
      ),
    );
  }
}