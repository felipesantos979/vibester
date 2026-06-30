import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:mobile/models/highlights/highlight_model.dart';
import 'package:mobile/routes/app_routes.dart';
import 'package:mobile/utils/colors.dart';

class HighlightsCard extends StatelessWidget {
  final HighlightModel highlight;

  const HighlightsCard({super.key, required this.highlight});

  @override
  Widget build(BuildContext context) {
    final imageUrl = highlight.imagemEmDestaque;

    return Material(
      color: Colors.transparent,
      borderRadius: BorderRadius.circular(12),
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: () {
          Navigator.pushNamed(
            context,
            AppRoutes.postDetail,
            arguments: highlight,
          );
        },
        child: Container(
          decoration: BoxDecoration(
            border: Border.all(color: Color(colorAmbar), width: 1),
            borderRadius: BorderRadius.circular(12),
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: imageUrl.isEmpty
                ? Container(
                    color: Colors.white12,
                    child: const Icon(
                      Icons.image_not_supported_outlined,
                      color: Colors.white38,
                    ),
                  )
                : CachedNetworkImage(
                    imageUrl: imageUrl,
                    fit: BoxFit.cover,
                    placeholder: (context, url) => Container(
                      color: Colors.white12,
                      child: Center(
                        child: CircularProgressIndicator(
                          color: Color(colorAmbar),
                          strokeWidth: 2,
                        ),
                      ),
                    ),
                    errorWidget: (context, url, error) {
                      debugPrint('Erro ao carregar imagem ($imageUrl): $error');
                      return Container(
                        color: Colors.white12,
                        child: const Icon(
                          Icons.broken_image_outlined,
                          color: Colors.white38,
                        ),
                      );
                    },
                  ),
          ),
        ),
      ),
    );
  }
}