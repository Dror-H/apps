import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_translate/flutter_translate.dart';

import 'components/settings-widget.dart';
import 'components/user-details-widget.dart';

class ProfilePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(title: Text(translate('settings.profile'))),
        body:
            ListView(padding: EdgeInsets.all(24), shrinkWrap: true, children: [
          UserDetailsWidget(),
          const Divider(
            height: 20,
            thickness: 1,
            indent: 20,
            endIndent: 20,
          ),
          SettingsWidget()
        ]));
  }
}
