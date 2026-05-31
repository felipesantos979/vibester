import 'package:flutter/material.dart';
import 'package:mobile/utils/colors.dart';

class IWillGoScreen extends StatefulWidget {
  const IWillGoScreen({super.key});

  @override
  State<IWillGoScreen> createState() => _IWillGoScreenState();
}

class _IWillGoScreenState extends State<IWillGoScreen> {
  @override
  Widget build(BuildContext context) {
    return Container(
      color: Color(colorNoturno),
      child: Column(
        children: [
          Container(
            margin: const EdgeInsets.all(100),
            child: Text(
              "Em obras...",
              style: TextStyle(
                fontSize: 22,
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
