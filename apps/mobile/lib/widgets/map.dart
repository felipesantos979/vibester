import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:mobile/utils/colors.dart';

class Map extends StatefulWidget {
  final double latitude;
  final double longitude;
  final String localizacao;

  const Map({
    super.key,
    required this.latitude,
    required this.longitude,
    required this.localizacao,
  });

  @override
  State<Map> createState() => _MapState();
}

class _MapState extends State<Map> {
  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(16),
      child: SizedBox(
        height: 130,
        child: Stack(
          children: [

            FlutterMap(
              options: MapOptions(
                initialCenter: LatLng(widget.latitude, widget.longitude),
                initialZoom: 15,
                interactionOptions: const InteractionOptions(
                  flags: InteractiveFlag.none,
                ),
              ),
              children: [
                TileLayer(
                  urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                ),
                MarkerLayer(
                  markers: [
                    Marker(
                      point: LatLng(widget.latitude, widget.longitude),
                      child: const Icon(
                        Icons.location_pin,
                        color: Colors.red,
                        size: 40,
                      ),
                    ),
                  ],
                ),
              ],
            ),

            Positioned.fill(
              child: DecoratedBox(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      Colors.transparent,
                      Colors.black.withAlpha(200),
                    ],
                  ),
                ),
              ),
            ),

            Positioned(
              bottom: 14,
              left: 16,
              right: 16,
              child: Row(
                children: [
                  const Icon(Icons.location_on, color: Color(colorAmbar), size: 16),
                  const SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      widget.localizacao,
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 13,
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
            ),

          ],
        ),
      ),
    );
  }
}