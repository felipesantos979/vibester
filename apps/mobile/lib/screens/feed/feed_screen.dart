import 'package:flutter/material.dart';
import 'package:mobile/models/feed/publication_model.dart';
import 'package:mobile/screens/feed/new_publication_screen.dart';
import 'package:mobile/utils/colors.dart';
import 'package:mobile/widgets/cards/publication_card.dart';

class FeedScreen extends StatefulWidget {
  const FeedScreen({super.key});

  @override
  State<FeedScreen> createState() => _FeedScreenState();
}

class _FeedScreenState extends State<FeedScreen> {
  final List<PublicationModel> publications = [
    PublicationModel(
      autor: 'Ana Lima',
      autorProfileImage: 'https://i.pravatar.cc/150?img=1',
      publicationImage: 'https://picsum.photos/seed/pub1/600/400',
      description:
          'Filin tá brabo demais essa noite! 🔥 DJ mandando muito, galera toda animada, não tô indo embora não!',
      location: 'Filin',
      publicatedAt: DateTime(2026, 5, 29, 23, 14),
    ),
    PublicationModel(
      autor: 'Carlos Mendes',
      autorProfileImage: 'https://i.pravatar.cc/150?img=3',
      publicationImage: 'https://picsum.photos/seed/pub2/600/400',
      description:
          'Douha é vida! 🍹 Narguilé na mesa, galera boa e aquela vibe gostosa de quinta. Quem tiver afim chega!',
      location: 'Douha',
      publicatedAt: DateTime(2026, 5, 29, 21, 50),
    ),
    PublicationModel(
      autor: 'Beatriz Santos',
      autorProfileImage: 'https://i.pravatar.cc/150?img=5',
      publicationImage: 'https://picsum.photos/seed/pub3/600/400',
      description:
          'Folks no sábado é protocolo! 🍺 Melhor chopp da cidade, petisco gostoso e muito papo. Tô aqui até fechar!',
      location: 'Folks',
      publicatedAt: DateTime(2026, 5, 29, 20, 30),
    ),
    PublicationModel(
      autor: 'Rafael Costa',
      autorProfileImage: 'https://i.pravatar.cc/150?img=7',
      publicationImage: 'https://picsum.photos/seed/pub4/600/400',
      description:
          'Ultra Club hoje tá outro nível! 🎶 Pista cheia desde cedo, som alto e a galera só quer dançar. Isso é Maringá!',
      location: 'Ultra Club',
      publicatedAt: DateTime(2026, 5, 29, 18, 0),
    ),
    PublicationModel(
      autor: 'Juliana Ferreira',
      autorProfileImage: 'https://i.pravatar.cc/150?img=9',
      publicationImage: 'https://picsum.photos/seed/pub5/600/400',
      description:
          'Caravelha é puro charme! ⚓ Aquele ambiente aconchegante, drinks incríveis e a companhia tá ótima. Sextou!',
      location: 'Caravelha',
      publicatedAt: DateTime(2026, 5, 29, 14, 22),
    ),
    PublicationModel(
      autor: 'Lucas Oliveira',
      autorProfileImage: 'https://i.pravatar.cc/150?img=11',
      publicationImage: 'https://picsum.photos/seed/pub6/600/400',
      description:
          'Coronel sempre entregando! 🤠 Churrasco na brasa, cerveja gelada e os brothers todos aqui. Não tem erro!',
      location: 'Coronel',
      publicatedAt: DateTime(2026, 5, 28, 22, 0),
    ),
    PublicationModel(
      autor: 'Fernanda Rocha',
      autorProfileImage: 'https://i.pravatar.cc/150?img=13',
      publicationImage: 'https://picsum.photos/seed/pub7/600/400',
      description:
          'Primos Beer acertou em cheio hoje! 🍻 Variedade de rótulos absurda, petisco chegando e a galera tá demais!',
      location: 'Primos Beer',
      publicatedAt: DateTime(2026, 5, 27, 20, 15),
    ),
    PublicationModel(
      autor: 'Thiago Alves',
      autorProfileImage: 'https://i.pravatar.cc/150?img=15',
      publicationImage: 'https://picsum.photos/seed/pub8/600/400',
      description:
          'Seu Petrônio é aquele point raiz! 🥃 Boteco com alma, pagode rolando no canto e todo mundo se conhecendo. Saudade zero!',
      location: 'Seu Petrônio',
      publicatedAt: DateTime(2026, 5, 25, 19, 40),
    ),
    PublicationModel(
      autor: 'Isabela Nunes',
      autorProfileImage: 'https://i.pravatar.cc/150?img=17',
      publicationImage: 'https://picsum.photos/seed/pub9/600/400',
      description:
          'Bar do Bird tá on hoje! 🐦 Rock ao vivo, ambiente descolado e aquela energia que só esse lugar tem. Amei demais!',
      location: 'Bar do Bird',
      publicatedAt: DateTime(2026, 5, 22, 21, 0),
    ),
    PublicationModel(
      autor: 'Diego Martins',
      autorProfileImage: 'https://i.pravatar.cc/150?img=19',
      publicationImage: 'https://picsum.photos/seed/pub10/600/400',
      description:
          'Segunda rodada no Filin e a noite ainda tá jovem! 🌙 Quem falou que domingo não presta nunca veio aqui!',
      location: 'Filin',
      publicatedAt: DateTime(2026, 5, 15, 23, 30),
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return SizedBox.expand(
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          ListView.builder(
            padding: EdgeInsets.only(bottom: 80, top: 20),
            itemCount: publications.length,
            itemBuilder: (context, index) {
              return PublicationCard(publication: publications[index]);
            },
          ),
          Positioned(
            bottom: 100,
            right: 16,
            child: FloatingActionButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => NewPublicationScreen(),
                  ),
                );
              },
              backgroundColor: Color(colorAmbar),
              foregroundColor: Colors.white,
              child: Icon(Icons.add, size: 48),
            ),
          ),
        ],
      ),
    );
  }
}
