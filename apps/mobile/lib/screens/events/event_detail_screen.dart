import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/models/event/event_model.dart';
import 'package:mobile/providers/events/events_list_provider.dart';
import 'package:mobile/utils/app_progress_indicator.dart';
import 'package:mobile/widgets/cards/users/map_event.dart';
import 'package:mobile/widgets/indicators/lineup_indicator.dart';
import 'package:mobile/widgets/buttons/secundary_button.dart';
import 'package:mobile/widgets/buttons/tertiary_button.dart';
import 'package:provider/provider.dart';
import '../../utils/colors.dart';
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
    final provider = Provider.of<EventsListProvider>(context);
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
                Positioned.fill(
                  child: Container(
                    foregroundDecoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [
                          Colors.transparent,
                          Color(colorNoturno).withAlpha(255),
                        ],
                      ),
                    ),

                    //lugar da imagem
                    child: CachedNetworkImage(
                      imageUrl: widget.eventModel.imageUrl,
                      fit: BoxFit.cover,
                      fadeInDuration: Duration.zero,
                      fadeOutDuration: Duration.zero,
                      placeholder: (_, _) =>
                          const Center(child: AppProgressIndicator()),
                      errorWidget: (_, _, _) => const Icon(Icons.error),
                    ),
                  ),
                ),

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
                        color: Color(colorAmbar),
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

                //Titulo do evento e Tipo de evento
                Positioned(
                  left: 16,
                  right: 16,
                  bottom: 2,

                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 10,
                            vertical: 5,
                          ),

                          decoration: BoxDecoration(
                            color: const Color(colorDarkGrey).withOpacity(0.4),
                            borderRadius: BorderRadius.circular(30),
                            border: Border.all(
                              color: const Color(colorAmbar),
                              width: 1.5,
                            ),
                          ),

                          child: Text(
                            widget.eventModel.categoria,
                            style: GoogleFonts.inter(
                              color: const Color(colorAmbar),
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

                      Container(
                        width: double.infinity,
                        child: FittedBox(
                          fit: BoxFit.scaleDown,
                          alignment: Alignment.centerLeft,
                          child: Text(
                            widget.eventModel.titulo,
                            style: GoogleFonts.inter(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                              fontSize: 41,

                              //possivel sombra (teste)
                              shadows: [
                                Shadow(color: Colors.white, blurRadius: 4),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ],
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

                      // Linha divisória
                      Container(width: 1, height: 40, color: Colors.white12),

                      Expanded(
                        child: Padding(
                          padding: const EdgeInsets.only(left: 20),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'LOCAL',
                                style: GoogleFonts.inter(
                                  color: Color(colorGrey),
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 6),
                              Text(
                                widget.eventModel.localizacao,
                                style: GoogleFonts.inter(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                ),
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ],
                          ),
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
                TertiaryButton(
                  label: "VOU IR",
                  state: widget.eventModel.isFavorite
                      ? ButtonState.success
                      : ButtonState.idle,
                  onPressed: () {
                    provider.toggleFavorite(widget.eventModel.titulo);
                  },
                ),

                //Espaçamento entre itens
                const SizedBox(height: 16),

                //Botão de "GARANTIR INGRESSO" (add função posteriormente)
                SecundaryButton(
                  label: "GARANTIR INGRESSO",
                  icon: Icons.local_activity,
                  onPressed: () {},
                ),
              ],
            ),
          ),

          //===============================================================================
          const SizedBox(height: 20),

          //Line-up com artistas (Criar uma linha com os icones de perfil dos artistas envolvidos)
          //===============================================================================
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 20),
            child: Column(
              children: [
                Align(
                  alignment: Alignment.centerLeft,
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
                const SizedBox(height: 10),
                LineupIndicator(lineup: widget.eventModel.lineUp),
                const SizedBox(height: 10),

                Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    "Sobre o Evento",
                    style: GoogleFonts.inter(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 20,
                    ),
                  ),
                ),
                const SizedBox(height: 10),
                Align(
                  alignment: Alignment.centerLeft,
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
          const SizedBox(height: 20),

          //Sobre o evento (Caixa de descrições ajustavel ao tamanho da descrição)
          //===============================================================================
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 20),
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

          //===============================================================================
          const SizedBox(height: 30),

          //Localização e link pro maps
          //===============================================================================
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 20),
            child: Column(
              children: [
                Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    "Localização",
                    style: GoogleFonts.inter(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 20,
                    ),
                  ),
                ),

                const SizedBox(height: 10),

                MapEvent(endereco: widget.eventModel.localizacao),

                const SizedBox(height: 8),

                Align(
                  alignment: Alignment.centerLeft,
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
