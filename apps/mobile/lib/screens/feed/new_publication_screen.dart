import 'dart:io';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/models/feed/publication_model.dart';
import 'package:mobile/models/user/user_model.dart';
import 'package:mobile/providers/feed/publication_list_provider.dart';
import 'package:mobile/providers/user/user_provider.dart';
import 'package:mobile/utils/colors.dart';
import 'package:mobile/utils/location_picker.dart';
import 'package:mobile/utils/location_picker_tile.dart';
import 'package:mobile/widgets/cards/feed/post_photo_picker.dart';
import 'package:mobile/widgets/text-field/caption_text_field.dart';
import 'package:provider/provider.dart';

class NewPublicationScreen extends StatefulWidget {
  const NewPublicationScreen({super.key});

  @override
  State<NewPublicationScreen> createState() => _NewPublicationScreenState();
}

class _NewPublicationScreenState extends State<NewPublicationScreen> {
  final _formKey = GlobalKey<FormState>();
  final legendaController = TextEditingController();
  String? selectedLocation;
  File? _publicationImage;

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<PublicationListProvider>(context);
    final UserModel? user = context.read<UserProvider>().user;
    return Scaffold(
      backgroundColor: Color(colorNoturno),
      appBar: AppBar(
        actions: <Widget>[
          IconButton(
            icon: const Icon(
              Icons.add_circle,
              color: Color(colorAmbar),
              size: 30,
            ),
            onPressed: () {
              if (!_formKey.currentState!.validate()) return;
              if (user == null) return;

              provider.addPublication(
                PublicationModel(
                  autor: user.nomeUsuario,
                  autorProfileImage: user.fotoPerfil,
                  publicationImage: _publicationImage!.path,
                  description: legendaController.text,
                  location: selectedLocation,
                  publicatedAt: DateTime.now(),
                ),
              );
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
      body: Form(
        key: _formKey,
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 10),
            child: Column(
              children: [
                PostPhotoPicker(
                  onPhotoChanged: (file) {
                    setState(() => _publicationImage = file);
                  },
                ),
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
                SizedBox(height: 20),
                SizedBox(child: Image.asset('assets/img/mascote/dica.png')),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
