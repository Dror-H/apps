import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ThemeNotifier extends ChangeNotifier {
  ThemeMode _themeMode = ThemeMode.dark;

  set themeMode(isDarkMode) {
    this._themeMode = isDarkMode ? ThemeMode.dark : ThemeMode.light;
  }

  ThemeMode get themeMode => _themeMode;

  bool get isDarkMode => _themeMode == ThemeMode.dark;

  ThemeNotifier() {
    SharedPreferences.getInstance().then((prefs) {
      this.themeMode = prefs.getBool("isDarkTheme") ?? false;
      notifyListeners();
    });
  }

  void setTheme(bool isDarkMode) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    themeMode = isDarkMode;
    prefs.setBool("isDarkTheme", isDarkMode);
    notifyListeners();
  }
}
