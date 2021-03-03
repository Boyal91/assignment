import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MasterService {
  public pollOptions$: Subject<string[]> = new Subject();
  public selectedVoteValue$: Subject<string> = new Subject();
  public title$: Subject<string> = new Subject();

  public setPollOptions(val: string[]): void {
      this.pollOptions$.next(val);
  }

  public setSelectedVoteValue(val: string): void {
    this.selectedVoteValue$.next(val);
}

  public setTitle(val: string): void {
    this.title$.next(val);
  }

  public reset(): void {
    this.pollOptions$.next();
    this.selectedVoteValue$.next();
    this.title$.next();
  }
}
