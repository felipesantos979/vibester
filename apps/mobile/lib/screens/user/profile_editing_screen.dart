import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/routes/app_routes.dart';
import 'package:mobile/utils/colors.dart';
import 'package:mobile/widgets/cards/users/editing_avatar.dart';
import 'package:mobile/widgets/buttons/primary_button.dart';

class ProfileEditingScreen extends StatefulWidget {
  const ProfileEditingScreen({super.key});

  @override
  State<ProfileEditingScreen> createState() => _ProfileEditingScreenState();
}

class _ProfileEditingScreenState extends State<ProfileEditingScreen> {
  final TextEditingController _nomeUsuarioController = TextEditingController();
  final TextEditingController _bioController = TextEditingController();

  final _formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    _nomeUsuarioController.dispose();
    _bioController.dispose();
    super.dispose();
  }

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
      body: Form(
        key: _formKey,
        child: SingleChildScrollView(
          child: Column(
            children: [
              Center(heightFactor: 2, child: EditableAvatar()),
              SizedBox(height: 25),

              Padding(
                padding: const EdgeInsets.only(right: 250, bottom: 10),
                child: Text(
                  'NOME DE USUÁRIO',
                  style: GoogleFonts.inter(
                    color: Color(colorGrey),
                    fontWeight: FontWeight.bold,
                    fontSize: 10,
                  ),
                ),
              ),

              SizedBox(
                width: 350,
                height: 60,
                child: TextFormField(
                  controller: _nomeUsuarioController,

                  textInputAction: TextInputAction.next,
                  style: const TextStyle(color: Colors.white),
                  cursorColor: Color(colorAmbar),

                  inputFormatters: [LengthLimitingTextInputFormatter(50)],

                  decoration: InputDecoration(
                    filled: true,
                    fillColor: const Color(0xFF141414),
                    prefixIcon: const Icon(Icons.person),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                    errorStyle: const TextStyle(
                      color: Colors.redAccent,
                      fontSize: 12,
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(18),
                      borderSide: const BorderSide(
                        color: Colors.white10,
                        width: 1.3,
                      ),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(18),
                      borderSide: const BorderSide(
                        color: Color(colorAmbar),
                        width: 1.3,
                      ),
                    ),
                    errorBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(18),
                      borderSide: const BorderSide(
                        color: Colors.redAccent,
                        width: 1.3,
                      ),
                    ),
                    focusedErrorBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(18),
                      borderSide: const BorderSide(
                        color: Colors.redAccent,
                        width: 1.3,
                      ),
                    ),
                  ),

                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Informe seu nome de usuário!';
                    }
                    return null;
                  },
                ),
              ),

              SizedBox(height: 30),

              Padding(
                padding: const EdgeInsets.only(right: 310, bottom: 10),
                child: Text(
                  'BIO',
                  style: GoogleFonts.inter(
                    color: Color(colorGrey),
                    fontWeight: FontWeight.bold,
                    fontSize: 10,
                  ),
                ),
              ),

              SizedBox(
                width: 350,
                height: 150,
                child: TextFormField(
                  controller: _bioController,

                  maxLines: null,
                  expands: true,
                  textInputAction: TextInputAction.done,
                  style: const TextStyle(color: Colors.white),
                  cursorColor: Color(colorAmbar),

                  inputFormatters: [LengthLimitingTextInputFormatter(50)],

                  decoration: InputDecoration(
                    filled: true,
                    fillColor: const Color(0xFF141414),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                    errorStyle: const TextStyle(
                      color: Colors.redAccent,
                      fontSize: 12,
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(18),
                      borderSide: const BorderSide(
                        color: Colors.white10,
                        width: 1.3,
                      ),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(18),
                      borderSide: const BorderSide(
                        color: Color(colorAmbar),
                        width: 1.3,
                      ),
                    ),
                    errorBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(18),
                      borderSide: const BorderSide(
                        color: Colors.redAccent,
                        width: 1.3,
                      ),
                    ),
                    focusedErrorBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(18),
                      borderSide: const BorderSide(
                        color: Colors.redAccent,
                        width: 1.3,
                      ),
                    ),
                  ),
                ),
              ),

              SizedBox(height: 25),

              Padding(
                padding: const EdgeInsets.only(top: 100),
                child: PrimaryButton(
                  label: 'Cadastrar',
                  onPressed: () {
                    if (!_formKey.currentState!.validate()) return;

                    Navigator.pushNamed(context, AppRoutes.userInterests);
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}