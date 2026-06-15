import 'package:flutter/material.dart';
import 'package:mobile/models/place/place_model.dart';
import 'package:mobile/routes/app_routes.dart';
import 'package:mobile/utils/colors.dart';

class CloseToYou extends StatefulWidget {
  const CloseToYou({super.key});

  @override
  State<CloseToYou> createState() => _CloseToYouState();
}

class _CloseToYouState extends State<CloseToYou> {
  List<PlaceModel> get places => [
    PlaceModel(
      nome: "Trinca Bar",
      avaliacao: 4.5,
      distancia: 800,
      nivelMovimento: 2,
      categoria: "Bar",
      nivelPrecoMedio: "1",
      bio: "Bar descolado no centro",
      endereco: "Rua das Flores, 123",
      qtdAvaliacoes: 200,
      distribuicao: [0.1, 0.2, 0.3, 0.3, 0.1],
    ),
    PlaceModel(
      nome: "Trinca Bar",
      avaliacao: 4.5,
      distancia: 800,
      nivelMovimento: 2,
      categoria: "Bar",
      nivelPrecoMedio: "2",
      bio: "Bar descolado no centro",
      endereco: "Rua das Flores, 123",
      qtdAvaliacoes: 200,
      distribuicao: [0.1, 0.2, 0.3, 0.3, 0.1],
    ),
    PlaceModel(
      nome: "Café do Parque",
      avaliacao: 4.2,
      distancia: 350,
      nivelMovimento: 1,
      categoria: "Café",
      nivelPrecoMedio: "1",
      bio: "Café tranquilo com vista para o parque",
      endereco: "Av. das Árvores, 45",
      qtdAvaliacoes: 120,
      distribuicao: [0.05, 0.1, 0.2, 0.4, 0.25],
    ),
    PlaceModel(
      nome: "Restaurante Bella Italia",
      avaliacao: 4.7,
      distancia: 1200,
      nivelMovimento: 3,
      categoria: "Restaurante",
      nivelPrecoMedio: "3",
      bio: "Culinária italiana autêntica",
      endereco: "Rua Roma, 88",
      qtdAvaliacoes: 540,
      distribuicao: [0.02, 0.05, 0.1, 0.3, 0.53],
    ),
    PlaceModel(
      nome: "Boteco do Zé",
      avaliacao: 3.9,
      distancia: 500,
      nivelMovimento: 3,
      categoria: "Bar",
      nivelPrecoMedio: "1",
      bio: "Boteco tradicional de bairro",
      endereco: "Rua Sete, 12",
      qtdAvaliacoes: 89,
      distribuicao: [0.1, 0.2, 0.3, 0.25, 0.15],
    ),
    PlaceModel(
      nome: "Sushi Zen",
      avaliacao: 4.8,
      distancia: 2000,
      nivelMovimento: 2,
      categoria: "Restaurante",
      nivelPrecoMedio: "3",
      bio: "Sushi fresquinho todo dia",
      endereco: "Rua do Oriente, 200",
      qtdAvaliacoes: 310,
      distribuicao: [0.01, 0.04, 0.1, 0.35, 0.5],
    ),
    PlaceModel(
      nome: "Padaria Pão Quente",
      avaliacao: 4.4,
      distancia: 150,
      nivelMovimento: 2,
      categoria: "Padaria",
      nivelPrecoMedio: "1",
      bio: "Pão fresquinho saindo do forno",
      endereco: "Rua da Farinha, 7",
      qtdAvaliacoes: 430,
      distribuicao: [0.02, 0.08, 0.15, 0.45, 0.3],
    ),
    PlaceModel(
      nome: "Rooftop Sky",
      avaliacao: 4.6,
      distancia: 1800,
      nivelMovimento: 2,
      categoria: "Bar",
      nivelPrecoMedio: "3",
      bio: "Bar no topo com vista incrível da cidade",
      endereco: "Av. Alto, 900",
      qtdAvaliacoes: 260,
      distribuicao: [0.02, 0.05, 0.13, 0.4, 0.4],
    ),
    PlaceModel(
      nome: "Hamburgueria 404",
      avaliacao: 4.3,
      distancia: 700,
      nivelMovimento: 3,
      categoria: "Lanchonete",
      nivelPrecoMedio: "2",
      bio: "Hambúrgueres artesanais",
      endereco: "Rua do Byte, 404",
      qtdAvaliacoes: 180,
      distribuicao: [0.05, 0.1, 0.2, 0.35, 0.3],
    ),
    PlaceModel(
      nome: "Vino & Cia",
      avaliacao: 4.5,
      distancia: 950,
      nivelMovimento: 1,
      categoria: "Bar",
      nivelPrecoMedio: "3",
      bio: "Adega e bar de vinhos selecionados",
      endereco: "Rua das Uvas, 33",
      qtdAvaliacoes: 145,
      distribuicao: [0.02, 0.08, 0.15, 0.4, 0.35],
    ),
    PlaceModel(
      nome: "Tapiocaria da Dona Maria",
      avaliacao: 4.1,
      distancia: 400,
      nivelMovimento: 2,
      categoria: "Lanchonete",
      nivelPrecoMedio: "1",
      bio: "Tapiocas artesanais e sucos naturais",
      endereco: "Rua do Nordeste, 56",
      qtdAvaliacoes: 95,
      distribuicao: [0.05, 0.15, 0.25, 0.35, 0.2],
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: places.length,
      itemBuilder: (context, index) {
        final place = places[index];

        return Container(
          margin: EdgeInsets.symmetric(vertical: 8),
          decoration: BoxDecoration(
            color: Color(colorNavy),
            borderRadius: BorderRadius.circular(70),
            border: Border.all(
              color: Color(colorBrasa).withAlpha(60),
              width: 2,
            ),
          ),
          child: Material(
            color: Colors.transparent,
            borderRadius: BorderRadius.circular(70),
            child: InkWell(
              onTap: () {
                Navigator.pushNamed(
                  context,
                  AppRoutes.placeDetail,
                  arguments: place,
                );
              },
              borderRadius: BorderRadius.circular(70),
              splashColor: Color(colorAmbar),
              child: Stack(
                children: [
                  Padding(
                    padding: EdgeInsets.only(
                      left: 15,
                      top: 15,
                      bottom: 15,
                      right: 90,
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        Container(
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: Color(colorDarkGrey),
                              width: 1,
                            ),
                          ),
                          child: ClipOval(
                            child: SizedBox(
                              height: 50,
                              width: 50,
                              child: Placeholder(),
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                place.nome,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 23,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Icon(
                                    Icons.star_border,
                                    color: Color(colorAmbar),
                                    size: 20,
                                  ),
                                  SizedBox(width: 3),
                                  Text(
                                    '${place.avaliacao}',
                                    style: TextStyle(
                                      color: Colors.white54,
                                      fontSize: 15,
                                    ),
                                  ),
                                  SizedBox(width: 8),
                                  Icon(
                                    Icons.circle,
                                    color: Colors.white38,
                                    size: 8,
                                  ),
                                  SizedBox(width: 8),
                                  Text(
                                    '${place.distancia!.toStringAsFixed(0)}m',
                                    style: TextStyle(
                                      color: Colors.white54,
                                      fontSize: 15,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),

                  Positioned(
                    top: 0,
                    bottom: 0,
                    right: 25,
                    child: Center(
                      child: Container(
                        decoration: BoxDecoration(
                          color: Color(colorAmbar),
                          borderRadius: BorderRadius.circular(50),
                        ),
                        padding: EdgeInsets.symmetric(
                          horizontal: 20,
                          vertical: 4,
                        ),
                        child: Text(
                          "Ir",
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 15,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
