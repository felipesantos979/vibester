import 'package:flutter/material.dart';
import 'package:mobile/models/feed/publication_model.dart';
import 'package:mobile/providers/feed/publication_list_provider.dart';
import 'package:mobile/screens/feed/new_publication_screen.dart';
import 'package:mobile/utils/colors.dart';
import 'package:mobile/widgets/cards/feed/publication_card.dart';
import 'package:provider/provider.dart';

class FeedScreen extends StatefulWidget {
  //Passa o estado da barra pra usar no botão de nova publicação
  final ValueNotifier<bool> navbarVisibleNotifier;

  const FeedScreen({super.key, required this.navbarVisibleNotifier});

  @override
  State<FeedScreen> createState() => _FeedScreenState();
}

class _FeedScreenState extends State<FeedScreen> {
  final _scrollController = ScrollController();

  @override
  Widget build(BuildContext context) {
    List<PublicationModel> publications = context
        .watch<PublicationListProvider>()
        .publications;

    return Container(
      color: Color(colorNoturno),
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          RefreshIndicator(
            color: Color(colorAmbar),
            onRefresh: () =>
                context.read<PublicationListProvider>().fetchPublications(),
            child: ListView.builder(
              controller: _scrollController,
              padding: EdgeInsets.only(bottom: 80, top: 20),
              itemCount: publications.length,
              itemBuilder: (context, index) {
                return PublicationCard(publication: publications[index]);
              },
            ),
          ),
          Positioned(
            bottom: 100,
            right: 16,
            child: ValueListenableBuilder<bool>(
              valueListenable: widget.navbarVisibleNotifier, //recebe o estado e muda tudo do builder
              builder: (context, visible, child) {

                //Teste pro botão simir
                return AnimatedSlide(
                  offset: visible ? Offset.zero : const Offset(0, 3),
                  duration: const Duration(milliseconds: 300),
                  curve: Curves.easeInOut,
                  child: AnimatedOpacity(
                    opacity: visible ? 1.0 : 0.0,
                    duration: const Duration(milliseconds: 300),
                    child: child!,
                  ),
                );
              },
              child: FloatingActionButton( //O botão fica fora do builder para não reconstruir o designe
                onPressed: () async {
                  await Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => NewPublicationScreen(),
                    ),
                  );
                  _scrollController.animateTo(
                    0,
                    duration: Duration(milliseconds: 300),
                    curve: Curves.easeOut,
                  );
                },
                backgroundColor: Color(colorAmbar),
                foregroundColor: Colors.white,
                child: Icon(Icons.add, size: 48),
              ),
            ),
          ),
        ],
      ),
    );
  }
}