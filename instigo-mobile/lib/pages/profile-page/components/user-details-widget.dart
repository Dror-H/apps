import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_translate/flutter_translate.dart';
import 'package:instigo_mobile/global/circle-image.dart';
import 'package:instigo_mobile/notifiers/user-notifier.dart';
import 'package:instigo_mobile/pages/profile-page/components/subscription-widget.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

class UserDetailsWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Consumer<UserNotifier>(
            builder: (context, userNotifier, child) => CircleImage(
                imageUrl: /*userNotifier.user!.pictureUrl*/ null,
                imageRadius: 100)),
        Consumer<UserNotifier>(
            builder: (context, userNotifier, child) => Text(
                '${userNotifier.user!.fullName}',
                style: Theme.of(context).textTheme.headline3)),
        Consumer<UserNotifier>(
            builder: (context, userNotifier, child) =>
                Text('${userNotifier.user!.roles[0]}')),
        Container(
          margin: EdgeInsets.only(top: 10),
          child: IntrinsicHeight(
              child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(translate('settings.user.last_login'),
                    style: Theme.of(context).textTheme.bodyText1),
                Consumer<UserNotifier>(
                    builder: (context, userNotifier, child) => Text(
                        DateFormat("dd/MM/yyyy")
                            .format(userNotifier.user!.updatedAt))),
              ]),
              const VerticalDivider(
                  thickness: 1, indent: 0, endIndent: 2, width: 30),
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(translate('settings.user.member_since'),
                    style: Theme.of(context).textTheme.bodyText1),
                Consumer<UserNotifier>(
                    builder: (context, userNotifier, child) => Text(
                        DateFormat("dd/MM/yyyy")
                            .format(userNotifier.user!.createdAt)))
              ]),
            ],
          )),
        ),
        Container(
            margin: EdgeInsets.only(top: 10, bottom: 10),
            child: SubscriptionWidget())
      ],
    );
  }
}
