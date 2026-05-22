import 'package:flutter/material.dart';
import 'package:mobile/utils/colors.dart';

class CustomNavbar extends StatelessWidget {
  final int? currentIndex;
  final ValueChanged<int>? onTap;

  const CustomNavbar({
    super.key,
    required this.currentIndex,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final items = [
      Icons.home_rounded,
      Icons.search_rounded,
      Icons.favorite_outline_rounded,
      Icons.person_outline_rounded,
    ];

    final activeItems = [
      Icons.home_rounded,
      Icons.search_rounded,
      Icons.favorite_rounded,
      Icons.person_rounded,
    ];

    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(24, 8, 24, 10),
        child: Container(
          height: 50,
          decoration: BoxDecoration(
            color: const Color(colorNoturno),
            borderRadius: BorderRadius.circular(50),
            // Borda ao redor da navbar
            border: Border.all(
              color: Colors.white.withOpacity(0.08),
              width: 1.5,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.4),
                blurRadius: 20,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: List.generate(items.length, (index) {
              final isActive = index == currentIndex;
              return GestureDetector(
                onTap: () => onTap!(index),
                behavior: HitTestBehavior.opaque,
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 250),
                  curve: Curves.easeInOut,
                  width: isActive ? 52 : 48,
                  height: isActive ? 52 : 48,
                  decoration: isActive
                      ? BoxDecoration(
                          color: Color(colorAmbar), // laranja/âmbar do seu tema
                          shape: BoxShape.circle,
                          boxShadow: [
                            BoxShadow(
                              color: Color(colorAmbar).withOpacity(0.4),
                              blurRadius: 12,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        )
                      : null,
                  child: Icon(
                    isActive ? activeItems[index] : items[index],
                    color: isActive ? Colors.white : Colors.white54,
                    size: isActive ? 24 : 18,
                  ),
                ),
              );
            }),
          ),
        ),
      ),
    );
  }
}
