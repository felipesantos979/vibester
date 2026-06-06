import 'package:flutter/material.dart';
import 'package:mobile/utils/colors.dart';

class AppProgressIndicator extends StatelessWidget {
  const AppProgressIndicator({super.key});

  @override
  Widget build(BuildContext context) {
    return const CircularProgressIndicator(
      color: Color(colorAmbar),
      backgroundColor: Color(colorNoturno),
    );
  }
}
