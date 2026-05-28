import 'dart:io';
import 'package:flutter/material.dart';
import 'package:mobile/utils/colors.dart';

class ProfileAvatar extends StatelessWidget {
  final String? imageUrl;
  final VoidCallback? onTap;

  const ProfileAvatar({super.key, this.imageUrl, this.onTap});

  ImageProvider? get _imageProvider {
    if (imageUrl == null) return null;

    if (imageUrl!.startsWith('http')) return NetworkImage(imageUrl!);

    return FileImage(File(imageUrl!));
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Stack(
        children: [
          Container(
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(
                color: Colors.amberAccent.withAlpha(150),
                width: 3,
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.amberAccent.withAlpha(80),
                  blurRadius: 8,
                  spreadRadius: 2,
                ),
                BoxShadow(
                  color: Colors.amberAccent.withAlpha(40),
                  blurRadius: 20,
                  spreadRadius: 6,
                ),
              ],
            ),
            child: CircleAvatar(
              backgroundColor: Color(colorDarkGrey).withAlpha(150),
              radius: 48,
              backgroundImage: _imageProvider,
              child: _imageProvider == null
                  ? Icon(Icons.camera_alt, color: Colors.white, size: 50)
                  : null,
            ),
          ),
          Positioned(
            bottom: 0,
            right: 0,
            child: Container(
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: Colors.amberAccent.withAlpha(80),
                    blurRadius: 8,
                    spreadRadius: 2,
                  ),
                  BoxShadow(
                    color: Colors.amberAccent.withAlpha(40),
                    blurRadius: 20,
                    spreadRadius: 6,
                  ),
                ],
              ),
              child: CircleAvatar(
                radius: 48 * 0.28,
                backgroundColor: Colors.black,
                child: Icon(
                  Icons.add_circle_outlined,
                  size: 48 * 0.50,
                  color: Colors.white,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
