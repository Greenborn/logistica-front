import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AllEnviosPage } from './all.envios.page';

describe('AllEnviosPage', () => {
  let component: AllEnviosPage;
  let fixture: ComponentFixture<AllEnviosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllEnviosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AllEnviosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
