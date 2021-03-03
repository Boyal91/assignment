import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MasterService } from 'src/app/app.service';

@Component({
  selector: 'app-form-component',
  templateUrl: './form-component.component.html',
  styleUrls: ['./form-component.component.scss']
})
export class FormComponent implements OnInit {
  public pollOptionsForm: FormGroup;
  public questionForm: FormGroup;

  private initialFormValue = this.fb.array([ this.createItem(),  this.createItem()]);
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private fb: FormBuilder, private masterService: MasterService) { }

  ngOnInit(): void {
    this.pollOptionsForm = this.getInitialForm();
    this.questionForm = this.fb.group({
      question: [''],
    })
    
    this.listenToVoteFormChanges();
    this.listenToQuestionFormChanges()
  }

  get pollOptionsValue() {
    return this.pollOptionsForm.get('pollOptions') as FormArray;
  }

  get questionFormValue() {
    return this.questionForm.get('question') as FormControl;
  }

  public addVoteOption(): void {
    const voteForm = this.fb.group({
      option: ['', Validators.required]
    })

    if(this.pollOptionsValue.length < 10) {

      this.pollOptionsValue.push(voteForm);
    }
  }

  public removeVoteOption(i: number): void {
    if(this.pollOptionsValue.length > 2) {
      this.pollOptionsValue.removeAt(i);
    }
  }

  public resetForm() {
    const formLength = this.pollOptionsValue?.length;

    for(let i = 0; i < formLength - 1; i++){
      this.pollOptionsValue.removeAt(formLength - i);
    }

    this.pollOptionsValue.reset();
    this.questionFormValue.reset();
    this.masterService.reset();
  }

  public getInitialForm(): FormGroup {
    return this.fb.group({
      pollOptions: this.initialFormValue,
    })
  }

  private createItem(): FormGroup {
    return this.fb.group({
      option: ['', Validators.required],
    });
  }

  private filterEmptyEntries(val: string[] | []): string[] | [] {
    return val.filter((value) => value !=="" && value !== null);
  }

  private listenToVoteFormChanges(): void {
    this.pollOptionsValue.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe( (pollOptionsValue) => {
      let outputVal: string[] = [];

      pollOptionsValue.map( (val: {option: string}) => {
        outputVal.push(val.option);
      })

      const filteredFormValues = this.filterEmptyEntries(outputVal);
      if(filteredFormValues.length > 1) {
        this.masterService.setPollOptions(filteredFormValues);
      }
    })
  }

  private listenToQuestionFormChanges(): void {
    this.questionFormValue.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe( (pollTitle) => {
      this.masterService.setTitle(pollTitle);
    })
  }
}