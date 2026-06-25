import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/providers/user/user_provider.dart';
import 'package:mobile/routes/app_routes.dart';
import 'package:mobile/service/user/user_service.dart';
import 'package:mobile/utils/colors.dart';
import 'package:mobile/utils/date_picker_field.dart';
import 'package:mobile/widgets/buttons/primary_button.dart';
import 'package:provider/provider.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final TextEditingController _nomeController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _senhaController = TextEditingController();
  DateTime? _dataNascimento;

  final _formKey = GlobalKey<FormState>();
  final _userService = UserService();
  bool _isLoading = false;

  @override
  void dispose() {
    _nomeController.dispose();
    _emailController.dispose();
    _senhaController.dispose();
    super.dispose();
  }

  Future<void> _criarConta() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    final nomeDigitado = _nomeController.text.trim();
    final usernameFormatado = '@${nomeDigitado.replaceAll(' ', '')}';
    final email = _emailController.text.trim();
    final senha = _senhaController.text;
    final bornAtIso = _dataNascimento!.toUtc().toIso8601String();

    try {
      final novoUsuario = await _userService.register(
        name: nomeDigitado,
        username: usernameFormatado,
        email: email,
        password: senha,
        bornAt: bornAtIso,
      );

      final token = await _userService.login(email: email, password: senha);

      //tem q fazer a parte de guardar token de login, deixa pra depois por enquanto kkkk

      if (!mounted) return;
      context.read<UserProvider>().setUser(novoUsuario);

      Navigator.pushNamed(context, AppRoutes.emailConfirm);
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Não foi possível criar a conta. Tente novamente.'),
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

              const SizedBox(height: 15),

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
                      controller: _nomeController,

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
                ],
              ),

              const SizedBox(height: 10),

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
                      controller: _emailController,

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

              const SizedBox(height: 12),
              Padding(
                padding: const EdgeInsets.only(right: 211, bottom: 10),
                child: Column(
                  children: [
                    Text(
                      'DATA DE NASCIMENTO',
                      style: GoogleFonts.inter(
                        color: Color(colorGrey),
                        fontWeight: FontWeight.bold,
                        fontSize: 10,
                      ),
                    ),
                  ],
                ),
              ),
              DatePickerField(
                labelText: 'Data de Nascimento',
                height: 60,

                onDateSelected: (data) {
                  _dataNascimento = data;
                },

                validator: (value) {
                  if (value == null) {
                    return 'Informe sua data de nascimento!';
                  }
                  return null;
                },
              ),

              const SizedBox(height: 12),

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
                          return 'Informe uma senha!';
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

              const SizedBox(height: 50),

              SizedBox(
                width: 350,
                height: 50,
                child: PrimaryButton(
                  label: _isLoading ? 'Criando conta...' : 'Entrar',
                  onPressed: _isLoading ? () {} : _criarConta,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
