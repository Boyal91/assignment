import { Component, OnInit } from '@angular/core';
import * as Chart from 'chart.js';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { MasterService } from 'src/app/app.service';

@Component({
  selector: 'app-graph-component',
  templateUrl: './graph-component.component.html',
  styleUrls: ['./graph-component.component.scss']
})
export class GraphComponent implements OnInit {
  public chartTitle: string;
  public pollOptions: string[];

  private voteValues: string[];
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private masterService: MasterService) { }

  ngOnInit(): void {
    this.voteValues = [];
    this.setChartTitle();
    this.listenPollOptions();
    this.listenSelectedVoteValue();
  }

  private listenSelectedVoteValue(): void {
    this.masterService.selectedVoteValue$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      (selectedVoteValue: string) => {
        if(selectedVoteValue) {
          this.voteValues.push(selectedVoteValue);
        }
        this.createChart(this.voteValues.length);
      }
    )
  }

  private listenPollOptions(): void {
    this.masterService.pollOptions$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      (pollOptions: string[]) => {
        if (!pollOptions || this.pollOptions !== pollOptions) {
          this.voteValues = [];
        }

        this.pollOptions = pollOptions;
      }
    )
  }

  private setChartTitle(): void {
    this.masterService.title$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      (chartTitle: string) => {
        this.chartTitle = chartTitle;
    })
  }

  private getPollData(): number[] {
    let data: number[] = []
    this.pollOptions?.map((option: string) => {
        const numberOfOcc: number = this.countOccurrences(this.voteValues, option);
        data.push(numberOfOcc);
    })

    return data;
  }
  
  private countOccurrences(array: string[], value: string): number {
    return array.reduce((a, v) => (v === value ? a + 1 : a), 0);
  }

  private createChart(numberOfVotes: number): void {
    var myChart = new Chart('myChart', {
      type: 'bar',
      data: {
        labels: this.pollOptions,
        datasets: [{
          label: `Total votes ${numberOfVotes}`,
          data: this.getPollData(),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        events: ['click'],
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }
}
