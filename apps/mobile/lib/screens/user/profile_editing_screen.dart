import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/routes/app_routes.dart';
import 'package:mobile/utils/colors.dart';
import 'package:mobile/utils/date_picker_field.dart';
import 'package:mobile/widgets/cards/users/editing_avatar.dart';
import 'package:mobile/widgets/buttons/primary_button.dart';
import 'package:mobile/widgets/text-field/primary_text_field.dart';

class ProfileEditingScreen extends StatefulWidget {
  const ProfileEditingScreen({super.key});

  @override
  State<ProfileEditingScreen> createState() => _ProfileEditingScreenState();
}

class _ProfileEditingScreenState extends State<ProfileEditingScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(colorDarkGrey),
      appBar: AppBar(
        title: Text('Informações pessoais'),
        backgroundColor: Color(colorDarkGrey),
        foregroundColor: Colors.white,
        titleTextStyle: GoogleFonts.inter(fontSize: 20),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            Center(heightFactor: 2, child: EditableAvatar()),
            PrimaryTextField(
              labelText: 'Nome',
              height: 60,
              textInputAction: TextInputAction.done,
            ),
            SizedBox(height: 25),
            DatePickerField(labelText: 'Data de Nascimento', height: 60),
            SizedBox(height: 25),
            PrimaryTextField(
              labelText: 'Nome de usuário',
              height: 60,
              textInputAction: TextInputAction.next,
            ),
            SizedBox(height: 25),
            PrimaryTextField(
              labelText: 'Bio',
              height: 90,
              textInputAction: TextInputAction.done,
            ),
            SizedBox(height: 25),
            PrimaryButton(
              label: 'Cadastrar',
              onPressed: () {
                Navigator.pushNamed(context, AppRoutes.userInterests);
              },
            ),
          ],
        ),
      ),
    );
  }
}
