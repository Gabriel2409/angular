/* tslint:disable:no-unused-variable */

import { TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { UserComponent } from './user.component';
import { UserService } from './user.service';
import { DataService } from '../shared/data.service';

describe('Component: User', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserComponent],
    });
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(UserComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should use the user name from the service', () => {
    const fixture = TestBed.createComponent(UserComponent);
    const app = fixture.debugElement.componentInstance;
    const userService = fixture.debugElement.injector.get(UserService);
    fixture.detectChanges();
    expect(userService.user.name).toEqual(app.user.name);
  });
  it('should display the username if user is logged in', () => {
    const fixture = TestBed.createComponent(UserComponent);
    const app = fixture.debugElement.componentInstance;
    // no need to access the injected userService here because i dont want
    // to test it
    app.isLoggedIn = true; // modified the isLoggedIn attr
    fixture.detectChanges();
    let compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('p').textContent).toContain(app.user.name);
  });
  it("shouldn't display the username if user is not logged in", () => {
    const fixture = TestBed.createComponent(UserComponent);
    const app = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    let compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('p').textContent).not.toContain(
      app.user.name
    );
  });
});
