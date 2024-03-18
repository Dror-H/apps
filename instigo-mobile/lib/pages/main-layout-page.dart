import 'package:flutter/material.dart';
import 'package:instigo_mobile/pages/profile-page/profile-page.dart';

import 'home-page/home-page.dart';

class MainLayoutWidget extends StatefulWidget {
  const MainLayoutWidget({Key? key}) : super(key: key);

  @override
  State<MainLayoutWidget> createState() => _MainLayoutWidgetState();
}

class _MainLayoutWidgetState extends State<MainLayoutWidget> {
  int _selectedIndex = 0;
  static const TextStyle optionStyle =
      TextStyle(fontSize: 30, fontWeight: FontWeight.bold);
  List<Widget> _widgetOptions = <Widget>[
    new HomePage(),
    Center(
        child: Text(
      'Campaigns',
      style: optionStyle,
    )),
    Center(
        child: Text(
      'Workspaces',
      style: optionStyle,
    )),
    new ProfilePage()
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _widgetOptions.elementAt(_selectedIndex),
      bottomNavigationBar: BottomNavigationBar(
        items: <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.business),
            label: 'Campaigns',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.school),
            label: 'Workspaces',
          ),
          BottomNavigationBarItem(
            icon: Icon(
              Icons.account_circle,
            ),
            label: 'Profile',
          ),
        ],
        currentIndex: _selectedIndex,
        selectedItemColor: Theme.of(context).colorScheme.secondary,
        unselectedItemColor: Theme.of(context).primaryIconTheme.color,
        onTap: _onItemTapped,
      ),
    );
  }
}
