import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MasterService } from 'src/app/app.service';

@Component({
  selector: 'app-vote-component',
  templateUrl: './vote-component.component.html',
  styleUrls: ['./vote-component.component.scss']
})
export class VoteComponent implements OnInit {
  public pollOptions: string[];
  public pollTitle: string;
  public voteValue: string;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  
  constructor(private masterService: MasterService) { }

  ngOnInit(): void {
    this.setPollOptions();
    this.setPollTitle();
  }

  public setSelectedOption(selectedOption: string): void {
    this.masterService.setSelectedVoteValue(selectedOption);
  }

  private setPollOptions(): void {
    this.masterService.pollOptions$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      (pollOptions: string[]) => {
        if (!pollOptions) {
          this.voteValue = '';
        }

        this.pollOptions = pollOptions;
    })
  }

  private setPollTitle(): void {
    this.masterService.title$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      (pollTitle: string) => {
        this.pollTitle = pollTitle;
    })
  }
}
