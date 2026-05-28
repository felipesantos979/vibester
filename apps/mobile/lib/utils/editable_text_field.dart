import 'package:flutter/material.dart';
import 'package:mobile/utils/colors.dart';

class EditableTextField extends StatelessWidget {
  final String label;
  final double height;
  final double width;

  const EditableTextField({
    super.key,
    required this.label,
    required this.height,
    required this.width,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.all(Radius.circular(50)),
        color: Color(colorNoturno),
        border: Border.all(color: Color(colorBrasa), width: 1),
      ),
      child: Center(
        child: Text(
          label.toUpperCase(),
          style: TextStyle(
            color: Color(colorBrasa),
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }
}
