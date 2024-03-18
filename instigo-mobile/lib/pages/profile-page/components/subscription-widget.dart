import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_translate/flutter_translate.dart';
import 'package:instigo_mobile/global/themes.dart';
import 'package:instigo_mobile/notifiers/user-notifier.dart';
import 'package:provider/provider.dart';

class SubscriptionWidget extends StatelessWidget {
  const SubscriptionWidget();

  Color getSpecificColor(BuildContext context, bool userStatus) {
    if (userStatus) {
      return successColor;
    }
    return Theme.of(context).errorColor;
  }

  String activeOrInactive(BuildContext context, bool userStatus) {
    return userStatus ? 'active' : 'inactive';
  }

  Container getPlan(BuildContext context, bool userStatus) {
    return Container(
        padding: EdgeInsets.fromLTRB(4, 2, 4, 5),
        decoration: BoxDecoration(
          color: getSpecificColor(context, userStatus),
          borderRadius: BorderRadius.circular(4),
        ),
        child: Center(
            child: Text(
                translate(
                    'settings.user.${activeOrInactive(context, userStatus)}'),
                style: TextStyle(color: Colors.white))));
  }

  @override
  Widget build(BuildContext context) {
    return Row(mainAxisAlignment: MainAxisAlignment.center, children: [
      Text('Premium plan', style: Theme.of(context).textTheme.headline6),
      VerticalDivider(),
      Consumer<UserNotifier>(
          builder: (context, userNotifier, child) =>
              getPlan(context, userNotifier.user!.subscriptionStatus))
    ]);
  }
}
