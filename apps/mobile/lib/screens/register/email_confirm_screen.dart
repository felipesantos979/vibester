import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/routes/app_routes.dart';
import 'package:mobile/utils/colors.dart';
import 'package:mobile/widgets/buttons/primary_button.dart';
import 'package:pinput/pinput.dart';

class EmailConfirmScreen extends StatefulWidget {
  final VoidCallback? onEmailConfirmed;
  const EmailConfirmScreen({this.onEmailConfirmed, super.key});

  @override
  State<EmailConfirmScreen> createState() => _EmailConfirmScreenState();
}

class _EmailConfirmScreenState extends State<EmailConfirmScreen> {
  bool _pinError = false;
  final _pinController = TextEditingController();
  void _aoVerificar() {
    if (!context.mounted) return;

    if (widget.onEmailConfirmed != null) {
      widget.onEmailConfirmed!();
    } else {
      Navigator.pushNamed(context, AppRoutes.profileEditing);
    }
  }

  @override
  void dispose() {
    _pinController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final defaultTheme = PinTheme(
      width: 56,
      height: 56,
      textStyle: GoogleFonts.inter(
        fontSize: 20,
        fontWeight: FontWeight.w600,
        color: Color(colorAmbar),
      ),
      decoration: BoxDecoration(
        color: Color(colorAmbar).withOpacity(0.05),
        border: Border.all(
          color: Color(colorAmbar).withOpacity(0.3),
          width: 1.5,
        ),
        borderRadius: BorderRadius.circular(12),
      ),
    );

    final focusedTheme = defaultTheme.copyWith(
      decoration: defaultTheme.decoration!.copyWith(
        border: Border.all(color: Color(colorAmbar), width: 2),
        color: Color(colorAmbar).withOpacity(0.08),
        boxShadow: [
          BoxShadow(
            color: Color(colorAmbar).withOpacity(0.25),
            blurRadius: 8,
            spreadRadius: 1,
          ),
        ],
      ),
    );

    final errorTheme = defaultTheme.copyWith(
      decoration: defaultTheme.decoration!.copyWith(
        border: Border.all(color: Colors.red, width: 2),
        color: Colors.red.withOpacity(0.08),
        boxShadow: [
          BoxShadow(
            color: Colors.red.withOpacity(0.25),
            blurRadius: 8,
            spreadRadius: 1,
          ),
        ],
      ),
    );

    return Scaffold(
      backgroundColor: Color(colorDarkGrey),
      body: SingleChildScrollView(
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
              'Verifique seu email',
              style: GoogleFonts.inter(
                color: Colors.white,
                fontSize: 32,
                fontWeight: FontWeight.bold,
              ),
            ),
            RichText(
              textAlign: TextAlign.center,
              text: TextSpan(
                style: GoogleFonts.inter(color: Color(colorGrey), fontSize: 14),
                children: [
                  TextSpan(
                    text: 'Enviamos um código de verificação para\n',
                    style: GoogleFonts.inter(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: Color(colorGrey),
                    ),
                  ),
                  TextSpan(
                    text: 'email@example.com',
                    style: GoogleFonts.inter(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: Colors.orange,
                    ),
                  ),
                  TextSpan(
                    text:
                        '\n\nVerifique sua caixa de entrada e insira o\ncódigo abaixo para ativar sua conta ',
                  ),
                ],
              ),
            ),

            SizedBox(height: 30),

            Pinput(
              length: 5,
              defaultPinTheme: defaultTheme,
              focusedPinTheme: focusedTheme,
              errorPinTheme: errorTheme,
              controller: _pinController,
              forceErrorState: _pinError,
            ),

            SizedBox(height: 50),

            PrimaryButton(
              label: 'Verificar e-mail',
              onPressed: () {
                if (_pinController.text.length < 5) {
                  setState(() => _pinError = true);
                  return;
                }
                setState(() => _pinError = false);
                _aoVerificar();
              },
            ),

            SizedBox(height: 12),
          ],
        ),
      ),
    );
  }
}
