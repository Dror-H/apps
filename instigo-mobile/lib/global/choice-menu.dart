import 'package:flutter/material.dart';
import 'package:flutter_translate/flutter_translate.dart';

class Choice {
  Choice(
      {required this.title,
      required this.icon,
      required this.id,
      required this.callback});

  final IconData icon;
  final String title;
  final String id;
  final Function(BuildContext context) callback;
}

List<Choice> homePageChoices = <Choice>[
  Choice(
      id: 'SETTINGS',
      icon: Icons.settings,
      title: 'settings.settings',
      callback: (BuildContext context) {
        Navigator.pushNamed(
          context,
          '/settings',
        );
      }),
];

class ChoiceCard extends StatelessWidget {
  const ChoiceCard({Key? key, required this.choice}) : super(key: key);

  final Choice choice;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.center,
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children: <Widget>[
        Icon(
          choice.icon,
          size: 25.0,
          color: Theme.of(context).iconTheme.color,
        ),
        Text(translate(choice.title),
            style: Theme.of(context).textTheme.bodyText1),
      ],
    );
  }
}
