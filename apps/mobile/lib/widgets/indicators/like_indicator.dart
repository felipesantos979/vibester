import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/models/feed/publication_model.dart';
import 'package:mobile/utils/colors.dart';

class LikeIndicator extends StatefulWidget {
  final PublicationModel publication;
  const LikeIndicator({super.key, required this.publication});

  @override
  State<LikeIndicator> createState() => _LikeIndicatorState();
}

class _LikeIndicatorState extends State<LikeIndicator> {
  late bool selecionado = false;
  late int likes = widget.publication.likes;
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 10.0),
      child: AnimatedScale(
        scale: selecionado ? 1.3 : 1.0,
        duration: Duration(milliseconds: 1000),
        curve: Curves.elasticOut,
        child: GestureDetector(
          onTap: () {
            setState(() {
              selecionado = !selecionado;
              if (selecionado == true) {
                likes += 1;
              } else {
                likes -= 1;
              }
            });
          },
          child: Container(
            padding: EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            decoration: BoxDecoration(
              color: Color(colorNoturno),
              borderRadius: BorderRadius.circular(30),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  Icons.favorite,
                  color: selecionado ? Color(colorBrasa) : Colors.white38,
                ),
                SizedBox(width: 10),
                Text(
                  likes.toString(),
                  style: GoogleFonts.inter(
                    fontWeight: FontWeight.bold,
                    color: selecionado ? Color(colorBrasa) : Colors.white38,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
