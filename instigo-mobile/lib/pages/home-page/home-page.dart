import 'package:flutter/material.dart';
import 'package:flutter_translate/flutter_translate.dart';
import 'package:instigo_mobile/global/themes.dart';
import 'package:instigo_mobile/notifiers/user-notifier.dart';
import 'package:provider/provider.dart';

import 'components/ad-account-pie-chart.dart';

class HomePage extends StatelessWidget {
  HomePage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          actions: <Widget>[
            IconButton(
              icon: const Icon(Icons.add_alert),
              onPressed: () {
                Navigator.pushNamed(
                  context,
                  '/activity',
                );
              },
            )
          ],
          title: Container(
            width: 150,
            child: Themes.getLogoAccordingToTheme(context),
          ),
        ),
        body: ListView(children: <Widget>[
          Consumer<UserNotifier>(
              builder: (context, userNotifier, child) => Center(
                  child: Text('Welcome ${userNotifier.user!.firstName}'))),
          Container(
              padding: EdgeInsets.all(20),
              child: Card(
                  child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                    Container(child: AdAccountDoughnutChart()),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: <Widget>[
                        TextButton(
                          child: Text(translate('home.manage')),
                          onPressed: () {},
                        ),
                        const SizedBox(width: 8),
                      ],
                    ),
                  ]))),
        ]));
  }
}
