import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CullingGamesBoardComponent } from './culling-games-board.component';

describe('CullingGamesBoardComponent', () => {
  let component: CullingGamesBoardComponent;
  let fixture: ComponentFixture<CullingGamesBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CullingGamesBoardComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CullingGamesBoardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
