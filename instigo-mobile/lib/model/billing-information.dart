import 'package:json_annotation/json_annotation.dart';

part 'billing-information.g.dart';

@JsonSerializable()
class BillingInformation {
  String firstName;
  String lastName;
  String address;
  String zipCode;
  String country;
  String vatNumber;
  String type;
  String companyName;

  BillingInformation(
      {required this.firstName,
      required this.lastName,
      required this.address,
      required this.zipCode,
      required this.country,
      required this.vatNumber,
      required this.type,
      required this.companyName});

  factory BillingInformation.fromJson(Map<String, dynamic> json) =>
      _$BillingInformationFromJson(json);

  Map<String, dynamic> toJson() => _$BillingInformationToJson(this);

  @override
  String toString() {
    return 'BillingInformation{firstName: $firstName, lastName: $lastName, address: $address, zipCode: $zipCode, country: $country, vatNumber: $vatNumber, type: $type, companyName: $companyName}';
  }
}
