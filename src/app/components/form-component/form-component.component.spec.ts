import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MasterService } from 'src/app/app.service';

import { FormComponent } from './form-component.component';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let masterService: MasterService;

  const fb = new FormBuilder();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormComponent ],
      providers: [
        { provide: FormBuilder, useValue: fb }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    masterService = TestBed.inject(MasterService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should create the initial form', () => {
    const initialForm = component.getInitialForm();
    expect(initialForm.value.pollOptions.length).toEqual(2);
  });

  it('the initial form values should be empty', () => {
    const initialForm = component.getInitialForm();
    const formLength = initialForm.value.pollOptions.length;
    const firstFormValue = initialForm.value.pollOptions[0].option;
    const lastFormValue = initialForm.value.pollOptions[formLength-1].option;

    expect(firstFormValue).toEqual("");
    expect(lastFormValue).toEqual("");
  });

  it('it should get the poll options value', () => {
    component.pollOptionsForm = component.getInitialForm();
    const expectedResult = 
    [
      {
        "option": ""
      },
      {
        "option": ""
      }
    ]
    expect(component.pollOptionsValue.value).toEqual(expectedResult);
  });


  it('it should add an additional option', () => {
    component.pollOptionsForm = component.getInitialForm();
    const expectedResult = 
    [
      {
        "option": ""
      },
      {
        "option": ""
      },
      {
        "option": ""
      }
    ]

    component.addVoteOption();
    expect(component.pollOptionsValue.value).toEqual(expectedResult);

  });


  it('it should not add an additional option when there are 10 options', () => {
    component.pollOptionsForm = component.getInitialForm();
    component.addVoteOption();
    component.addVoteOption();
    component.addVoteOption();
    component.addVoteOption();
    component.addVoteOption();
    component.addVoteOption();
    component.addVoteOption();
    component.addVoteOption();

    component.addVoteOption();
    expect(component.pollOptionsValue.value.length).toEqual(10);

  });

  it('it should remove the poll option value at given index', () => {
    component.pollOptionsForm = component.getInitialForm();
    component.addVoteOption();
    component.addVoteOption();

    const expectedResult = 
    [
      {
        "option": ""
      },
      {
        "option": ""
      },
      {
        "option": ""
      }
    ]

    component.removeVoteOption(3);
    expect(component.pollOptionsValue.value).toEqual(expectedResult);
    expect(component.pollOptionsValue.value.length).toEqual(3);

  });

  it('it should only remove the poll option value if there are more than 2 options', () => {
    component.pollOptionsForm = component.getInitialForm();
    const expectedResult = 
    [
      {
        "option": ""
      },
      {
        "option": ""
      }
    ]

    component.removeVoteOption(0);
    expect(component.pollOptionsValue.value).toEqual(expectedResult);
    expect(component.pollOptionsValue.value.length).toEqual(2);
  });

  it('it should reset the form', () => {
    const initialForm = component.getInitialForm();
    const formLength = initialForm.value.pollOptions.length;
    initialForm.value.pollOptions[0].option = "One"
    initialForm.value.pollOptions[formLength-1].option = "Two"

    const expectedResult = 
    [
      {
        "option": "One"
      },
      {
        "option": "Two"
      }
    ]

    expect(component.pollOptionsValue.value).toEqual(expectedResult);

    component.addVoteOption();

    const expectedResultAfterAddition = 
    [
      {
        "option": "One"
      },
      {
        "option": "Two"
      },
      {
        "option": ""
      }
    ]

    expect(component.pollOptionsValue.value).toEqual(expectedResultAfterAddition);
    initialForm.value.pollOptions[2].option = "Three"
    
    const expectedResultAfterSecondAddition = 
    [
      {
        "option": "One"
      },
      {
        "option": "Two"
      },
      {
        "option": "Three"
      }
    ]

    expect(component.pollOptionsValue.value).toEqual(expectedResultAfterSecondAddition);

    component.resetForm()

    const resettedFormValue = 
    [
      {
        "option": null
      },
      {
        "option": null
      }
    ]

    expect(component.pollOptionsValue.value).toEqual(resettedFormValue);
  });


  it('the should make the initial question form', () => {
    expect(component.questionFormValue.value).toEqual('');

    component.questionForm.setValue({"question": "Balraj"});

    expect(component.questionFormValue.value).toEqual('Balraj');
  });

  it('it should update the question form after a value has been inserted', () => {
    component.questionForm.setValue({"question": "What is the value of PI"});

    expect(component.questionFormValue.value).toEqual('What is the value of PI');
  });

  it('it should reset the question form', () => {
    component.questionForm.setValue({"question": "What is the value of PI"});

    expect(component.questionFormValue.value).toEqual('What is the value of PI');

    component.resetForm()

    expect(component.questionFormValue.value).toEqual(null);
  });
});