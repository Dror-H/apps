import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_translate/flutter_translate.dart';
import 'package:instigo_mobile/global/themes.dart';
import 'package:instigo_mobile/pages/activity-page.dart';
import 'package:instigo_mobile/pages/root-page.dart';
import 'package:instigo_mobile/utils/logging.dart';
import 'package:instigo_mobile/utils/translate.dart';
import 'package:provider/provider.dart';

import 'notifiers/theme-notifier.dart';
import 'notifiers/user-notifier.dart';

Future<void> main() async {
  setupLogging();
  var delegate = await LocalizationDelegate.create(
      fallbackLocale: 'de',
      supportedLocales: ['en', 'de'],
      basePath: 'assets/i18n/',
      preferences: TranslatePreferences());

  await dotenv.load(fileName: ".env");
  runApp(MultiProvider(providers: [
    ChangeNotifierProvider<ThemeNotifier>(create: (_) => ThemeNotifier()),
    ChangeNotifierProvider<UserNotifier>(create: (_) => UserNotifier()),
  ], child: LocalizedApp(delegate, Instigo())));
}

class Instigo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    var localizationDelegate = LocalizedApp.of(context).delegate;

    return MaterialApp(
      title: 'Instigo',
      localizationsDelegates: [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        localizationDelegate
      ],
      supportedLocales: localizationDelegate.supportedLocales,
      locale: localizationDelegate.currentLocale,
      themeMode: Provider.of<ThemeNotifier>(context).themeMode,
      darkTheme: Themes.darkTheme,
      theme: Themes.lightTheme,
      routes: {
        '/': (context) => RootPage(),
        '/activity': (context) => ActivityPage(),
      },
      builder: EasyLoading.init(),
    );
  }
}
