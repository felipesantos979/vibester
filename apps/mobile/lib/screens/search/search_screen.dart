import 'package:flutter/material.dart';
import 'package:mobile/models/place/place_model.dart';
import 'package:mobile/providers/place/place_list_provider.dart';
import 'package:mobile/routes/app_routes.dart';
import 'package:mobile/utils/colors.dart';
import 'package:mobile/utils/search_bar.dart';
import 'package:mobile/utils/search_state.dart';
import 'package:mobile/widgets/cards/place/place_card.dart';
import 'package:provider/provider.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final TextEditingController pesquisaController = TextEditingController();
  String? _categoriaSelecionada;
  List<String>? _historicoGuardado;

  static const _categorias = [
    {'label': 'Balada', 'image': 'assets/img/baladas.jpg'},
    {'label': 'Bar', 'image': 'assets/img/bares.jpg'},
    {'label': 'Lounges', 'image': 'assets/img/lounges.jpg'},
    {'label': 'Eventos', 'image': 'assets/img/eventos.jpg'},
    {'label': 'Restaurantes', 'image': 'assets/img/restaurantes.jpg'},
    {'label': 'Entretenimento', 'image': 'assets/img/entretenimento.jpg'},
  ];

  void _selecionarCategoria(String categoria) {
    setState(() {
      _categoriaSelecionada = categoria;
      pesquisaController.clear();
      _historicoGuardado = List<String>.from(ultimasPesquisas);
      ultimasPesquisas.clear();
    });
    context.read<PlaceListProvider>().fetchPlaces();
  }

  void _voltarParaInicio() {
    setState(() {
      _categoriaSelecionada = null;
      if (_historicoGuardado != null) {
        ultimasPesquisas
          ..clear()
          ..addAll(_historicoGuardado!);
        _historicoGuardado = null;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final provider = context.watch<PlaceListProvider>();
    final places = provider.places;
    final listaFiltrada = _categoriaSelecionada != null
        ? places
              .where(
                (p) =>
                    p.categoria.toLowerCase() ==
                    _categoriaSelecionada!.toLowerCase(),
              )
              .toList()
        : <PlaceModel>[];

    return Scaffold(
      backgroundColor: Color(colorDarkGrey),
      appBar: AppBar(
        backgroundColor: Color(colorNavy),
        elevation: 0,
        centerTitle: true,
        automaticallyImplyLeading: false,
        title: Image.asset(
          'assets/img/logo/tipografia.png',
          height: 30,
          fit: BoxFit.contain,
        ),
      ),
      body: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.only(
                top: 20,
                right: 16,
                left: 16,
                bottom: 20,
              ),
              child: CustomSearchBar(
                controller: pesquisaController,
                onChanged: () {},
                onSubmitted: () {
                  setState(() {
                    if (pesquisaController.text.isNotEmpty) {
                      ultimasPesquisas.insert(0, pesquisaController.text);
                      pesquisaController.clear();
                      if (ultimasPesquisas.length > 5) {
                        ultimasPesquisas.removeLast();
                      }
                    }
                  });
                },
              ),
            ),
          ),

          if (ultimasPesquisas.isNotEmpty) ...[
            SliverToBoxAdapter(
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    margin: const EdgeInsets.only(left: 16),
                    child: const Text(
                      "Buscas Recentes",
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 25,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  TextButton(
                    onPressed: () {
                      setState(() {
                        ultimasPesquisas.clear();
                      });
                    },
                    child: Container(
                      margin: const EdgeInsets.only(right: 7),
                      child: Text(
                        "Limpar",
                        style: TextStyle(
                          color: Color(colorAmbar),
                          fontSize: 13,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            SliverToBoxAdapter(
              child: Container(margin: const EdgeInsets.all(5)),
            ),
            SliverList(
              delegate: SliverChildBuilderDelegate((context, index) {
                final pesquisa = ultimasPesquisas[index];
                return Column(
                  children: [
                    ListTile(
                      leading: const Icon(Icons.history, color: Colors.white38),
                      title: Text(
                        pesquisa,
                        style: const TextStyle(color: Colors.white38),
                      ),
                      trailing: IconButton(
                        icon: const Icon(Icons.close, color: Colors.white38),
                        onPressed: () {
                          setState(() {
                            ultimasPesquisas.remove(pesquisa);
                          });
                        },
                      ),
                      onTap: () {
                        pesquisaController.text = pesquisa;
                      },
                    ),
                    Divider(
                      color: Color(colorGrey),
                      height: 1,
                      indent: 16,
                      endIndent: 16,
                    ),
                  ],
                );
              }, childCount: ultimasPesquisas.length),
            ),
            SliverToBoxAdapter(
              child: Container(
                margin: const EdgeInsets.only(left: 16, right: 16, bottom: 45),
                color: Color(colorGrey),
                height: 1,
                width: double.infinity,
              ),
            ),
          ],

          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.only(bottom: 4),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    margin: const EdgeInsets.only(left: 15),
                    child: Text(
                      _categoriaSelecionada ?? "Descubra por Categoria",
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 25,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  if (_categoriaSelecionada != null)
                    Container(
                      margin: const EdgeInsets.only(right: 7),
                      child: IconButton(
                        icon: const Icon(Icons.close, color: Colors.white),
                        onPressed: _voltarParaInicio,
                      ),
                    ),
                ],
              ),
            ),
          ),

          if (_categoriaSelecionada == null) ...[
            SliverToBoxAdapter(
              child: Container(
                margin: const EdgeInsets.all(10),
                child: Column(
                  children: () {
                    final pares = <List<Map<String, String>>>[];
                    for (var i = 0; i < _categorias.length; i += 2) {
                      pares.add(_categorias.sublist(i, i + 2));
                    }
                    return pares.map((par) {
                      return Row(
                        children: par.map((cat) {
                          return GestureDetector(
                            onTap: () => _selecionarCategoria(cat['label']!),
                            child: Container(
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(
                                  color: Color(colorDarkGrey),
                                  width: 1,
                                ),
                              ),
                              margin: const EdgeInsets.all(6),
                              width: (screenWidth / 2) - 25,
                              height: (screenWidth / 2) - 25,
                              child: Stack(
                                children: [
                                  ClipRRect(
                                    borderRadius: BorderRadius.circular(16),
                                    child: SizedBox(
                                      width: double.infinity,
                                      height: double.infinity,
                                      child: Image.asset(
                                        cat['image']!,
                                        fit: BoxFit.cover,
                                      ),
                                    ),
                                  ),
                                  Positioned(
                                    bottom: 10,
                                    left: 10,
                                    child: Text(
                                      cat['label']!,
                                      style: const TextStyle(
                                        color: Colors.white,
                                        fontSize: 20,
                                        fontWeight: FontWeight.bold,
                                        shadows: [
                                          Shadow(
                                            color: Colors.white38,
                                            blurRadius: 8,
                                            offset: Offset(1, 1),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          );
                        }).toList(),
                      );
                    }).toList();
                  }(),
                ),
              ),
            ),
          ] else ...[
            if (provider.isLoading && places.isEmpty)
              const SliverFillRemaining(
                child: Center(
                  child: CircularProgressIndicator(color: Color(colorAmbar)),
                ),
              )
            else if (listaFiltrada.isEmpty)
              SliverFillRemaining(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    SizedBox(
                      height: 200,
                      width: 200,
                      child: Image.asset('assets/img/mascote/lupa.png'),
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      'Nenhum lugar encontrado',
                      style: TextStyle(
                        color: Colors.white38,
                        fontSize: 16,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'Ainda não há estabelecimentos nessa categoria',
                      style: TextStyle(color: Colors.white24, fontSize: 13),
                    ),
                  ],
                ),
              )
            else
              SliverPadding(
                padding: const EdgeInsets.only(bottom: 80),
                sliver: SliverList(
                  delegate: SliverChildBuilderDelegate((context, index) {
                    return PlaceCard(
                      place: listaFiltrada[index],
                      onTap: () {
                        Navigator.pushNamed(
                          context,
                          AppRoutes.placeDetail,
                          arguments: listaFiltrada[index].id,
                        );
                      },
                    );
                  }, childCount: listaFiltrada.length),
                ),
              ),
          ],
          SliverToBoxAdapter(
            child: const SizedBox(height: 40),
          ),
        ],
      ),
    );
  }
}
