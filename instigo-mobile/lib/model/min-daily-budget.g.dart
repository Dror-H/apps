// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'min-daily-budget.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

MinDailyBudget _$MinDailyBudgetFromJson(Map<String, dynamic> json) =>
    MinDailyBudget(
      minDailyBudgetImp: json['minDailyBudgetImp'] as int,
      minDailyBudgetLowFreq: json['minDailyBudgetLowFreq'] as int,
      minDailyBudgetHighFreq: json['minDailyBudgetHighFreq'] as int,
      minDailyBudgetVideoViews: json['minDailyBudgetVideoViews'] as int,
    );

Map<String, dynamic> _$MinDailyBudgetToJson(MinDailyBudget instance) =>
    <String, dynamic>{
      'minDailyBudgetImp': instance.minDailyBudgetImp,
      'minDailyBudgetLowFreq': instance.minDailyBudgetLowFreq,
      'minDailyBudgetHighFreq': instance.minDailyBudgetHighFreq,
      'minDailyBudgetVideoViews': instance.minDailyBudgetVideoViews,
    };
