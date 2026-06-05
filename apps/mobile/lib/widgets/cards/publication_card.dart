import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/models/feed/publication_model.dart';
import 'package:mobile/utils/colors.dart';
import 'package:mobile/utils/divider.dart';
import 'package:mobile/widgets/indicators/like_indicator.dart';

class PublicationCard extends StatelessWidget {
  final PublicationModel publication;

  const PublicationCard({super.key, required this.publication});

  String _timeAgo(DateTime date) {
    final diff = DateTime.now().difference(date);

    if (diff.inSeconds < 60) return 'agora mesmo';
    if (diff.inMinutes < 60) return 'há ${diff.inMinutes} min';
    if (diff.inHours < 24) return 'há ${diff.inHours}h';
    if (diff.inDays < 7) return 'há ${diff.inDays}d';
    if (diff.inDays < 30) return 'há ${(diff.inDays / 7).floor()} sem';
    if (diff.inDays < 365) return 'há ${(diff.inDays / 30).floor()} meses';
    return 'há ${(diff.inDays / 365).floor()} anos';
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 10.0, vertical: 10),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Container(
                  decoration: BoxDecoration(
                    border: Border.all(color: Color(colorAmbar), width: 2),
                    borderRadius: BorderRadius.all(Radius.circular(36)),
                  ),
                  child: CircleAvatar(
                    radius: 30,
                    backgroundImage: NetworkImage(
                      publication.autorProfileImage,
                    ),
                  ),
                ),
                SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        publication.autor,
                        style: GoogleFonts.inter(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              Icon(
                                Icons.location_on_outlined,
                                color: Color(colorBrasa),
                                size: 16,
                              ),
                              SizedBox(width: 3),
                              Text(
                                publication.location,
                                style: GoogleFonts.inter(
                                  color: Color(colorBrasa).withAlpha(150),
                                  fontWeight: FontWeight.bold,
                                  fontSize: 12,
                                ),
                              ),
                            ],
                          ),
                          Text(
                            _timeAgo(publication.publicatedAt),
                            style: GoogleFonts.inter(
                              color: Colors.white.withAlpha(80),
                              fontSize: 11,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          AspectRatio(
            aspectRatio: 4 / 5,
            child: Image.network(
              publication.publicationImage,
              width: double.infinity,
              fit: BoxFit.cover,
            ),
          ),

          Padding(
            padding: EdgeInsets.symmetric(horizontal: 10.0, vertical: 10),
            child: Text.rich(
              TextSpan(
                text: '${publication.autor}: ',
                style: GoogleFonts.inter(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
                children: [
                  TextSpan(
                    text: publication.description,
                    style: GoogleFonts.inter(color: Colors.white60),
                  ),
                ],
              ),
            ),
          ),

          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [LikeIndicator(publication: publication)],
          ),

          MyDivider(height: 1, width: double.infinity),
        ],
      ),
    );
  }
}
