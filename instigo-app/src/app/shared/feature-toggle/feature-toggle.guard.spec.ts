import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureToggleGuard } from './feature-toggle.guard';
import { Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

jest.mock('src/environments/environment', () => ({
  environment: {
    features: {
      allowedRoute: true,
      restrictedRoute: false,
    },
  },
}));

@Component({
  template: '',
})
export class RootComponent {}

@Component({
  template: '',
})
export class AllowedRouteComponent {}

@Component({
  template: '',
})
export class RestrictedRouteComponent {}

const routes = [
  {
    path: '',
    component: RootComponent,
  },
  {
    path: 'allowedRoute',
    component: AllowedRouteComponent,
    canActivate: [FeatureToggleGuard],
    data: { feature: 'allowedRoute' },
  },

  {
    path: 'restrictedRoute',
    component: RestrictedRouteComponent,
    canActivate: [FeatureToggleGuard],
    data: { feature: 'restrictedRoute' },
  },
];

describe('featureToggleGuard', () => {
  let rootFixture: ComponentFixture<RootComponent>;
  let routeComponent: RootComponent;
  let router: Router;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RootComponent, AllowedRouteComponent, RestrictedRouteComponent],
      imports: [RouterTestingModule.withRoutes(routes)],
    });

    rootFixture = TestBed.createComponent(RootComponent);
    routeComponent = rootFixture.componentInstance;
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);

    rootFixture.detectChanges();
    router.initialNavigation();
  });

  it('should be defined', () => {
    expect(routeComponent).toBeDefined();
  });

  it('should be at the root', () => {
    expect(location.path()).toBe('/');
  });

  it('should navigate to the allowed route', async () => {
    await router.navigate(['allowedRoute']);
    expect(location.path()).toBe('/allowedRoute');
  });

  it('should be restricted for navigation', async () => {
    await router.navigate(['restrictedRoute']);
    expect(location.path()).toBe('/');
  });
});
