// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'workspace.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Workspace _$WorkspaceFromJson(Map<String, dynamic> json) => Workspace(
      id: json['id'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
      version: json['version'] as int,
      name: json['name'] as String,
      description: json['description'] as String,
      disabled: json['disabled'] as bool,
      settings:
          WorkspaceSettings.fromJson(json['settings'] as Map<String, dynamic>),
      lastSynced: DateTime.parse(json['lastSynced'] as String),
    )..adAccounts = (json['adAccounts'] as List<dynamic>?)
        ?.map((e) => AdAccount.fromJson(e as Map<String, dynamic>))
        .toList();

Map<String, dynamic> _$WorkspaceToJson(Workspace instance) => <String, dynamic>{
      'id': instance.id,
      'createdAt': instance.createdAt.toIso8601String(),
      'updatedAt': instance.updatedAt.toIso8601String(),
      'version': instance.version,
      'name': instance.name,
      'description': instance.description,
      'disabled': instance.disabled,
      'settings': instance.settings,
      'lastSynced': instance.lastSynced.toIso8601String(),
      'adAccounts': instance.adAccounts,
    };
