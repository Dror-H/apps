import 'package:json_annotation/json_annotation.dart';

import 'min-daily-budget.dart';

part 'ad-account.g.dart';

@JsonSerializable()
class AdAccount {
  String id;
  DateTime createdAt;
  DateTime updatedAt;
  int version;
  String name;
  String provider;
  String providerId;
  String status;
  String disableReason;
  String currency;
  String businessId;
  String businessName;
  String businessCity;
  String businessStreet;
  String? businessZip;
  String? businessCountryCode;
  DateTime lastSynced;
  String? totalAmountSpent;
  String? businessProfilePicture;
  String? providerMetadata;
  String? businessStreet2;
  String? timezoneId;
  String? timezoneName;
  int? timezoneOffsetHoursUtc;
  MinDailyBudget? minDailyBudget;

  AdAccount({
    required this.id,
    required this.createdAt,
    required this.updatedAt,
    required this.version,
    required this.name,
    required this.provider,
    required this.providerId,
    required this.status,
    required this.disableReason,
    required this.currency,
    required this.businessId,
    required this.businessName,
    required this.businessCity,
    required this.businessStreet,
    this.businessCountryCode,
    required this.lastSynced,
    this.businessZip,
    this.businessStreet2,
    this.totalAmountSpent,
    this.businessProfilePicture,
    this.providerMetadata,
    this.timezoneId,
    this.timezoneName,
    this.timezoneOffsetHoursUtc,
    this.minDailyBudget,
  });

  factory AdAccount.fromJson(Map<String, dynamic> json) =>
      _$AdAccountFromJson(json);

  Map<String, dynamic> toJson() => _$AdAccountToJson(this);

  @override
  String toString() {
    return 'AdAccount{id: $id, createdAt: $createdAt, updatedAt: $updatedAt, version: $version, name: $name, provider: $provider, providerId: $providerId, status: $status, disableReason: $disableReason, currency: $currency, businessId: $businessId, businessName: $businessName, businessCity: $businessCity, businessStreet: $businessStreet, businessZip: $businessZip, businessCountryCode: $businessCountryCode, lastSynced: $lastSynced, totalAmountSpent: $totalAmountSpent, businessProfilePicture: $businessProfilePicture, providerMetadata: $providerMetadata, businessStreet2: $businessStreet2, timezoneId: $timezoneId, timezoneName: $timezoneName, timezoneOffsetHoursUtc: $timezoneOffsetHoursUtc, minDailyBudget: $minDailyBudget}';
  }
}

String STATUS_ACTIVE = 'ACTIVE';
String LINKEDIN = 'linkedin';
String FACEBOOK = 'facebook';
