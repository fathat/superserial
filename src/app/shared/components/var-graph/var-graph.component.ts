import {Component, OnInit, ViewChild} from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
  ChartComponent
} from "ng-apexcharts";

const xAxisRange = 10 * 1000; // 10 seconds
const interval = 250;

interface SeriesData {
  name: string;
  data: [[number, number]];
}

@Component({
  selector: 'app-var-graph',
  templateUrl: './var-graph.component.html',
  styleUrls: ['./var-graph.component.scss']
})
export class VarGraphComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartComponent>;

  graphStart = Math.round(Date.now() / 1000) * 1000;

  updates: number = 0;

  constructor() {

    this.chartOptions = {
      chart: {
        height: 380,
        width: "100%",
        type: 'line',
        animations: {
          enabled: false,
          easing: 'linear',
          dynamicAnimation: {
            speed: 1000
          }
        },
        zoom: {
          enabled: false
        }
      },
      tooltip: {
        enabled: false
      },
      theme: {
        mode: "dark",
        palette: "palette1"
      },
      series: [
        {
          name: "empty",
          data: [[0, 0], [1000, 1]]
        }
      ],
      stroke: {
        curve: 'smooth'
      },
      xaxis: {
        type: 'datetime',
        range: xAxisRange,
        tickAmount: 10,
        labels: {
          formatter: (value, timestamp, options) => {
            return `${(((+value - this.graphStart)) / 1000).toFixed(1)}s`;
          }
        }
      }
    };
  }

  series: SeriesData[] = [];

  generateSeries() {
    return this.series;
  }

  ngOnInit(): void {

  }

  public updateSeries(name: string, val: number) {

    const s = this.series.find(x => x.name === name);
    if(s) {
      s.data.push([Date.now(), val]);
    } else {
      this.series.push({
        name,
        data: [[Date.now(), val]]
      });
    }

    this.chart.updateSeries(this.series);
  }

}
