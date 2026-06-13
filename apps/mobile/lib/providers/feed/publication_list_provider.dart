import 'package:flutter/material.dart';
import 'package:mobile/models/feed/publication_model.dart';

class PublicationListProvider extends ChangeNotifier {
  final List<PublicationModel> _publications = [
    PublicationModel(
      autor: 'aninha__',
      autorProfileImage: 'https://i.pravatar.cc/150?img=1',
      publicationImage: 'https://picsum.photos/seed/pub1/600/400',
      description:
          'Filin tá brabo demais essa noite! 🔥 DJ mandando muito, galera toda animada, não tô indo embora não!',
      location: 'Filin',
      publicatedAt: DateTime(2026, 5, 29, 23, 14),
      likes: 133,
    ),
    PublicationModel(
      autor: 'carlinhos223',
      autorProfileImage: 'https://i.pravatar.cc/150?img=3',
      publicationImage: 'https://picsum.photos/seed/pub2/600/400',
      description:
          'Douha é vida! 🍹 Narguilé na mesa, galera boa e aquela vibe gostosa de quinta. Quem tiver afim chega!',
      location: 'Douha',
      publicatedAt: DateTime(2026, 5, 29, 21, 50),
      likes: 133,
    ),
    PublicationModel(
      autor: 'bea_santos',
      autorProfileImage: 'https://i.pravatar.cc/150?img=5',
      publicationImage: 'https://picsum.photos/seed/pub3/600/400',
      description:
          'Folks no sábado é protocolo! 🍺 Melhor chopp da cidade, petisco gostoso e muito papo. Tô aqui até fechar!',
      location: 'Folks',
      publicatedAt: DateTime(2026, 5, 29, 20, 30),
      likes: 133,
    ),
    PublicationModel(
      autor: 'fael.costa',
      autorProfileImage: 'https://i.pravatar.cc/150?img=7',
      publicationImage: 'https://picsum.photos/seed/pub4/600/400',
      description:
          'Ultra Club hoje tá outro nível! 🎶 Pista cheia desde cedo, som alto e a galera só quer dançar. Isso é Maringá!',
      location: 'Ultra Club',
      publicatedAt: DateTime(2026, 5, 29, 18, 0),
      likes: 13,
    ),
    PublicationModel(
      autor: 'ju.ferreira',
      autorProfileImage: 'https://i.pravatar.cc/150?img=9',
      publicationImage: 'https://picsum.photos/seed/pub5/600/400',
      description:
          'Caravelha é puro charme! ⚓ Aquele ambiente aconchegante, drinks incríveis e a companhia tá ótima. Sextou!',
      location: 'Caravelha',
      publicatedAt: DateTime(2026, 5, 29, 14, 22),
      likes: 1331,
    ),
    PublicationModel(
      autor: 'lucas.oliveiraa',
      autorProfileImage: 'https://i.pravatar.cc/150?img=11',
      publicationImage: 'https://picsum.photos/seed/pub6/600/400',
      description:
          'Coronel sempre entregando! 🤠 Churrasco na brasa, cerveja gelada e os brothers todos aqui. Não tem erro!',
      location: 'Coronel',
      publicatedAt: DateTime(2026, 5, 28, 22, 0),
      likes: 131,
    ),
    PublicationModel(
      autor: 'fer.rocha23',
      autorProfileImage: 'https://i.pravatar.cc/150?img=13',
      publicationImage: 'https://picsum.photos/seed/pub7/600/400',
      description:
          'Primos Beer acertou em cheio hoje! 🍻 Variedade de rótulos absurda, petisco chegando e a galera tá demais!',
      location: 'Primos Beer',
      publicatedAt: DateTime(2026, 5, 27, 20, 15),
      likes: 121,
    ),
    PublicationModel(
      autor: 'thi.alves',
      autorProfileImage: 'https://i.pravatar.cc/150?img=15',
      publicationImage: 'https://picsum.photos/seed/pub8/600/400',
      description:
          'Seu Petrônio é aquele point raiz! 🥃 Boteco com alma, pagode rolando no canto e todo mundo se conhecendo. Saudade zero!',
      location: 'Seu Petrônio',
      publicatedAt: DateTime(2026, 5, 25, 19, 40),
      likes: 132,
    ),
    PublicationModel(
      autor: 'isaa_nuunes',
      autorProfileImage: 'https://i.pravatar.cc/150?img=17',
      publicationImage: 'https://picsum.photos/seed/pub9/600/400',
      description:
          'Bar do Bird tá on hoje! 🐦 Rock ao vivo, ambiente descolado e aquela energia que só esse lugar tem. Amei demais!',
      location: 'Bar do Bird',
      publicatedAt: DateTime(2026, 5, 22, 21, 0),
      likes: 133,
    ),
    PublicationModel(
      autor: 'diego_martins',
      autorProfileImage: 'https://i.pravatar.cc/150?img=19',
      publicationImage: 'https://picsum.photos/seed/pub10/600/400',
      description:
          'Segunda rodada no Filin e a noite ainda tá jovem! 🌙 Quem falou que domingo não presta nunca veio aqui!',
      location: 'Filin',
      publicatedAt: DateTime(2026, 5, 15, 23, 30),
      likes: 133,
    ),
  ];

  List<PublicationModel> get publications => _publications;

  void addPublication(PublicationModel publication) {
    _publications.insert(0, publication);
    notifyListeners();
  }

  Future<void> fetchPublications() async {
    notifyListeners();
  }
}
