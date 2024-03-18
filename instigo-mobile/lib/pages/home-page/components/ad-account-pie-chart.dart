import 'package:flutter/material.dart';
import 'package:flutter_translate/flutter_translate.dart';
import 'package:instigo_mobile/global/supported-providers.dart';
import 'package:instigo_mobile/global/utils.dart';
import 'package:syncfusion_flutter_charts/charts.dart';

class AdAccountDoughnutChart extends StatefulWidget {
  const AdAccountDoughnutChart({Key? key}) : super(key: key);

  @override
  _AdAccountDoughnutChartState createState() => _AdAccountDoughnutChartState();
}

class _AdAccountDoughnutChartState extends State<AdAccountDoughnutChart> {
  _AdAccountDoughnutChartState();

  @override
  Widget build(BuildContext context) {
    return _buildDefaultDoughnutChart();
  }

  SfCircularChart _buildDefaultDoughnutChart() {
    return SfCircularChart(
      title: ChartTitle(text: translate('home.accountInfo')),
      series: _getDefaultDoughnutSeries(),
      tooltipBehavior: TooltipBehavior(enable: true),
    );
  }

  List<DoughnutSeries<ChartData, String>> _getDefaultDoughnutSeries() {
    List<ChartData> chartData = <ChartData>[
      ChartData(
          x: providersMap['facebook']!.id,
          y: 4,
          text: providersMap['facebook']!.name,
          color: providersMap['facebook']!.color),
      ChartData(
          x: providersMap['linkedin']!.id,
          y: 1,
          text: providersMap['linkedin']!.name,
          color: providersMap['linkedin']!.color),
    ];
    return <DoughnutSeries<ChartData, String>>[
      DoughnutSeries<ChartData, String>(
          radius: '80%',
          explode: true,
          explodeOffset: '10%',
          dataSource: chartData,
          xValueMapper: (ChartData data, _) => data.x as String,
          yValueMapper: (ChartData data, _) => data.y,
          dataLabelMapper: (ChartData data, _) => data.text,
          pointColorMapper: (ChartData data, _) => data.color,
          dataLabelSettings: const DataLabelSettings(isVisible: true))
    ];
  }
}
