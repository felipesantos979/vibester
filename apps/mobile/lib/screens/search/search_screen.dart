import 'package:flutter/material.dart';
import 'package:mobile/utils/colors.dart';
import 'package:mobile/utils/search_bar.dart';
import 'package:mobile/utils/search_state.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final TextEditingController pesquisaController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;

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
      body: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.only(bottom: kBottomNavigationBarHeight + 16),
          child: Column(
            children: [
              Padding(
                padding: EdgeInsets.only(
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

              if (ultimasPesquisas.isNotEmpty) ...[
                Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Container(
                          margin: EdgeInsets.only(left: 16),
                          child: Text(
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
                            margin: EdgeInsets.only(right: 7),
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

                    Container(margin: EdgeInsets.all(5)),

                    ...ultimasPesquisas.map(
                      (pesquisa) => Column(
                        children: [
                          ListTile(
                            leading: Icon(Icons.history, color: Colors.white38),
                            title: Text(
                              pesquisa,
                              style: TextStyle(color: Colors.white38),
                            ),
                            trailing: IconButton(
                              icon: Icon(Icons.close, color: Colors.white38),
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
                      ),
                    ),

                    Container(
                      margin: EdgeInsets.only(left: 16, right: 16, bottom: 45),
                      color: Color(colorGrey),
                      height: 1,
                      width: double.infinity,
                    ),
                  ],
                ),
              ],

              Column(
                children: [
                  Row(
                    children: [
                      Container(
                        margin: EdgeInsets.only(left: 15),
                        child: Text(
                          "Descubra por Categoria",
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 25,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                  Container(
                    margin: EdgeInsets.all(10),
                    child: Column(
                      children: [
                        Row(
                          children: [
                            GestureDetector(
                              onTap: () {},
                              child: Container(
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(
                                    color: Color(colorDarkGrey),
                                    width: 1,
                                  ),
                                ),
                                margin: EdgeInsets.all(6),
                                width: ((screenWidth / 2) - 25),
                                height: ((screenWidth / 2) - 25),
                                child: Stack(
                                  children: [
                                    ClipRRect(
                                      borderRadius: BorderRadius.circular(16),
                                      child: SizedBox(
                                        width: double.infinity,
                                        height: double.infinity,
                                        child: Image.asset(
                                          'assets/img/baladas.jpg',
                                          fit: BoxFit.cover,
                                        ),
                                      ),
                                    ),
                                    Positioned(
                                      bottom: 10,
                                      left: 10,
                                      child: Text(
                                        "Baladas",
                                        style: TextStyle(
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
                            ),
                            GestureDetector(
                              onTap: () {},
                              child: Container(
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(
                                    color: Color(colorDarkGrey),
                                    width: 1,
                                  ),
                                ),
                                margin: EdgeInsets.all(6),
                                width: ((screenWidth / 2) - 25),
                                height: ((screenWidth / 2) - 25),
                                child: Stack(
                                  children: [
                                    ClipRRect(
                                      borderRadius: BorderRadius.circular(16),
                                      child: SizedBox(
                                        width: double.infinity,
                                        height: double.infinity,
                                        child: Image.asset(
                                          'assets/img/bares.jpg',
                                          fit: BoxFit.cover,
                                        ),
                                      ),
                                    ),
                                    Positioned(
                                      bottom: 10,
                                      left: 10,
                                      child: Text(
                                        "Bares",
                                        style: TextStyle(
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
                            ),
                          ],
                        ),
                        Row(
                          children: [
                            GestureDetector(
                              onTap: () {},
                              child: Container(
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(
                                    color: Color(colorDarkGrey),
                                    width: 1,
                                  ),
                                ),
                                margin: EdgeInsets.all(6),
                                width: ((screenWidth / 2) - 25),
                                height: ((screenWidth / 2) - 25),
                                child: Stack(
                                  children: [
                                    ClipRRect(
                                      borderRadius: BorderRadius.circular(16),
                                      child: SizedBox(
                                        width: double.infinity,
                                        height: double.infinity,
                                        child: Image.asset(
                                          'assets/img/lounges.jpg',
                                          fit: BoxFit.cover,
                                        ),
                                      ),
                                    ),
                                    Positioned(
                                      bottom: 10,
                                      left: 10,
                                      child: Text(
                                        "Lounges",
                                        style: TextStyle(
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
                            ),
                            GestureDetector(
                              onTap: () {},
                              child: Container(
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(
                                    color: Color(colorDarkGrey),
                                    width: 1,
                                  ),
                                ),
                                margin: EdgeInsets.all(6),
                                width: ((screenWidth / 2) - 25),
                                height: ((screenWidth / 2) - 25),
                                child: Stack(
                                  children: [
                                    ClipRRect(
                                      borderRadius: BorderRadius.circular(16),
                                      child: SizedBox(
                                        width: double.infinity,
                                        height: double.infinity,
                                        child: Image.asset(
                                          'assets/img/eventos.jpg',
                                          fit: BoxFit.cover,
                                        ),
                                      ),
                                    ),
                                    Positioned(
                                      bottom: 10,
                                      left: 10,
                                      child: Text(
                                        "Eventos",
                                        style: TextStyle(
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
                            ),
                          ],
                        ),
                        Row(
                          children: [
                            GestureDetector(
                              onTap: () {},
                              child: Container(
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(
                                    color: Color(colorDarkGrey),
                                    width: 1,
                                  ),
                                ),
                                margin: EdgeInsets.all(6),
                                width: ((screenWidth / 2) - 25),
                                height: ((screenWidth / 2) - 25),
                                child: Stack(
                                  children: [
                                    ClipRRect(
                                      borderRadius: BorderRadius.circular(16),
                                      child: SizedBox(
                                        width: double.infinity,
                                        height: double.infinity,
                                        child: Image.asset(
                                          'assets/img/restaurantes.jpg',
                                          fit: BoxFit.cover,
                                        ),
                                      ),
                                    ),
                                    Positioned(
                                      bottom: 10,
                                      left: 10,
                                      child: Text(
                                        "Restaurantes",
                                        style: TextStyle(
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
                            ),
                            GestureDetector(
                              onTap: () {},
                              child: Container(
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(
                                    color: Color(colorDarkGrey),
                                    width: 1,
                                  ),
                                ),
                                margin: EdgeInsets.all(6),
                                width: ((screenWidth / 2) - 25),
                                height: ((screenWidth / 2) - 25),
                                child: Stack(
                                  children: [
                                    ClipRRect(
                                      borderRadius: BorderRadius.circular(16),
                                      child: SizedBox(
                                        width: double.infinity,
                                        height: double.infinity,
                                        child: Image.asset(
                                          'assets/img/entretenimento.jpg',
                                          fit: BoxFit.cover,
                                        ),
                                      ),
                                    ),
                                    Positioned(
                                      bottom: 10,
                                      left: 10,
                                      child: Text(
                                        "Entretenimento",
                                        style: TextStyle(
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
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
