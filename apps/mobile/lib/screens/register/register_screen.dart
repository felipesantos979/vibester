import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/screens/register/email_confirm_screen.dart';
import 'package:mobile/utils/colors.dart';
import 'package:mobile/widgets/buttons/primary_button.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(colorDarkGrey),
      body: Form(
        key: _formKey,
        child: SingleChildScrollView(
          child: Column(
            children: [
              Center(
                child: SizedBox(
                  width: 130,
                  height: 265,
                  child: Image.asset('assets/img/mascote/mascote.png'),
                ),
              ),

              Text(
                'Criar conta',
                style: GoogleFonts.inter(
                  color: Colors.white,
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text(
                'Preencha seus dados para começar',
                style: GoogleFonts.inter(color: Color(colorGrey)),
              ),

              SizedBox(height: 15),

              Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.only(right: 280, bottom: 10),
                    child: Text(
                      'USUÁRIO',
                      style: GoogleFonts.inter(
                        color: Color(colorGrey),
                        fontWeight: FontWeight.bold,
                        fontSize: 10,
                      ),
                    ),
                  ),
                  SizedBox(
                    width: 350,
                    child: TextFormField(
                      textInputAction: TextInputAction.next,
                      style: TextStyle(color: Colors.white),
                      cursorColor: Color(colorAmbar),
                      decoration: InputDecoration(
                        filled: true,
                        fillColor: Color(0xFF141414),
                        prefixIcon: Icon(Icons.person),
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
                      keyboardType: TextInputType.emailAddress,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Informe seu nome de usuário!';
                        }
                        return null;
                      },
                    ),
                  ),
                ],
              ),

              SizedBox(height: 10),

              Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.only(right: 280, bottom: 10),
                    child: Text(
                      'E-MAIL',
                      style: GoogleFonts.inter(
                        color: Color(colorGrey),
                        fontWeight: FontWeight.bold,
                        fontSize: 10,
                      ),
                    ),
                  ),
                  SizedBox(
                    width: 350,
                    child: TextFormField(
                      textInputAction: TextInputAction.next,
                      style: TextStyle(color: Colors.white),
                      cursorColor: Color(colorAmbar),
                      decoration: InputDecoration(
                        filled: true,
                        fillColor: Color(0xFF141414),
                        prefixIcon: Icon(Icons.email_outlined),
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
                      keyboardType: TextInputType.emailAddress,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Informe seu email!';
                        }
                        return null;
                      },
                    ),
                  ),
                ],
              ),

              SizedBox(height: 12),

              Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.only(right: 290, bottom: 10),
                    child: Text(
                      'SENHA',
                      style: GoogleFonts.inter(
                        color: Color(colorGrey),
                        fontWeight: FontWeight.bold,
                        fontSize: 10,
                      ),
                    ),
                  ),
                  SizedBox(
                    width: 350,
                    child: TextFormField(
                      textInputAction: TextInputAction.done,
                      obscureText: true,
                      style: TextStyle(color: Colors.white),
                      cursorColor: Color(colorAmbar),
                      decoration: InputDecoration(
                        filled: true,
                        fillColor: Color(0xFF141414),
                        prefixIcon: Icon(Icons.email_outlined),
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
                          return 'Informe uma senha!';
                        }
                        return null;
                      },
                    ),
                  ),
                ],
              ),

              Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.only(top: 50),
                    child: SizedBox(
                      width: 350,
                      height: 50,
                      child: PrimaryButton(
                        label: 'Entrar',
                        onPressed: () {
                          if (!_formKey.currentState!.validate()) return;
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => EmailConfirmScreen(),
                            ),
                          );
                        },
                      ),
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
