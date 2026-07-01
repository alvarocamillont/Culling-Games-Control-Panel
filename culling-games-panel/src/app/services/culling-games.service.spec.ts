import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { CullingGamesService } from './culling-games.service';
import { Sorcerer } from '../models';

describe('CullingGamesService', () => {
  let service: CullingGamesService;
  let httpTestingController: HttpTestingController;

  const mockPlayers: Sorcerer[] = [
    { id: '1', name: 'Yuta Okkotsu', colony: 'Sendai Colony', technique: 'Copy', points: 190, status: 'Alive' },
    { id: '2', name: 'Hajime Kashimo', colony: 'Tokyo Colony No. 2', technique: 'Electrification', points: 200, status: 'Alive' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CullingGamesService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(CullingGamesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should load initial players from API', async () => {
    // During initialization, constructor fires GET request
    const req = httpTestingController.expectOne('/api/players');
    expect(req.request.method).toBe('GET');
    req.flush(mockPlayers);

    // Wait for the async initializeState to complete
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(service.players().length).toBe(2);
    expect(service.players()[0].name).toBe('Yuta Okkotsu');
    expect(service.totalPlayers()).toBe(2);
    expect(service.totalPoints()).toBe(390);
    expect(service.mortalityRate()).toBe(0);
  });

  it('should register a new player via API', async () => {
    // Flush initial load first
    const initReq = httpTestingController.expectOne('/api/players');
    initReq.flush(mockPlayers);
    await new Promise(resolve => setTimeout(resolve, 0));

    const newPlayerData: Omit<Sorcerer, 'id'> = {
      name: 'Megumi Fushiguro',
      colony: 'Tokyo Colony No. 1',
      technique: 'Ten Shadows',
      points: 40,
      status: 'Alive'
    };

    const expectedResponse: Sorcerer = {
      id: '3',
      ...newPlayerData
    };

    const registerPromise = service.registerPlayer(newPlayerData);

    const req = httpTestingController.expectOne('/api/players');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newPlayerData);
    req.flush(expectedResponse);

    const registered = await registerPromise;
    expect(registered.id).toBe('3');
    expect(service.players().length).toBe(3);
    expect(service.players()[0].name).toBe('Megumi Fushiguro');
  });

  it('should adjust player points', async () => {
    // Flush initial load first
    const initReq = httpTestingController.expectOne('/api/players');
    initReq.flush(mockPlayers);
    await new Promise(resolve => setTimeout(resolve, 0));

    const adjustPromise = service.adjustPoints('1', 5);

    const req = httpTestingController.expectOne('/api/players/1/points');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ points: 195 });
    
    const updatedPlayer: Sorcerer = { ...mockPlayers[0], points: 195 };
    req.flush(updatedPlayer);

    await adjustPromise;
    expect(service.players().find(p => p.id === '1')?.points).toBe(195);
  });

  it('should toggle life status', async () => {
    // Flush initial load first
    const initReq = httpTestingController.expectOne('/api/players');
    initReq.flush(mockPlayers);
    await new Promise(resolve => setTimeout(resolve, 0));

    const togglePromise = service.toggleLifeStatus('1');

    const req = httpTestingController.expectOne('/api/players/1/status');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ status: 'Deceased' });

    const updatedPlayer: Sorcerer = { ...mockPlayers[0], status: 'Deceased' };
    req.flush(updatedPlayer);

    await togglePromise;
    expect(service.players().find(p => p.id === '1')?.status).toBe('Deceased');
    expect(service.mortalityRate()).toBe(50); // 1 out of 2 deceased
  });

  it('should transfer points between alive players', async () => {
    // Flush initial load first
    const initReq = httpTestingController.expectOne('/api/players');
    initReq.flush(mockPlayers);
    await new Promise(resolve => setTimeout(resolve, 0));

    const transferPromise = service.transferPoints('2', '1', 50);

    // Expecting 2 PUT calls: sender then receiver
    const req1 = httpTestingController.expectOne('/api/players/2/points');
    expect(req1.request.method).toBe('PUT');
    expect(req1.request.body).toEqual({ points: 150 });
    req1.flush({ ...mockPlayers[1], points: 150 });

    // Allow promise microtask to resolve so service executes the next await
    await new Promise(resolve => setTimeout(resolve, 0));

    const req2 = httpTestingController.expectOne('/api/players/1/points');
    expect(req2.request.method).toBe('PUT');
    expect(req2.request.body).toEqual({ points: 240 });
    req2.flush({ ...mockPlayers[0], points: 240 });

    await transferPromise;
    const p1 = service.players().find(p => p.id === '1');
    const p2 = service.players().find(p => p.id === '2');
    expect(p1?.points).toBe(240);
    expect(p2?.points).toBe(150);
  });
});
