import 'dart:async';

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/models/event/event_model.dart';
import 'package:mobile/models/event/lineup_model.dart';
import 'package:mobile/models/place/exclusive_offers_model.dart';
import 'package:mobile/screens/highlights/category_highlights_section.dart';
import 'package:mobile/utils/colors.dart';
import 'package:mobile/widgets/cards/close_to_you.dart';
import 'package:mobile/widgets/cards/exclusive_offers.dart';
import 'package:mobile/widgets/cards/featured_events.dart';
import 'package:mobile/widgets/cards/weekly_events.dart';
import 'package:mobile/widgets/indicators/lineup_place_indicator.dart';

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

  static const String _foto =
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgpnQNClh0kA43xMUXgiu_GKAqIL97g2dMY80DJ4A15pnck6ZxZ6APvn2KKdSIxajG8RSdRq6mesWTCn0kIItn6tlCqAZkE8Nx-snm2TCW&s=10";

  List<EventModel> get event => [
    EventModel(
      dataDoEvento: DateTime(2026, 6, 10, 17, 0),
      titulo: "Noite do Sertanejo",
      lineUp: [LineupModel(nome: "Sonia Blade", url: _foto)],
      categoria: "Show",
      artistas: "Sonia blade",
      localizacao: "Paraná Expo - Maringá, PR",
      informacoes:
          "Classificação do evento: 16+\nMenores de 16 anos somente acompanhados dos pais ou responsáveis legais, mediante apresentação de documento oficial com foto.\nAcesso à área open bar restrito a maiores de 18 anos.\nProibida a venda de bebida alcoólica para menores de 18 anos (Lei Federal 13.106/16).\nDescumprimento da classificação indicativa pode impedir a entrada no evento sem direito a reembolso.",
    ),
    EventModel(
      dataDoEvento: DateTime(2026, 6, 10, 17, 0),
      titulo: "Noite do Sertanejo",
      lineUp: [LineupModel(nome: "Sonia Blade", url: _foto)],
      categoria: "Show",
      artistas: "Sonia blade",
      localizacao: "Paraná Expo - Maringá, PR",
      informacoes:
          "Classificação do evento: 16+\nMenores de 16 anos somente acompanhados dos pais ou responsáveis legais, mediante apresentação de documento oficial com foto.\nAcesso à área open bar restrito a maiores de 18 anos.\nProibida a venda de bebida alcoólica para menores de 18 anos (Lei Federal 13.106/16).\nDescumprimento da classificação indicativa pode impedir a entrada no evento sem direito a reembolso.",
    ),
    EventModel(
      dataDoEvento: DateTime(2026, 6, 10, 17, 0),
      titulo: "Noite do Sertanejo",
      lineUp: [LineupModel(nome: "Sonia Blade", url: _foto)],
      categoria: "Show",
      artistas: "Sonia blade",
      localizacao: "Paraná Expo - Maringá, PR",
      informacoes:
          "Classificação do evento: 16+\nMenores de 16 anos somente acompanhados dos pais ou responsáveis legais, mediante apresentação de documento oficial com foto.\nAcesso à área open bar restrito a maiores de 18 anos.\nProibida a venda de bebida alcoólica para menores de 18 anos (Lei Federal 13.106/16).\nDescumprimento da classificação indicativa pode impedir a entrada no evento sem direito a reembolso.",
    ),
  ];

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
    EventModel(
      dataDoEvento: DateTime(2026, 12, 31, 23, 0),
      titulo: "Réveillon do Solaaaaaaaaasdasdasdadsadasddd",
      lineUp: [LineupModel(nome: "Ivete Sangalo", url: _foto)],
      categoria: "Festa",
      artistas: "Ivete Sangalo",
      localizacao: "Praia de Copacabana - Rio de Janeiro, RJ",
      informacoes:
          "Classificação do evento: 16+\nMenores de 16 anos somente acompanhados dos pais ou responsáveis legais, mediante apresentação de documento oficial com foto.\nAcesso à área open bar restrito a maiores de 18 anos.\nProibida a venda de bebida alcoólica para menores de 18 anos (Lei Federal 13.106/16).\nDescumprimento da classificação indicativa pode impedir a entrada no evento sem direito a reembolso.",
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

                    const SizedBox(height: 10),

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
