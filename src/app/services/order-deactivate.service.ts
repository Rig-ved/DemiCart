import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

export interface DeactivationGuarded {
  canDeactivate(): Observable<boolean> | Promise<boolean> |boolean;
}

@Injectable({
  providedIn: 'root'
})
export class OrderDeactivateService implements CanDeactivate<DeactivationGuarded> {
  canDeactivate(component: DeactivationGuarded) {
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}