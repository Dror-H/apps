// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

User _$UserFromJson(Map<String, dynamic> json) => User(
      id: json['id'] as String,
      firstName: json['firstName'] as String,
      lastName: json['lastName'] as String,
      fullName: json['fullName'] as String,
      version: json['version'] as int,
      email: json['email'] as String,
      isActive: json['isActive'] as bool,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      emailVerification: json['emailVerification'] as bool,
      onboarding: json['onboarding'],
      roles: (json['roles'] as List<dynamic>).map((e) => e as String).toList(),
      subscriptionStatus: json['subscriptionStatus'] as bool,
      username: json['username'] as String?,
      billing: json['billing'] == null
          ? null
          : BillingInformation.fromJson(
              json['billing'] as Map<String, dynamic>),
      settings: json['settings'] == null
          ? null
          : WorkspaceSettings.fromJson(
              json['settings'] as Map<String, dynamic>),
      stripeCustomerId: json['stripeCustomerId'] as String?,
      stripeSubscriptionId: json['stripeSubscriptionId'] as String?,
      phone: json['phone'] as String?,
      pictureUrl: json['pictureUrl'] as String?,
      ownedWorkspaces: (json['ownedWorkspace'] as List<dynamic>?)
          ?.map((e) => Workspace.fromJson(e as Map<String, dynamic>))
          .toList(),
      assignedWorkspaces: (json['assignedWorkspaces'] as List<dynamic>?)
          ?.map((e) => Workspace.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$UserToJson(User instance) => <String, dynamic>{
      'id': instance.id,
      'username': instance.username,
      'firstName': instance.firstName,
      'lastName': instance.lastName,
      'fullName': instance.fullName,
      'email': instance.email,
      'phone': instance.phone,
      'isActive': instance.isActive,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
      'version': instance.version,
      'emailVerification': instance.emailVerification,
      'pictureUrl': instance.pictureUrl,
      'onboarding': instance.onboarding,
      'roles': instance.roles,
      'stripeCustomerId': instance.stripeCustomerId,
      'stripeSubscriptionId': instance.stripeSubscriptionId,
      'subscriptionStatus': instance.subscriptionStatus,
      'billing': instance.billing,
      'settings': instance.settings,
      'ownedWorkspace': instance.ownedWorkspaces,
      'assignedWorkspaces': instance.assignedWorkspaces,
    };
