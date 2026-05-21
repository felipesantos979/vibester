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
          toolbarHeight: 20,
          automaticallyImplyLeading: false,
          backgroundColor: Color(colorDarkGrey),
          foregroundColor: Color(colorAmbar),
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
