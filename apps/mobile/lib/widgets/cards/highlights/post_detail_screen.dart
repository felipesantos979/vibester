import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import 'package:mobile/models/highlights/highlight_model.dart';
import 'package:mobile/utils/colors.dart';

class PostDetailScreen extends StatefulWidget {
  final HighlightModel highlight;

  const PostDetailScreen({super.key, required this.highlight});

  @override
  State<PostDetailScreen> createState() => _PostDetailScreenState();
}

class _PostDetailScreenState extends State<PostDetailScreen> {
  late final PageController _pageController;
  int _paginaAtual = 0;

  @override
  void initState() {
    super.initState();
    _pageController = PageController();
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  String _formatarData(String isoDate) {
    if (isoDate.isEmpty) return '';
    try {
      final data = DateTime.parse(isoDate);
      return DateFormat("d 'de' MMMM 'de' y", 'pt_BR').format(data);
    } catch (_) {
      return '';
    }
  }

  @override
  Widget build(BuildContext context) {
    final highlight = widget.highlight;
    final imagens = highlight.imagensUrls;
    final dataFormatada = _formatarData(highlight.criadoEm);

    // Limita a resolução decodificada ao tamanho real da tela (em pixels
    // físicos). Sem isso, uma foto de câmera em resolução original consome
    // memória suficiente para expulsar outras imagens do cache global,
    // fazendo-as "recarregar" visualmente ao voltar para outras telas.
    final imagemCacheWidth =
        (MediaQuery.of(context).size.width *
                MediaQuery.of(context).devicePixelRatio)
            .round();

    return Scaffold(
      backgroundColor: Color(colorNoturno),
      appBar: AppBar(
        backgroundColor: Color(colorNoturno),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Publicação',
          style: GoogleFonts.inter(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
      ),
      body: ListView(
        children: [
          // Carrossel de imagens (caso tenha mais de uma)
          AspectRatio(
            aspectRatio: 1,
            child: imagens.isEmpty
                ? Container(
                    color: Colors.white12,
                    child: const Center(
                      child: Icon(
                        Icons.image_not_supported_outlined,
                        color: Colors.white38,
                        size: 48,
                      ),
                    ),
                  )
                : Stack(
                    alignment: Alignment.bottomCenter,
                    children: [
                      PageView.builder(
                        controller: _pageController,
                        itemCount: imagens.length,
                        onPageChanged: (index) =>
                            setState(() => _paginaAtual = index),
                        itemBuilder: (context, index) {
                          return CachedNetworkImage(
                            imageUrl: imagens[index],
                            fit: BoxFit.cover,
                            memCacheWidth: imagemCacheWidth,
                            fadeInDuration: Duration.zero,
                            fadeOutDuration: Duration.zero,
                            errorWidget: (context, url, error) {
                              return Container(
                                color: Colors.white12,
                                child: const Icon(
                                  Icons.broken_image_outlined,
                                  color: Colors.white38,
                                ),
                              );
                            },
                          );
                        },
                      ),

                      if (imagens.length > 1)
                        Padding(
                          padding: const EdgeInsets.only(bottom: 12),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: List.generate(imagens.length, (index) {
                              return Container(
                                margin: const EdgeInsets.symmetric(
                                  horizontal: 3,
                                ),
                                width: 7,
                                height: 7,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: index == _paginaAtual
                                      ? Color(colorAmbar)
                                      : Colors.white38,
                                ),
                              );
                            }),
                          ),
                        ),
                    ],
                  ),
          ),

          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Curtidas e comentários
                Row(
                  children: [
                    Icon(Icons.favorite, color: Color(colorBrasa), size: 22),
                    const SizedBox(width: 6),
                    Text(
                      '${highlight.totalCurtidas}',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(width: 20),
                    const Icon(
                      Icons.mode_comment_outlined,
                      color: Colors.white70,
                      size: 20,
                    ),
                    const SizedBox(width: 6),
                    Text(
                      '${highlight.totalComentarios}',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 16),

                // Legenda
                if (highlight.legenda.isNotEmpty)
                  Text(
                    highlight.legenda,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 15,
                      height: 1.4,
                    ),
                  ),

                if (dataFormatada.isNotEmpty) ...[
                  const SizedBox(height: 12),
                  Text(
                    dataFormatada,
                    style: const TextStyle(color: Colors.white38, fontSize: 13),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}
