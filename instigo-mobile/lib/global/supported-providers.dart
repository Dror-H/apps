import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class SupportedProviders {
  String id;
  String name;
  Color color;
  Icon? icon;

  SupportedProviders(
    this.id,
    this.name,
    this.color,
    this.icon,
  );
}

Color linkedinColor = Color(0xff0e76a8);
Color facebookColor = Color(0xff4267B2);

var providersMap = {
  'linkedin':
      new SupportedProviders('Linkedin', 'LinkedIn', linkedinColor, null),
  'facebook':
      new SupportedProviders('Facebook', 'Facebook', facebookColor, null)
};
