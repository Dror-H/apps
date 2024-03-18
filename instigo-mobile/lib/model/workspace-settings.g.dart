// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'workspace-settings.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

WorkspaceSettings _$WorkspaceSettingsFromJson(Map<String, dynamic> json) =>
    WorkspaceSettings(
      defaultWorkspace: json['defaultWorkspace'] as String?,
      defaultCurrency: json['defaultCurrency'] as String?,
    );

Map<String, dynamic> _$WorkspaceSettingsToJson(WorkspaceSettings instance) =>
    <String, dynamic>{
      'defaultWorkspace': instance.defaultWorkspace,
      'defaultCurrency': instance.defaultCurrency,
    };
