import 'package:flutter/material.dart';
import 'package:instigo_mobile/global/themes.dart';
import 'package:instigo_mobile/pages/login/email-and-password-login.dart';

class LoginPage extends StatelessWidget {
  LoginPage({Key? key, this.onSignIn}) : super(key: key);
  final onSignIn;

  Column _configureLayout(BuildContext context) {
    return Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          Container(
            margin: EdgeInsets.only(bottom: 10),
            width: 150,
            child: Themes.getLogoAccordingToTheme(context),
          ),
          EmailAndPasswordLogin(onSignIn)
        ]);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: SafeArea(child: Center(child: _configureLayout(context))));
  }
}
