import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class MapEvent extends StatefulWidget {
  final String endereco;
  const MapEvent({super.key, required this.endereco});

  @override
  State<MapEvent> createState() => _MapEventState();
}

class _MapEventState extends State<MapEvent> {
  @override
  Widget build(BuildContext context) {
    return Container(
      child: Card(
        margin: EdgeInsets.symmetric(horizontal: 0, vertical: 8),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        clipBehavior: Clip.antiAlias,
        child: SizedBox(
          height: 150,
          child: Stack(
            fit: StackFit.expand,
            children: [
              Image.asset('assets/img/map_fundo.png', fit: BoxFit.cover),

              Align(
                alignment: Alignment.center,
                child: GestureDetector(
                  onTap: () async {
                    String enderecoCodificado = Uri.encodeComponent(
                      widget.endereco,
                    );

                    final Uri googleMaps = Uri.parse(
                      "comgooglemaps://?q=$enderecoCodificado",
                    );

                    final Uri appleMaps = Uri.parse(
                      "maps://?q=$enderecoCodificado",
                    );

                    final Uri browser = Uri.parse(
                      "https://www.google.com/maps/search/?api=1&query=$enderecoCodificado",
                    );

                    if (await canLaunchUrl(googleMaps)) {
                      await launchUrl(googleMaps);
                    } else if (await canLaunchUrl(appleMaps)) {
                      await launchUrl(appleMaps);
                    } else {
                      await launchUrl(
                        browser,
                        mode: LaunchMode.externalApplication,
                      );
                    }
                  },

                  child: Container(
                    width: 250,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 12,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(30),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.map, color: Colors.black, size: 24),
                        SizedBox(width: 8),
                        Text(
                          "ABRIR NO MAPS",
                          style: TextStyle(
                            color: Colors.black,
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
