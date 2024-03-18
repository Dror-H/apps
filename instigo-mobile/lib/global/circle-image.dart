import 'package:flutter/material.dart';
import 'package:instigo_mobile/global/themes.dart';

class CircleImage extends StatelessWidget {
  const CircleImage({
    Key? key,
    this.imageUrl,
    this.imageRadius = 20,
  }) : super(key: key);

  final double imageRadius;
  final String? imageUrl;

  ImageProvider getImage() {
    if (imageUrl != null) {
      return NetworkImage(imageUrl!);
    }
    return AssetImage('assets/images/profile.png');
  }

  @override
  Widget build(BuildContext context) {
    return CircleAvatar(
      backgroundColor: Theme.of(context).primaryIconTheme.color,
      radius: imageRadius,
      child: CircleAvatar(
        radius: imageRadius - 5,
        backgroundImage: getImage(),
      ),
    );
  }
}
