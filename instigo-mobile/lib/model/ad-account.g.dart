// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'ad-account.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AdAccount _$AdAccountFromJson(Map<String, dynamic> json) => AdAccount(
      id: json['id'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      version: json['version'] as int,
      name: json['name'] as String,
      provider: json['provider'] as String,
      providerId: json['providerId'] as String,
      status: json['status'] as String,
      disableReason: json['disableReason'] as String,
      currency: json['currency'] as String,
      businessId: json['businessId'] as String,
      businessName: json['businessName'] as String,
      businessCity: json['businessCity'] as String,
      businessStreet: json['businessStreet'] as String,
      businessCountryCode: json['businessCountryCode'] as String?,
      lastSynced: DateTime.parse(json['lastSynced'] as String),
      businessZip: json['businessZip'] as String?,
      businessStreet2: json['businessStreet2'] as String?,
      totalAmountSpent: json['totalAmountSpent'] as String?,
      businessProfilePicture: json['businessProfilePicture'] as String?,
      providerMetadata: json['providerMetadata'] as String?,
      timezoneId: json['timezoneId'] as String?,
      timezoneName: json['timezoneName'] as String?,
      timezoneOffsetHoursUtc: json['timezoneOffsetHoursUtc'] as int?,
      minDailyBudget: json['minDailyBudget'] == null
          ? null
          : MinDailyBudget.fromJson(
              json['minDailyBudget'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$AdAccountToJson(AdAccount instance) => <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
      'version': instance.version,
      'name': instance.name,
      'provider': instance.provider,
      'providerId': instance.providerId,
      'status': instance.status,
      'disableReason': instance.disableReason,
      'currency': instance.currency,
      'businessId': instance.businessId,
      'businessName': instance.businessName,
      'businessCity': instance.businessCity,
      'businessStreet': instance.businessStreet,
      'businessZip': instance.businessZip,
      'businessCountryCode': instance.businessCountryCode,
      'lastSynced': instance.lastSynced.toIso8601String(),
      'totalAmountSpent': instance.totalAmountSpent,
      'businessProfilePicture': instance.businessProfilePicture,
      'providerMetadata': instance.providerMetadata,
      'businessStreet2': instance.businessStreet2,
      'timezoneId': instance.timezoneId,
      'timezoneName': instance.timezoneName,
      'timezoneOffsetHoursUtc': instance.timezoneOffsetHoursUtc,
      'minDailyBudget': instance.minDailyBudget,
    };
