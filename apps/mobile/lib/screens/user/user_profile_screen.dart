import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/models/user/user_model.dart';
import 'package:mobile/screens/highlights/property_highlights_screen.dart';
import 'package:mobile/utils/colors.dart';
import 'package:mobile/utils/divider.dart';
import 'package:mobile/utils/editable_text_field.dart';
import 'package:mobile/widgets/cards/profile_avatar.dart';

class UserProfileScreen extends StatefulWidget {
  const UserProfileScreen({super.key});

  @override
  State<UserProfileScreen> createState() => _UserProfileScreenState();
}

class _UserProfileScreenState extends State<UserProfileScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  final userMock = UserModel(
    nome: 'Victor Marchi',
    nomeUsuario: '@vitin',
    bio: 'founder of vibester.',
    seguidores: 1302,
    seguindo: 32,
    eventosVisitados: 123,
    fotoPerfil:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCNBLmnNWfkgI83S1NuVF2k6dMjISlhRVMKQ&s',
  );

  bool _showAppBarAvatar = false;

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
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        backgroundColor: Color(colorNavy),
        scrolledUnderElevation: 0,
        surfaceTintColor: Colors.transparent,
        title: SizedBox(
          width: double.infinity,
          child: Stack(
            alignment: Alignment.center,
            children: [
              AnimatedOpacity(
                duration: Duration(milliseconds: 300),
                opacity: _showAppBarAvatar ? 1.0 : 0.0,
                child: AnimatedSlide(
                  duration: Duration(milliseconds: 300),
                  offset: _showAppBarAvatar ? Offset(-1.2, 0) : Offset(-1.2, 0),
                  child: CircleAvatar(
                    radius: 16,
                    backgroundImage: NetworkImage(userMock.fotoPerfil),
                  ),
                ),
              ),
              AnimatedSlide(
                duration: Duration(milliseconds: 300),
                offset: _showAppBarAvatar ? Offset(0.19, 0) : Offset(0, 0),
                child: Text(
                  userMock.nomeUsuario,
                  style: GoogleFonts.inter(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
              ),
            ],
          ),
        ),
        centerTitle: true,
      ),
      backgroundColor: Color(colorNoturno),
      body: NotificationListener<ScrollNotification>(
        onNotification: (notification) {
          if (notification.depth == 0 &&
              notification is ScrollUpdateNotification) {
            setState(() {
              _showAppBarAvatar = notification.metrics.pixels > 200;
            });
          }
          return false;
        },
        child: NestedScrollView(
          headerSliverBuilder: (context, innerBoxIsScrolled) => [
            SliverToBoxAdapter(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Padding(
                    padding: EdgeInsets.only(top: 30.0),
                    child: ProfileAvatar(imageUrl: userMock.fotoPerfil),
                  ),

                  SizedBox(height: 12),

                  Text(
                    '${userMock.nome}',
                    style: GoogleFonts.inter(
                      color: Colors.white,
                      fontSize: 40,
                      fontWeight: FontWeight.bold,
                    ),
                  ),

                  SizedBox(height: 12),

                  EditableTextField(
                    label: userMock.nomeUsuario,
                    height: 30,
                    width: 150,
                  ),

                  SizedBox(height: 20),

                  Text(
                    userMock.bio,
                    style: GoogleFonts.inter(
                      color: Colors.white70,
                      fontWeight: FontWeight.bold,
                    ),
                  ),

                  SizedBox(height: 12),

                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      Column(
                        children: [
                          Text(
                            userMock.seguidores.toString(),
                            style: GoogleFonts.inter(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                              fontSize: 18,
                            ),
                          ),
                          Text(
                            'SEGUIDORES',
                            style: GoogleFonts.inter(
                              color: Colors.white70,
                              fontWeight: FontWeight.bold,
                              fontSize: 10,
                            ),
                          ),
                        ],
                      ),

                      MyDivider(height: 50, width: 1),

                      Column(
                        children: [
                          Text(
                            userMock.seguindo.toString(),
                            style: GoogleFonts.inter(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                              fontSize: 18,
                            ),
                          ),
                          Text(
                            'SEGUINDO',
                            style: GoogleFonts.inter(
                              color: Colors.white70,
                              fontWeight: FontWeight.bold,
                              fontSize: 10,
                            ),
                          ),
                        ],
                      ),

                      MyDivider(height: 50, width: 1),

                      Column(
                        children: [
                          Text(
                            userMock.eventosVisitados.toString(),
                            style: GoogleFonts.inter(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                              fontSize: 18,
                            ),
                          ),
                          Text(
                            'EVENTOS',
                            style: GoogleFonts.inter(
                              color: Colors.white70,
                              fontWeight: FontWeight.bold,
                              fontSize: 10,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),

                  SizedBox(height: 16),

                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        decoration: BoxDecoration(
                          border: Border.all(color: Colors.white, width: 1),
                          borderRadius: BorderRadius.all(Radius.circular(50)),
                        ),
                        height: 30,
                        width: 150,
                        child: Center(
                          child: Text(
                            'Editar perfil',
                            style: GoogleFonts.inter(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),

                      SizedBox(width: 14),

                      Container(
                        decoration: BoxDecoration(
                          border: Border.all(color: Colors.white, width: 1),
                          borderRadius: BorderRadius.all(Radius.circular(50)),
                        ),
                        height: 30,
                        width: 150,
                        child: Center(
                          child: Text(
                            'Compartilhar perfil',
                            style: GoogleFonts.inter(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),

                  SizedBox(height: 16),
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
                  indicatorColor: Color(colorBrasa),
                  indicatorPadding: EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 6,
                  ),
                  labelPadding: EdgeInsets.all(10),
                  labelStyle: GoogleFonts.inter(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                  ),
                  tabs: [
                    Tab(text: 'FOTOS'),
                    Tab(text: 'FAVORITOS'),
                    Tab(text: 'CHECK-IN'),
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
                    Center(child: PropertyHighlightsScreen(),),
                    Center(child: Text('FAVORITOS')),
                    Center(child: Text('CHECK-IN')),
                  ],
                ),
              ),
            ],
          ),
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
