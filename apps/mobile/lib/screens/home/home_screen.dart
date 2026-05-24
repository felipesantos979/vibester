import 'package:flutter/material.dart';
import 'package:mobile/screens/home/home_tab.dart';
import 'package:mobile/utils/colors.dart';
import 'package:mobile/widgets/navbar/custom_navbar.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = [
    HomeTab(),
    Center(
      child: Text('Busca', style: TextStyle(color: Colors.white)),
    ),
    Center(
      child: Text('Favoritos', style: TextStyle(color: Colors.white)),
    ),
    Center(
      child: Text('Perfil', style: TextStyle(color: Colors.white)),
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(colorNoturno),
      extendBody: true,
      body: _screens[_currentIndex],
      bottomNavigationBar: CustomNavbar(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
      ),
    );
  }
}
