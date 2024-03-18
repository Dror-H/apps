import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:instigo_mobile/notifiers/theme-notifier.dart';
import 'package:provider/provider.dart';

var primaryColorDark = const Color(0xff080f48);
var accentColorLight = const Color(0xff5f63f2);
var textThemeLight = const Color(0xff34343e);
var bottomNavigation = const Color(0xff7f7f90);
var textThemeDark = const Color(0xfff1f1ff);

var successColor = const Color(0xff7dd321);

class Themes {
  static TextTheme lightTextTheme = TextTheme(
    bodyText1: GoogleFonts.openSans(
      fontSize: 14.0,
      fontWeight: FontWeight.w700,
      color: textThemeLight,
    ),
    bodyText2: GoogleFonts.openSans(
      fontSize: 12.0,
      fontWeight: FontWeight.w400,
      color: textThemeLight,
    ),
    button: GoogleFonts.openSans(
      //used for login button
      fontSize: 16.0,
      fontWeight: FontWeight.w700,
      color: textThemeDark,
    ),
    headline1: GoogleFonts.openSans(
      fontSize: 32.0,
      fontWeight: FontWeight.bold,
      color: textThemeLight,
    ),
    headline2: GoogleFonts.openSans(
      fontSize: 21.0,
      fontWeight: FontWeight.w700,
      color: textThemeLight,
    ),
    headline3: GoogleFonts.openSans(
      fontSize: 20.0,
      fontWeight: FontWeight.w600,
      color: textThemeLight,
    ),
    headline6: GoogleFonts.openSans(
      fontSize: 16.0,
      fontWeight: FontWeight.w600,
      color: textThemeLight,
    ),
  );

  static TextTheme darkTextTheme = TextTheme(
    bodyText1: GoogleFonts.openSans(
      fontSize: 14.0,
      fontWeight: FontWeight.w700,
      color: textThemeDark,
    ),
    bodyText2: GoogleFonts.openSans(
      fontSize: 12.0,
      fontWeight: FontWeight.w400,
      color: textThemeDark,
    ),
    button: GoogleFonts.openSans(
      //used for login button
      fontSize: 16.0,
      fontWeight: FontWeight.w700,
      color: textThemeDark,
    ),
    headline1: GoogleFonts.openSans(
      fontSize: 32.0,
      fontWeight: FontWeight.bold,
      color: textThemeDark,
    ),
    headline2: GoogleFonts.openSans(
      fontSize: 21.0,
      fontWeight: FontWeight.w700,
      color: textThemeDark,
    ),
    headline3: GoogleFonts.openSans(
      fontSize: 20.0,
      fontWeight: FontWeight.w600,
      color: textThemeDark,
    ),
    headline6: GoogleFonts.openSans(
      fontSize: 16.0,
      fontWeight: FontWeight.w600,
      color: textThemeDark,
    ),
  );

  static final darkTheme = ThemeData(
      brightness: Brightness.dark,
      primaryColor: primaryColorDark,
      iconTheme: new IconThemeData(color: textThemeDark),
      primaryIconTheme: new IconThemeData(color: textThemeDark),
      accentColor: accentColorLight,
      colorScheme: ColorScheme.dark().copyWith(
          secondary: accentColorLight, secondaryVariant: accentColorLight),
      textTheme: darkTextTheme);

  static final lightTheme = ThemeData(
      brightness: Brightness.light,
      primaryColor: accentColorLight,
      iconTheme: new IconThemeData(color: textThemeLight),
      primaryIconTheme: new IconThemeData(color: bottomNavigation),
      colorScheme: ColorScheme.light().copyWith(secondary: primaryColorDark),
      textTheme: lightTextTheme);

  static Image getLogoAccordingToTheme(BuildContext context) {
    return Provider.of<ThemeNotifier>(context).isDarkMode
        ? Image.asset('assets/icons/logo-title-white.png')
        : Image.asset('assets/icons/logo-title.png');
  }
}
