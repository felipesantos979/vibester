import 'package:flutter/material.dart';
import 'package:mobile/models/highlights/highlight_model.dart';
import 'package:mobile/utils/colors.dart';

class HighlightsCard extends StatefulWidget {
  final HighlightModel highlight;

  const HighlightsCard({super.key, required this.highlight});

  @override
  State<HighlightsCard> createState() => _HighlightsCardState();
}

class _HighlightsCardState extends State<HighlightsCard> {
  @override
  Widget build(BuildContext context) {

    return Container(
      decoration: BoxDecoration(
        border: Border.all(color: Color(colorAmbar), width: 1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(12),
        child: Placeholder(),
        /*child: Image.network(
          widget.highlight.imagemEmDestaque,
          fit: BoxFit.cover,
        ),*/
      ),
    );
  }
}
