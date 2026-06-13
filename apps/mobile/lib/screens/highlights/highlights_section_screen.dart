import 'dart:async';

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/models/event/event_model.dart';
import 'package:mobile/models/place/exclusive_offers_model.dart';
import 'package:mobile/providers/events/events_list_provider.dart';
import 'package:mobile/screens/highlights/category_highlights_section.dart';
import 'package:mobile/utils/colors.dart';
import 'package:mobile/widgets/cards/highlights/close_to_you.dart';
import 'package:mobile/widgets/cards/highlights/exclusive_offers.dart';
import 'package:mobile/widgets/cards/event/featured_events.dart';
import 'package:mobile/widgets/cards/event/weekly_events.dart';
import 'package:mobile/widgets/indicators/lineup_place_indicator.dart';
import 'package:provider/provider.dart';

class HighlightsSectionScreen extends StatefulWidget {
  const HighlightsSectionScreen({super.key});

  @override
  State<HighlightsSectionScreen> createState() =>
      _HighlightsSectionScreenState();
}

class _HighlightsSectionScreenState extends State<HighlightsSectionScreen> {
  late PageController _pageController;
  late Timer _timer;
  int _currentPage = 0;

  @override
  void initState() {
    super.initState();
    _pageController = PageController(viewportFraction: 0.95);
    List<EventModel> event = context.read<EventsListProvider>().events;
    _timer = Timer.periodic(const Duration(seconds: 4), (_) {
      _currentPage = (_currentPage + 1) % event.length;
      _pageController.animateToPage(
        _currentPage,
        duration: const Duration(milliseconds: 700),
        curve: Curves.easeInOut,
      );
    });
  }

  @override
  void dispose() {
    _timer.cancel();
    _pageController.dispose();
    super.dispose();
  }

  List<ExclusiveOffersModel> get offers => [
    ExclusiveOffersModel(
      lugar: "Firula Bar",
      desconto: 15,
      condicao: "Novos Clientes",
    ),
    ExclusiveOffersModel(
      lugar: "Firula Bar",
      desconto: 15,
      condicao: "Novos Clientes",
    ),
    ExclusiveOffersModel(
      lugar: "Firula Bar",
      desconto: 15,
      condicao: "Novos Clientes",
    ),
    ExclusiveOffersModel(
      lugar: "Firula Bar",
      desconto: 15,
      condicao: "Novos Clientes",
    ),
    ExclusiveOffersModel(
      lugar: "Firula Bar",
      desconto: 15,
      condicao: "Novos Clientes",
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final List<EventModel> event = context.watch<EventsListProvider>().events;
    return Scaffold(
      backgroundColor: Color(colorNoturno),
      body: ListView(
        children: [
          // Carrossel de eventos
          Padding(
            padding: const EdgeInsets.only(top: 20),
            child: SizedBox(
              height: 270,
              child: PageView.builder(
                padEnds: false,
                controller: PageController(viewportFraction: 0.95),
                itemCount: event.length,
                itemBuilder: (context, index) {
                  return FeaturedEvents(event: event[index]);
                },
              ),
            ),
          ),

          const SizedBox(height: 20),

          Column(
            children: [
              Padding(
                padding: EdgeInsets.symmetric(horizontal: 20),
                child: Column(
                  children: [
                    Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        "Categorias",
                        style: GoogleFonts.inter(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 22,
                        ),
                      ),
                    ),
                    SizedBox(height: 20),
                    CategoryHighlightsSection(),
                    SizedBox(height: 30),

                    Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        "Descubra",
                        style: GoogleFonts.inter(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 22,
                        ),
                      ),
                    ),

                    //Lista de line-ups
                    const SizedBox(height: 30),
                    LineupPlaceIndicator(),
                    const SizedBox(height: 10),

                    Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        "Eventos da Semana",
                        style: GoogleFonts.inter(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 22,
                        ),
                      ),
                    ),

                    Padding(
                      padding: const EdgeInsets.only(top: 20),
                      child: SizedBox(
                        height: 270,
                        child: PageView.builder(
                          padEnds: false,
                          controller: _pageController,
                          onPageChanged: (index) =>
                              setState(() => _currentPage = index),
                          itemCount: event.length,
                          itemBuilder: (context, index) {
                            return WeeklyEvents(evento: event[index]);
                          },
                        ),
                      ),
                    ),

                    const SizedBox(height: 40),

                    Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        "Ofertas Exclusivas",
                        style: GoogleFonts.inter(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 22,
                        ),
                      ),
                    ),

                    const SizedBox(height: 20),
                    SizedBox(
                      height: 150,
                      child: PageView.builder(
                        padEnds: false,
                        controller: PageController(viewportFraction: 0.95),
                        itemCount: offers.length,
                        itemBuilder: (context, index) {
                          return Padding(
                            padding: EdgeInsets.symmetric(horizontal: 8),
                            child: ExclusiveOffers(offer: offers[index]),
                          );
                        },
                      ),
                    ),
                    const SizedBox(height: 30),

                    Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        "Perto de Você",
                        style: GoogleFonts.inter(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 22,
                        ),
                      ),
                    ),

                    const SizedBox(height: 20),
                    CloseToYou(),
                    const SizedBox(height: 10),
                  ],
                ),
              ),
            ],
          ),
          // Resto da tela
        ],
      ),
    );
  }
}
