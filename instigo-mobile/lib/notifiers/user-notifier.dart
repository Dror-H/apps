import 'package:flutter/cupertino.dart';
import 'package:instigo_mobile/model/user.dart';

class UserNotifier extends ChangeNotifier {
  User? _user;

  UserNotifier() {
    notifyListeners();
  }

  User? get user => _user;

  void setUser(User user) {
    this._user = user;
    notifyListeners();
  }
}
