import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampoAtividadesFlexiveisComponent } from './campo-atividades-flexiveis.component';

describe('CampoAtividadesFlexiveis', () => {
  let component: CampoAtividadesFlexiveisComponent;
  let fixture: ComponentFixture<CampoAtividadesFlexiveisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampoAtividadesFlexiveisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampoAtividadesFlexiveisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
