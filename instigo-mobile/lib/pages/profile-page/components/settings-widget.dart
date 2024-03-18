import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_translate/flutter_translate.dart';
import 'package:instigo_mobile/notifiers/theme-notifier.dart';
import 'package:provider/provider.dart';

class SettingsWidget extends StatefulWidget {
  @override
  State<StatefulWidget> createState() => SettingsWidgetState();
}

class SettingsWidgetState extends State<SettingsWidget> {
  final storage = FlutterSecureStorage();
  var dropdownValue;

  void showDemoActionSheet(
      {required BuildContext context, required Widget child}) {
    showCupertinoModalPopup<String>(
        context: context,
        builder: (BuildContext context) => child).then((String? value) {
      if (value != null) changeLocale(context, value);
    });
  }

  void _onActionSheetPress(BuildContext context) {
    showDemoActionSheet(
      context: context,
      child: CupertinoActionSheet(
        title: Text(translate('settings.language.title')),
        message: Text(translate('settings.language.description')),
        actions: <Widget>[
          CupertinoActionSheetAction(
            child: Text(translate('settings.language.en')),
            onPressed: () => Navigator.of(context).pop('en'),
          ),
          CupertinoActionSheetAction(
            child: Text(translate('settings.language.de')),
            onPressed: () => Navigator.of(context).pop('de'),
          ),
        ],
        cancelButton: CupertinoActionSheetAction(
          child: Text(translate('settings.language.cancel')),
          isDefaultAction: true,
          onPressed: () => Navigator.of(context).pop(null),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return ListView(
      shrinkWrap: true,
      physics: NeverScrollableScrollPhysics(),
      children: [
        SwitchListTile(
          activeColor: Theme.of(context).colorScheme.secondary,
          title: Text(translate('settings.darkMode')),
          onChanged: (bool value) {
            Provider.of<ThemeNotifier>(context, listen: false).setTheme(value);
          },
          value: Provider.of<ThemeNotifier>(context).isDarkMode,
          secondary: Icon(Icons.dark_mode_rounded),
        ),
        ListTile(
          title: Text(translate('settings.chooseLanguage')),
          onTap: () => _onActionSheetPress(context),
          leading: Icon(Icons.translate),
          trailing: Icon(Icons.menu),
        ),
        ListTile(
          title: Text(translate('settings.logout')),
          onTap: () {
            this.storage.delete(key: "jwt");
            Navigator.of(context)
                .pushNamedAndRemoveUntil('/', (Route<dynamic> route) => false);
          },
          leading: Icon(Icons.logout),
        ),
      ],
    );
  }
}
