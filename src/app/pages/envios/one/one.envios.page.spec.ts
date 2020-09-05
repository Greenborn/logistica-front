import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OneEnviosPage } from './one.envios.page';

describe('OneEnviosPage', () => {
  let component: OneEnviosPage;
  let fixture: ComponentFixture<OneEnviosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneEnviosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OneEnviosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
