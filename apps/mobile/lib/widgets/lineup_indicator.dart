import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/utils/colors.dart';

class LineupIndicator extends StatelessWidget {
  const LineupIndicator({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          width: 100,
          height: 100,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            border: Border.all(color: Color(colorBrasa), width: 3),
          ),
          child: ClipOval(
            child: Placeholder(),
          ),
        ),

        const SizedBox(height: 8),

        Text(
          "Casa das primas",
          style: GoogleFonts.inter(color: Colors.white, fontSize: 13),
        ),
      ],
    );
  }
}