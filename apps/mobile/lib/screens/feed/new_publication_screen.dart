import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/utils/colors.dart';
import 'package:mobile/utils/location_picker.dart';
import 'package:mobile/utils/location_picker_tile.dart';
import 'package:mobile/widgets/cards/feed/post_photo_picker.dart';
import 'package:mobile/widgets/text-field/caption_text_field.dart';

class NewPublicationScreen extends StatefulWidget {
  const NewPublicationScreen({super.key});

  @override
  State<NewPublicationScreen> createState() => _NewPublicationScreenState();
}

class _NewPublicationScreenState extends State<NewPublicationScreen> {
  final legendaController = TextEditingController();

  String? selectedLocation;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(colorNoturno),
      appBar: AppBar(
        actions: <Widget>[
          IconButton(
            icon: const Icon(Icons.add_circle, color: Color(colorAmbar)),
            onPressed: () {
              Navigator.pop(context);
            },
          ),
        ],
        title: Text(
          'Novo Post',
          style: GoogleFonts.inter(fontWeight: FontWeight.bold),
        ),
        backgroundColor: Color(colorNoturno),
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 10),
          child: Column(
            children: [
              const PostPhotoPicker(),
              const SizedBox(height: 10),

              CaptionTextField(controller: legendaController),

              const SizedBox(height: 10),

              LocationPickerTile(
                selectedLocation: selectedLocation,
                onTap: () async {
                  final location = await showModalBottomSheet<String>(
                    context: context,
                    backgroundColor: Color(colorNoturno),
                    isScrollControlled: true,
                    builder: (_) => const LocationPicker(),
                  );

                  if (location != null) {
                    setState(() {
                      selectedLocation = location;
                    });
                  }
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
