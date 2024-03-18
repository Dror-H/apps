import 'package:json_annotation/json_annotation.dart';

part 'min-daily-budget.g.dart';

@JsonSerializable()
class MinDailyBudget {
  int minDailyBudgetImp;
  int minDailyBudgetLowFreq;
  int minDailyBudgetHighFreq;
  int minDailyBudgetVideoViews;

  MinDailyBudget(
      {required this.minDailyBudgetImp,
      required this.minDailyBudgetLowFreq,
      required this.minDailyBudgetHighFreq,
      required this.minDailyBudgetVideoViews});

  factory MinDailyBudget.fromJson(Map<String, dynamic> json) =>
      _$MinDailyBudgetFromJson(json);

  Map<String, dynamic> toJson() => _$MinDailyBudgetToJson(this);

  @override
  String toString() {
    return 'MinDailyBudget{minDailyBudgetImp: $minDailyBudgetImp, minDailyBudgetLowFreq: $minDailyBudgetLowFreq, minDailyBudgetHighFreq: $minDailyBudgetHighFreq, minDailyBudgetVideoViews: $minDailyBudgetVideoViews}';
  }
}
