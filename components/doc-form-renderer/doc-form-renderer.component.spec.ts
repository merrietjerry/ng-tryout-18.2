import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocFormRendererComponent } from './doc-form-renderer.component';

describe('DocFormRendererComponent', () => {
  let component: DocFormRendererComponent;
  let fixture: ComponentFixture<DocFormRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocFormRendererComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocFormRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
