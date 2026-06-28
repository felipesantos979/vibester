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
  // Guardadas em variáveis próprias do card pra uso futuro
  late String _postId;
  late String _userId;
  late String? _estabelecimentoId;
  late List<String> _imagensUrls;
  late String _legenda;
  late int _totalCurtidas;
  late int _totalComentarios;
  late bool _foiDeletado;
  late String _criadoEm;
  late String _atualizadoEm;

  @override
  void initState() {
    super.initState();
    _carregarDados();
  }

  @override
  void didUpdateWidget(HighlightsCard oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.highlight != widget.highlight) {
      _carregarDados();
    }
  }

  void _carregarDados() {
    _postId = widget.highlight.postId;
    _userId = widget.highlight.userId;
    _estabelecimentoId = widget.highlight.estabelecimentoId;
    _imagensUrls = widget.highlight.imagensUrls;
    _legenda = widget.highlight.legenda;
    _totalCurtidas = widget.highlight.totalCurtidas;
    _totalComentarios = widget.highlight.totalComentarios;
    _foiDeletado = widget.highlight.foiDeletado;
    _criadoEm = widget.highlight.criadoEm;
    _atualizadoEm = widget.highlight.atualizadoEm;
  }

  @override
  Widget build(BuildContext context) {

    return Container(
      decoration: BoxDecoration(
        border: Border.all(color: Color(colorAmbar), width: 1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(12),
        child: Image.network(
          widget.highlight.imagemEmDestaque,
          fit: BoxFit.cover,
        ),
      ),
    );
  }
}