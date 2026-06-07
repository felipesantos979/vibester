import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/providers/events/events_list_provider.dart';
import 'package:mobile/providers/place/place_list_provider.dart';
import 'package:mobile/screens/home/initial_screen.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'package:provider/provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await initializeDateFormatting('pt_BR', null);
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => PlaceListProvider()),
        ChangeNotifierProvider(create: (_) => EventsListProvider()),
      ],
      child: MaterialApp(
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          textTheme: GoogleFonts.interTextTheme(),
          fontFamily: GoogleFonts.inter().fontFamily,
        ),
        home: InitialScreen(),
      ),
    );
  }
}
