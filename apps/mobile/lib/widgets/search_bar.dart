import 'package:flutter/material.dart';
import 'package:mobile/utils/colors.dart';

class CustomSearchBar extends StatelessWidget {
  final TextEditingController controller;
  final VoidCallback onChanged;

  const CustomSearchBar({
    super.key,
    required this.controller,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.02),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.white.withOpacity(0.12), width: 2),
      ),
      child: TextField(
        controller: controller,
        cursorColor: Color(colorAmbar),
        style: const TextStyle(color: Colors.white),
        onChanged: (_) => onChanged(),
        decoration: InputDecoration(
          hintText: 'Buscar por nome ou categoria...',
          hintStyle: TextStyle(color: Colors.white38, fontSize: 14),
          prefixIcon: Icon(Icons.search, color: Color(colorAmbar)),
          suffixIcon: controller.text.isNotEmpty
              ? IconButton(
                  icon: Icon(Icons.close, color: Colors.white38),
                  onPressed: () {
                    controller.clear();
                    onChanged();
                  },
                )
              : null,
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 14,
          ),
        ),
      ),
    );
  }
}
