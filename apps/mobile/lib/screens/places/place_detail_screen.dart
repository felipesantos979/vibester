import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/models/place/place_model.dart';
import 'package:mobile/providers/place/place_list_provider.dart';
import 'package:mobile/screens/events/event_list_screen.dart';
import 'package:mobile/screens/highlights/property_highlights_screen.dart';
import 'package:mobile/screens/places/place_reviews_screen.dart';
import 'package:mobile/utils/colors.dart';
import 'package:mobile/widgets/indicators/category_indicator.dart';
import 'package:mobile/utils/divider.dart';
import 'package:mobile/widgets/indicators/place_stats_bar.dart';
import 'package:mobile/widgets/buttons/primary_button.dart';
import 'package:provider/provider.dart';

class PlaceDetailScreen extends StatefulWidget {
  final PlaceModel place;

  const PlaceDetailScreen({super.key, required this.place});

  @override
  State<PlaceDetailScreen> createState() => _PlaceDetailScreenState();
}

class _PlaceDetailScreenState extends State<PlaceDetailScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<PlaceListProvider>(context);
    return Scaffold(
      backgroundColor: Color(colorNoturno),
      appBar: AppBar(
        title: Text(
          widget.place.nome,
          style: GoogleFonts.inter(fontWeight: FontWeight.bold),
        ),
        backgroundColor: Color(colorNoturno),
        foregroundColor: Colors.white,
      ),
      body: NestedScrollView(
        headerSliverBuilder: (context, innerBoxIsScrolled) => [
          SliverToBoxAdapter(
            child: Column(
              children: [
                Stack(
                  clipBehavior: Clip.none,
                  alignment: Alignment.bottomCenter,
                  children: [
                    SizedBox(
                      height: 250,
                      width: double.infinity,
                      child: Stack(
                        fit: StackFit.expand,
                        children: [
                          Image.network(
                            'https://media.gettyimages.com/id/1266107863/pt/foto/dj-playing-and-mixing-music-at-party.jpg?s=2048x2048&w=gi&k=20&c=Tmm9GWCaVF_gTB4becCcYTaNJEZepQG8VoxLAunIDKA=',
                            fit: BoxFit.cover,
                          ),

                          // Gradiente escurecendo para baixo
                          Container(
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                begin: Alignment.topCenter,
                                end: Alignment.bottomCenter,
                                colors: [
                                  Colors.transparent,
                                  Color(colorNoturno).withOpacity(0.3),
                                  Color(colorNoturno).withOpacity(0.7),
                                  Color(colorNoturno),
                                ],
                                stops: const [0.0, 0.4, 0.7, 1.0],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    Positioned(
                      bottom: -25,
                      child: SizedBox(
                        width: 100,
                        height: 100,
                        child: Container(
                          decoration: BoxDecoration(
                            boxShadow: [
                              BoxShadow(
                                color: Color(colorAmbar).withOpacity(0.6),
                                blurRadius: 10,
                                offset: const Offset(0, 1),
                                spreadRadius: 3,
                              ),
                            ],
                            borderRadius: BorderRadius.circular(50),
                          ),
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(50),
                            child: SizedBox(
                              height: 80,
                              width: 80,
                              child: Image.network(widget.place.profileImage),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 40),

                Text(
                  widget.place.nome.toUpperCase(),
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 28,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 10),

                CategoryIndicator(
                  categoria: widget.place.categoria.toUpperCase(),
                ),
                const SizedBox(height: 10),

                SizedBox(
                  width: 350,
                  child: Text(
                    widget.place.bio,
                    style: const TextStyle(color: Colors.white54),
                    textAlign: TextAlign.center,
                  ),
                ),
                const SizedBox(height: 10),

                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.location_on, color: Color(colorBrasa)),
                    Text(
                      widget.place.endereco,
                      style: TextStyle(color: Colors.grey.withAlpha(90)),
                    ),
                  ],
                ),
                PlaceStatsBar(
                  seguidores: '12k',
                  avaliacao: widget.place.avaliacao,
                ),
                PrimaryButton(
                  label: 'Seguir',
                  state: widget.place.isFavorite
                      ? ButtonState.success
                      : ButtonState.idle,
                  onPressed: () {
                    provider.toggleFavorite(widget.place.nome);
                  },
                ),
                const SizedBox(height: 20),
              ],
            ),
          ),
          SliverPersistentHeader(
            pinned: true,
            delegate: _StickyTabBarDelegate(
              TabBar(
                controller: _tabController,
                unselectedLabelColor: Colors.white54,
                labelColor: Colors.white,
                dividerColor: Colors.transparent,
                indicatorColor: Color(colorAmbar),
                indicatorPadding: EdgeInsetsGeometry.symmetric(
                  horizontal: 10,
                  vertical: 6,
                ),
                labelPadding: EdgeInsets.all(10),
                labelStyle: GoogleFonts.inter(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                ),
                tabs: [
                  Tab(text: 'DESTAQUES'),
                  Tab(text: 'EVENTOS'),
                  Tab(text: 'AVALIAÇÕES'),
                ],
              ),
              color: Color(colorNoturno),
            ),
          ),
        ],

        body: Column(
          children: [
            Padding(
              padding: EdgeInsets.symmetric(vertical: 3.0),
              child: MyDivider(height: 1, width: double.infinity),
            ),
            Expanded(
              child: TabBarView(
                controller: _tabController,
                children: [
                  PropertyHighlightsScreen(),
                  EventListScreen(),
                  PlaceReviewsScreen(place: widget.place),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _StickyTabBarDelegate extends SliverPersistentHeaderDelegate {
  final TabBar tabBar;
  final Color color;

  const _StickyTabBarDelegate(this.tabBar, {required this.color});

  @override
  double get minExtent => tabBar.preferredSize.height;

  @override
  double get maxExtent => tabBar.preferredSize.height;

  @override
  Widget build(
    BuildContext context,
    double shrinkOffset,
    bool overlapsContent,
  ) {
    return Container(color: color, child: tabBar);
  }

  @override
  bool shouldRebuild(_StickyTabBarDelegate oldDelegate) =>
      tabBar != oldDelegate.tabBar || color != oldDelegate.color;
}
