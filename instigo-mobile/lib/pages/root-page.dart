import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:instigo_mobile/pages/splash-screen.dart';

import 'login/login-page.dart';

class RootPage extends StatefulWidget {
  @override
  State<StatefulWidget> createState() => _RootPage();
}

enum AuthStatus { notSignedIn, signedIn }

class _RootPage extends State<RootPage> {
  AuthStatus _authStatus = AuthStatus.notSignedIn;
  final storage = FlutterSecureStorage();

  @override
  initState() {
    super.initState();

    storage.containsKey(key: "jwt").then((bool hasJwt) {
      print(hasJwt);
      if (hasJwt) {
        setState(() {
          _authStatus = AuthStatus.signedIn;
        });
      } else {
        setState(() {
          _authStatus = AuthStatus.notSignedIn;
        });
      }
    });
  }

  void _signIn() {
    setState(() {
      _authStatus = AuthStatus.signedIn;
    });
  }

  @override
  Widget build(BuildContext context) {
    switch (_authStatus) {
      case AuthStatus.notSignedIn:
        return new LoginPage(onSignIn: _signIn);

      case AuthStatus.signedIn:
        return new SplashScreen();
      default:
        return new LoginPage(onSignIn: _signIn);
    }
  }
}
