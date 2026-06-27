import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/models/user/user_model.dart';
import 'package:mobile/providers/user/user_provider.dart';
import 'package:mobile/routes/app_routes.dart';
import 'package:mobile/service/user/user_service.dart';
import 'package:mobile/utils/colors.dart';
import 'package:mobile/widgets/buttons/primary_button.dart';
import 'package:provider/provider.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _userService = UserService();

  final TextEditingController _emailOuUsuarioController =
      TextEditingController();
  final TextEditingController _senhaController = TextEditingController();

  bool _isLoading = false;

  @override
  void dispose() {
    _emailOuUsuarioController.dispose();
    _senhaController.dispose();
    super.dispose();
  }

  Future<void> _entrar() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    final emailOuUsuario = _emailOuUsuarioController.text.trim();
    final senha = _senhaController.text;

    try {
      final loginResponse = await _userService.login(
        emailOuUsername: emailOuUsuario,
        password: senha,
      );

      //tem q fazer a parte de guardar token de login, deixa pra depois por enquanto kkkk
      final token = loginResponse['token'];
      final accountId = loginResponse['accountId'];

      final usuarioLogado = UserModel.fromLoginJson(loginResponse);

      if (!mounted) return;
      context.read<UserProvider>().setUser(usuarioLogado);

      Navigator.pushNamed(context, AppRoutes.home);
    } catch (e) {
      debugPrint(e.toString());

      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Não foi possível entrar. Verifique seus dados.'),
        ),
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

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
                  height: 300,
                  child: Image.asset('assets/img/mascote/mascote.png'),
                ),
              ),

              Text(
                'Entrar com e-mail',
                style: GoogleFonts.inter(
                  color: Colors.white,
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text(
                'Digite suas credenciais de acesso',
                style: GoogleFonts.inter(color: Color(colorGrey)),
              ),

              SizedBox(height: 30),

              Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.only(right: 220, bottom: 10),
                    child: Text(
                      'E-MAIL OU USUÁRIO',
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
                      controller: _emailOuUsuarioController,
                      textInputAction: TextInputAction.next,
                      style: const TextStyle(color: Colors.white),
                      cursorColor: Color(colorAmbar),
                      inputFormatters: [LengthLimitingTextInputFormatter(320)],
                      decoration: InputDecoration(
                        filled: true,
                        fillColor: const Color(0xFF141414),
                        prefixIcon: const Icon(Icons.email_outlined),
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
                          return 'Informe seu nome de usuário ou email!';
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
                      controller: _senhaController,
                      obscureText: true,
                      textInputAction: TextInputAction.done,
                      style: const TextStyle(color: Colors.white),
                      cursorColor: Color(colorAmbar),
                      inputFormatters: [LengthLimitingTextInputFormatter(20)],
                      decoration: InputDecoration(
                        filled: true,
                        fillColor: const Color(0xFF141414),
                        prefixIcon: const Icon(Icons.lock_outline),
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
                          return 'Informe sua senha!';
                        }
                        if (value.length < 8) {
                          return 'A senha deve ter pelo menos 8 caracteres!';
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
                        label: _isLoading ? 'Entrando...' : 'Entrar',
                        onPressed: _isLoading ? () {} : _entrar,
                      ),
                    ),
                  ),

                  Padding(
                    padding: const EdgeInsets.only(top: 90),
                    child: InkWell(
                      onTap: () {
                        Navigator.pushNamed(context, AppRoutes.recoverPassword);
                      },
                      child: Text(
                        'Esqueci minha senha',
                        style: GoogleFonts.inter(
                          color: Colors.red,
                          fontWeight: FontWeight.bold,
                        ),
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