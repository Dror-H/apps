import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_translate/flutter_translate.dart';
import 'package:instigo_mobile/api/result.dart';
import 'package:instigo_mobile/api/user-service.dart';
import 'package:instigo_mobile/notifiers/user-notifier.dart';
import 'package:provider/provider.dart';

import 'main-layout-page.dart';

class SplashScreen extends StatelessWidget {
  Future<void> _setUser(BuildContext context) async {
    final result = await UserService.create().getMe();
    if (result.body is Success) {
      print((result.body as Success).value.toString());
      Provider.of<UserNotifier>(context, listen: false)
          .setUser((result.body as Success).value);
    }
  }

  FutureBuilder _futureBuild(
      Future future, BuildContext context, Widget successContent) {
    return FutureBuilder(
      future: future,
      builder: (BuildContext context, AsyncSnapshot<dynamic> snapshot) {
        if (snapshot.connectionState == ConnectionState.done) {
          if (snapshot.error != null) {
            return Center(
              child: Text(translate('global.error')),
            );
          }
          return successContent;
        } else {
          return const Center(
            child: CircularProgressIndicator(),
          );
        }
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return _futureBuild(_setUser(context), context, new MainLayoutWidget());
  }
}
