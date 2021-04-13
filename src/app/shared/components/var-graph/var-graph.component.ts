import {Component, OnInit, ViewChild} from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
  ChartComponent
} from "ng-apexcharts";

const xAxisRange = 10 * 1000; // 10 seconds
const interval = 500;

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

  graphStart = Date.now();

  constructor() {

    this.chartOptions = {
      chart: {
        height: 380,
        width: "100%",
        type: 'line',
        animations: {
          enabled: true,
          easing: 'linear',
          dynamicAnimation: {
            speed: 500
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
        tickAmount: 20,
        labels: {
          formatter: (value, timestamp, options) => {
            return `${(+value - this.graphStart)}ms`;
          }
        }
      }
    };
  }

  //data = [[Date.now(), 0]]; 
  series: SeriesData[] = [];

  generateSeries() {
    return this.series;
  }

  ngOnInit(): void {
    /*setInterval(() => {
      const now = Date.now();
      this.data.push([now, ((Math.sin(now / 1000.0) + Math.random() * 0.25) * 20 + 50) | 0]);

      //cull anything older than 20 seconds
      //this.data = this.data.filter((dat) => (now - dat[0]) < 20000);

      this.chart.updateSeries([{
        data: (this.data as any)
        
      }]);
    }, interval);*/
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

    console.log("series", this.series);
    this.chart.updateSeries(this.series, true);
  }

}
