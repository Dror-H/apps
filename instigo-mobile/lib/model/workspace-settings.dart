import 'package:json_annotation/json_annotation.dart';

part 'workspace-settings.g.dart';

@JsonSerializable()
class WorkspaceSettings {
  String? defaultWorkspace;
  String? defaultCurrency;

  WorkspaceSettings({this.defaultWorkspace, this.defaultCurrency});

  factory WorkspaceSettings.fromJson(Map<String, dynamic> json) =>
      _$WorkspaceSettingsFromJson(json);

  Map<String, dynamic> toJson() => _$WorkspaceSettingsToJson(this);

  @override
  String toString() {
    return 'WorkspaceSettings{defaultWorkspace: $defaultWorkspace, defaultCurrency: $defaultCurrency}';
  }
}
