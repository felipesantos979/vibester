import 'package:flutter/material.dart';
import 'package:mobile/screens/home/home_screen.dart';
import 'package:mobile/utils/colors.dart';
import 'package:mobile/utils/divider.dart';

class NewPublicationScreen extends StatefulWidget {
  const NewPublicationScreen({super.key});

  @override
  State<NewPublicationScreen> createState() => _NewPublicationScreenState();
}

class _NewPublicationScreenState extends State<NewPublicationScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(colorNoturno),
      body: ListView(
        children: [
          Container(padding: const EdgeInsets.all(10)),

          Container(
            width: double.infinity,
            margin: EdgeInsets.only(top: 5, bottom: 20, left: 30, right: 30),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Nova Publicação",
                  style: TextStyle(
                    color: Color(colorAmbar),
                    fontSize: 30,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                SizedBox(height: 8),
                Text(
                  "Compartilhe seu momento",
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),

          MyDivider(height: 1, width: double.infinity),

          Container(
            width: double.infinity,
            margin: EdgeInsets.only(top: 15, bottom: 10, left: 30, right: 30),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(
                      Icons.image_outlined,
                      color: Color(colorAmbar),
                      size: 24,
                    ),
                    Text(
                      "Imagens",
                      style: TextStyle(
                        color: Color(colorAmbar),
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          Container(
            height: 180,
            width: double.infinity,
            margin: EdgeInsets.only(top: 0, bottom: 10, left: 30, right: 30),
            decoration: BoxDecoration(
              color: Color(colorDarkGrey),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Color(colorAmbar), width: 1),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Icon(
                  Icons.file_upload_outlined,
                  color: Color(colorAmbar),
                  size: 55,
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      "Clique para adicionar",
                      style: TextStyle(
                        color: Color(colorAmbar),
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      " ou arraste",
                      style: TextStyle(
                        color: Colors.white54,
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                Text(
                  "Imagens/Videos",
                  style: TextStyle(
                    color: Colors.white54,
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),

          Container(
            width: double.infinity,
            margin: EdgeInsets.only(top: 15, bottom: 10, left: 30, right: 30),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Descrição",
                  style: TextStyle(
                    color: Color(colorAmbar),
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),

          Padding(
            padding: EdgeInsets.only(top: 0, bottom: 10, left: 30, right: 30),
            child: TextFormField(
              style: TextStyle(color: Colors.white),
              cursorColor: Color(colorAmbar),
              maxLines: 5,
              decoration: InputDecoration(
                hintText: "No que você está pensando?",
                hintStyle: TextStyle(color: Colors.white54),
                filled: true,
                fillColor: Color(colorDarkGrey),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: BorderSide(color: Color(colorAmbar)),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: BorderSide(color: Color(colorAmbar), width: 1),
                ),
              ),
            ),
          ),

          Container(
            width: double.infinity,
            margin: EdgeInsets.only(top: 15, bottom: 10, left: 30, right: 30),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(
                      Icons.place_outlined,
                      color: Color(colorAmbar),
                      size: 24,
                    ),
                    Text(
                      "Onde Estou",
                      style: TextStyle(
                        color: Color(colorAmbar),
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          Padding(
            padding: EdgeInsets.only(top: 0, bottom: 20, left: 30, right: 30),
            child: TextFormField(
              style: TextStyle(color: Colors.white),
              cursorColor: Color(colorAmbar),
              decoration: InputDecoration(
                hintText: "Adicionar localização",
                hintStyle: TextStyle(color: Colors.white54),
                filled: true,
                fillColor: Color(colorDarkGrey),
                prefixIcon: Icon(
                  Icons.place_outlined,
                  color: Color(colorAmbar),
                ),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: BorderSide(color: Color(colorAmbar)),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: BorderSide(color: Color(colorAmbar), width: 1),
                ),
              ),
            ),
          ),

          Row(
            children: [
              Container(
                height: 60,
                width: 150,
                margin: EdgeInsets.only(top: 5, bottom: 0, left: 30, right: 15),
                decoration: BoxDecoration(
                  color: Color(colorDarkGrey),
                  borderRadius: BorderRadius.circular(30),
                  border: Border.all(color: Color(colorAmbar), width: 0),
                ),
                child: Material(
                  color: Colors.transparent,
                  borderRadius: BorderRadius.circular(30),
                  child: InkWell(
                    onTap: () {
                      Navigator.pop(
                        context,
                        MaterialPageRoute(builder: (context) => HomeScreen()),
                      );
                    },
                    borderRadius: BorderRadius.circular(30),
                    splashColor: Color(colorAmbar),
                    child: Center(
                      child: Text(
                        "Cancelar",
                        style: TextStyle(
                          color: Color(colorAmbar),
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                ),
              ),
              Container(
                height: 60,
                width: 150,
                margin: EdgeInsets.only(top: 5, bottom: 0, left: 15, right: 30),
                decoration: BoxDecoration(
                  color: Color(colorAmbar),
                  borderRadius: BorderRadius.circular(30),
                  border: Border.all(color: Color(colorNoturno), width: 1),
                ),
                child: Material(
                  color: Colors.transparent,
                  borderRadius: BorderRadius.circular(30),
                  child: InkWell(
                    onTap: () {},
                    borderRadius: BorderRadius.circular(30),
                    splashColor: Color(colorNoturno),
                    child: Center(
                      child: Text(
                        "Publicar",
                        style: TextStyle(
                          color: Color(colorNoturno),
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
