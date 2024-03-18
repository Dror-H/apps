// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'billing-information.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

BillingInformation _$BillingInformationFromJson(Map<String, dynamic> json) =>
    BillingInformation(
      firstName: json['firstName'] as String,
      lastName: json['lastName'] as String,
      address: json['address'] as String,
      zipCode: json['zipCode'] as String,
      country: json['country'] as String,
      vatNumber: json['vatNumber'] as String,
      type: json['type'] as String,
      companyName: json['companyName'] as String,
    );

Map<String, dynamic> _$BillingInformationToJson(BillingInformation instance) =>
    <String, dynamic>{
      'firstName': instance.firstName,
      'lastName': instance.lastName,
      'address': instance.address,
      'zipCode': instance.zipCode,
      'country': instance.country,
      'vatNumber': instance.vatNumber,
      'type': instance.type,
      'companyName': instance.companyName,
    };
