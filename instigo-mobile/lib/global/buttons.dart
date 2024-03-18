import 'package:flutter/material.dart';
import 'package:flutter_signin_button/flutter_signin_button.dart';

allWidthButton(String text, BuildContext context, Function() callback) {
  return Row(
    children: [
      Expanded(
          child: Container(
              padding: EdgeInsets.symmetric(horizontal: 10),
              margin: EdgeInsets.only(top: 20),
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                    primary: Theme.of(context).primaryColor),
                onPressed: callback,
                child: Text(text, style: Theme.of(context).textTheme.button),
              ))),
    ],
  );
}

allWidthSocialButton(String socialApp, void Function() callback) {
  return Row(
    children: [
      Expanded(
          child: Container(
              padding: EdgeInsets.symmetric(horizontal: 10),
              child: SignInButton(
                socialApp == 'Facebook' ? Buttons.Facebook : Buttons.Google,
                text: "Sign in with $socialApp",
                onPressed: callback,
              ))),
    ],
  );
}
