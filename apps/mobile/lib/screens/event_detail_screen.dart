import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:latlong2/latlong.dart';
import 'package:mobile/models/event_model.dart';
import 'package:mobile/widgets/lineup_indicator.dart';
import 'package:mobile/widgets/secundary_button.dart';
import 'package:mobile/widgets/tertiary_button.dart';
import '../utils/colors.dart';
import 'package:intl/intl.dart';

class EventDetailScreen extends StatefulWidget {
  final EventModel eventModel;

  const EventDetailScreen({super.key, required this.eventModel});

  @override
  State<EventDetailScreen> createState() => _EventDetailScreenState();
}

class _EventDetailScreenState extends State<EventDetailScreen> {
  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;

    return Scaffold(
      backgroundColor: Color(colorNoturno),

      body: ListView(
        children: [
          //Header, imagem e título
          //===============================================================================
          SizedBox(
            height: size.height * 0.41,
            child: Stack(
              children: [
                //Imagen ocupando todo o espaço desse SizedBox
                Positioned.fill(child: Placeholder()),

                //Botão de voltar
                Positioned(
                  top: 20,
                  left: 16,
                  child: CircleAvatar(
                    backgroundColor: Color(colorDarkGrey).withOpacity(0.8),
                    child: IconButton(
                      onPressed: () {
                        Navigator.pop(context);
                      },
                      icon: const Icon(
                        Icons.arrow_back_ios_new,
                        color: Color(colorBrasa),
                      ),
                    ),
                  ),
                ),

                //Botão de Compartilhar
                Positioned(
                  top: 20,
                  right: 16,
                  child: CircleAvatar(
                    backgroundColor: Color(colorDarkGrey).withOpacity(0.8),
                    child: IconButton(
                      onPressed: () {
                        //Ação de compartilhar
                      },
                      icon: const Icon(Icons.share, color: Colors.white),
                    ),
                  ),
                ),

                //Tipo de evento
                Positioned(
                  left: 16,
                  bottom: 65,

                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 5,
                    ),

                    decoration: BoxDecoration(
                      color: const Color(colorDarkGrey).withOpacity(0.4),
                      borderRadius: BorderRadius.circular(30),
                      border: Border.all(
                        color: const Color(colorBrasa),
                        width: 1.5,
                      ),
                    ),

                    child: Text(
                      //////
                      widget.eventModel.categoria,
                      style: GoogleFonts.inter(
                        color: const Color(colorBrasa),
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                        letterSpacing: 4,

                        //possivel sombra (teste)
                        shadows: [
                          Shadow(color: Color(colorBrasa), blurRadius: 5),
                        ],
                      ),
                    ),
                  ),
                ),

                //Titulo do evento
                Positioned(
                  left: 16,
                  right: 16,
                  bottom: 2,
                  child: Text(
                    widget.eventModel.titulo,
                    style: GoogleFonts.inter(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 41,

                      //possivel sombra (teste)
                      shadows: [Shadow(color: Colors.white, blurRadius: 4)],
                    ),
                  ),
                ),
              ],
            ),
          ),

          //===============================================================================
          const SizedBox(height: 3),

          //Infos basicas e botões de "Vou ir" e "Garantir ingresso"
          //===============================================================================
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 20),

            child: SizedBox(
              height: size.height * 0.30,
              child: Column(
                children: [
                  const SizedBox(height: 5),

                  //Caixa com infos basicas sobre o evento (trocar infos fixas por variaveis posteriormente)
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 20,
                      vertical: 12,
                    ),

                    decoration: BoxDecoration(
                      color: Color(colorNavy),
                      borderRadius: BorderRadius.circular(20),
                    ),

                    child: Row(
                      children: [
                        // DATA
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'DATA & HORA',
                                style: GoogleFonts.inter(
                                  color: Color(colorGrey),
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),

                              const SizedBox(height: 6),

                              Text(
                                DateFormat(
                                  "EEE dd MMM  HH:mm",
                                  "pt_BR",
                                ).format(widget.eventModel.dataDoEvento),
                                style: GoogleFonts.inter(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        ),

                        // Linha central de divisoria
                        Container(width: 1, height: 40, color: Colors.white12),

                        const SizedBox(width: 20),

                        //Coluna de localização
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              //Texto imutavel
                              Text(
                                'LOCALIZAÇÃO',
                                style: GoogleFonts.inter(
                                  color: Color(colorGrey),
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),

                              const SizedBox(height: 6),

                              //Futura variavel
                              Text(
                                widget.eventModel.localizacao,
                                style: GoogleFonts.inter(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),

                  //Espaçamento entre itens
                  const SizedBox(height: 16),

                  Column(
                    //Criar efeitp de confirmados e add o coração de curtida
                  ),

                  //Espaçamento entre itens
                  const SizedBox(height: 16),

                  //Botão de "VOU IR" (add função posteriormente)
                  TertiaryButton(label: "VOU IR", onPressed: (){}),

                  //Espaçamento entre itens
                  const SizedBox(height: 16),

                  //Botão de "GARANTIR INGRESSO" (add função posteriormente)
                  SecundaryButton(label: "Garantir Ingresso", onPressed: (){})
                ],
              ),
            ),
          ),
          //===============================================================================

          //Line-up com artistas (Criar uma linha com os icones de perfil dos artistas envolvidos)
          //===============================================================================
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 20),
            child: Column(
              children: [
                Padding(
                  padding: EdgeInsets.only(top: 10, right: 294, bottom: 15),
                  child: Text(
                    "Line-up",
                    style: GoogleFonts.inter(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 20,
                    ),
                  ),
                ),

                //Lista de line-ups
                LineupIndicator(),

                Padding(
                  padding: EdgeInsets.only(top: 15, right: 220, bottom: 10),
                  child: Text(
                    "Sobre o Evento",
                    style: GoogleFonts.inter(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 20,
                    ),
                  ),
                ),
                Padding(
                  padding: EdgeInsets.only(top: 1, right: 217, bottom: 30),
                  child: Text(
                    "Informações importantes",
                    style: GoogleFonts.inter(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                ),
              ],
            ),
          ),

          //===============================================================================

          //Sobre o evento (Caixa de descrições ajustavel ao tamanho da descrição)
          //===============================================================================
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 20),
            child: Column(
              children: [
                SizedBox(
                  width: double.infinity,
                  child: Text(
                    widget.eventModel.informacoes,
                    textAlign: TextAlign.left,
                    style: GoogleFonts.inter(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                ),
              ],
            ),
          ),
          //===============================================================================

          //const SizedBox(height: 30),

          //Localização e link pro maps
          //===============================================================================
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 20),
            child: Column(
              children: [
                Padding(
                  padding: EdgeInsets.only(top: 30, right: 220, bottom: 10),
                  child: Text(
                    "Sobre o Evento",
                    style: GoogleFonts.inter(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 20,
                    ),
                  ),
                ),
                ////////////////////////////////////////////////////////////
  
                //exemplo de mapa (ta ruim pra pora! arumar depois)
                SizedBox(
                  height: 150,
                  child: FlutterMap(
                    options: MapOptions(
                      initialCenter: LatLng(
                        -23.4205,
                        -51.9333,
                      ), // coordenadas do evento
                      initialZoom: 15,
                    ),
                    children: [
                      TileLayer(
                        urlTemplate:
                            'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                      ),
                      MarkerLayer(
                        markers: [
                          Marker(
                            point: LatLng(-23.4205, -51.9333),
                            child: Icon(
                              Icons.location_pin,
                              color: Colors.red,
                              size: 40,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),


                /////////////////////////////////////////////////////////////
                Padding(
                  padding: EdgeInsets.only(top: 1, right: 217, bottom: 30),
                  child: Text(
                    widget.eventModel.localizacao,
                    style: GoogleFonts.inter(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                ),
              ],
            ),
          ),
          //===============================================================================
          SizedBox(height: 40),
        ],
      ),
    );
  }
}
