import 'package:instigo_mobile/model/workspace-settings.dart';
import 'package:instigo_mobile/model/workspace.dart';
import 'package:json_annotation/json_annotation.dart';

import 'billing-information.dart';

part 'user.g.dart';

@JsonSerializable()
class User {
  String id;
  String? username;
  String firstName;
  String lastName;
  String fullName;
  String email;
  String? phone;
  bool isActive;
  DateTime createdAt;
  DateTime updatedAt;
  int version;
  bool emailVerification;
  String? pictureUrl;
  dynamic onboarding;
  List<String> roles;
  String? stripeCustomerId;
  String? stripeSubscriptionId;
  bool subscriptionStatus;
  BillingInformation? billing;
  WorkspaceSettings? settings;
  @JsonKey(name: 'ownedWorkspace')
  List<Workspace>? ownedWorkspaces;
  List<Workspace>? assignedWorkspaces;

  User(
      {required this.id,
      required this.firstName,
      required this.lastName,
      required this.fullName,
      required this.version,
      required this.email,
      required this.isActive,
      required this.createdAt,
      required this.updatedAt,
      required this.emailVerification,
      required this.onboarding,
      required this.roles,
      required this.subscriptionStatus,
      this.username,
      this.billing,
      this.settings,
      this.stripeCustomerId,
      this.stripeSubscriptionId,
      this.phone,
      this.pictureUrl,
      this.ownedWorkspaces,
      this.assignedWorkspaces});

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);

  Map<String, dynamic> toJson() => _$UserToJson(this);

  @override
  String toString() {
    return 'User{id: $id, username: $username, firstName: $firstName, lastName: $lastName, fullName: $fullName, email: $email, phone: $phone, isActive: $isActive, createdAt: $createdAt, updatedAt: $updatedAt, version: $version, emailVerification: $emailVerification, pictureUrl: $pictureUrl, onboarding: $onboarding, roles: $roles, stripeCustomerId: $stripeCustomerId, stripeSubscriptionId: $stripeSubscriptionId, subscriptionStatus: $subscriptionStatus, billing: $billing, settings: $settings, ownedWorkspaces: $ownedWorkspaces, assignedWorkspaces: $assignedWorkspaces}';
  }
}
