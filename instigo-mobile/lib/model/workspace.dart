import 'package:instigo_mobile/model/workspace-settings.dart';
import 'package:json_annotation/json_annotation.dart';

import 'ad-account.dart';

part 'workspace.g.dart';

@JsonSerializable()
class Workspace {
  String id;
  DateTime createdAt;
  DateTime updatedAt;
  int version;
  String name;
  String description;
  bool disabled;
  WorkspaceSettings settings;
  DateTime lastSynced;
  List<AdAccount>? adAccounts;

  Workspace(
      {required this.id,
      required this.createdAt,
      required this.updatedAt,
      required this.version,
      required this.name,
      required this.description,
      required this.disabled,
      required this.settings,
      required this.lastSynced});

  factory Workspace.fromJson(Map<String, dynamic> json) =>
      _$WorkspaceFromJson(json);

  Map<String, dynamic> toJson() => _$WorkspaceToJson(this);

  @override
  String toString() {
    return 'Workspace{id: $id, createdAt: $createdAt, updatedAt: $updatedAt, version: $version, name: $name, description: $description, disabled: $disabled, settings: $settings, lastSynced: $lastSynced, adAccounts: $adAccounts}';
  }
}
