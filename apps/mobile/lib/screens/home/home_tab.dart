import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/screens/places/hot_places_screen.dart';
import 'package:mobile/utils/colors.dart';

class HomeTab extends StatelessWidget {
  const HomeTab({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 3,
      initialIndex: 0,
      child: Scaffold(
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
            'assets/img/tipografia.png',
            height: 20,
            fit: BoxFit.contain,
          ),
          centerTitle: true,
          bottom: TabBar(
            unselectedLabelColor: Colors.white54,
            labelColor: Color(colorAmbar),
            dividerColor: Colors.transparent,
            indicatorColor: Color(colorAmbar),
            labelPadding: const EdgeInsets.all(10),
            labelStyle: GoogleFonts.inter(
              fontSize: 16,
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
          children: [
            Center(
              child: Text("Feed", style: TextStyle(color: Colors.white)),
            ),
            Center(
              child: Text("Destaques", style: TextStyle(color: Colors.white)),
            ),
            HotPlacesScreen(),
          ],
        ),
      ),
    );
  }
}
