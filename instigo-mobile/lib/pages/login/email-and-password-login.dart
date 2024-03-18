import 'dart:convert';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_easyloading/flutter_easyloading.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_translate/flutter_translate.dart';
import 'package:http/http.dart' as http;
import 'package:instigo_mobile/global/buttons.dart';
import 'package:instigo_mobile/global/utils.dart';

class EmailAndPasswordLogin extends StatefulWidget {
  EmailAndPasswordLogin(this.onSignIn);

  final onSignIn;

  @override
  State<StatefulWidget> createState() => EmailAndPasswordLoginState(onSignIn);
}

class EmailAndPasswordLoginState extends State<EmailAndPasswordLogin> {
  EmailAndPasswordLoginState(this.onSignIn);

  final onSignIn;
  final _formKey = GlobalKey<FormState>();
  final storage = FlutterSecureStorage();

  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  Future<String?> attemptLogIn(String email, String password) async {
    EasyLoading.show(status: translate('global.loading'));

    var res = await http.post(
        Uri.parse("${dotenv.env['BACKEND_URL']}/server/auth/signin"),
        body: {"email": email, "password": password});
    EasyLoading.dismiss();
    if (res.statusCode >= 202) {
      return jsonDecode(res.body)['token'];
    }
    return null;
  }

  void onPressed(BuildContext context) async {
    if (_formKey.currentState!.validate()) {
      var jwt =
          await attemptLogIn(_emailController.text, _passwordController.text);
      if (jwt != null) {
        storage.write(key: "jwt", value: jwt);
        return onSignIn();
      }

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(translate('login.loginError'))),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Form(
        key: _formKey,
        child: Column(children: [
          Container(
            padding: EdgeInsets.symmetric(horizontal: 30),
            child: TextFormField(
              controller: _emailController,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return translate('login.requiredError');
                }
                if (value.length < 3) {
                  return translate('login.minLength') + '3';
                }
                if (!emailRegex.hasMatch(value)) {
                  return translate('login.emailError');
                }
                return null;
              },
              decoration:
                  InputDecoration(labelText: translate('login.username')),
            ),
          ),
          Container(
              padding: EdgeInsets.symmetric(horizontal: 30),
              child: TextFormField(
                controller: _passwordController,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return translate('login.requiredError');
                  }
                  if (value.length < 3) {
                    return translate('login.minLength') + '3';
                  }
                  return null;
                },
                obscureText: true,
                decoration:
                    InputDecoration(labelText: translate('login.password')),
              )),
          allWidthButton(
              translate('login.signIn'), context, () => onPressed(context)),
        ]));
  }
}
