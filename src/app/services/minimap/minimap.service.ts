import { Injectable } from '@angular/core';
import Minimap from 'js-minimap';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MinimapService {

  constructor() { }

  private timer: any;
  private refreshSubject = new BehaviorSubject<void>(undefined);
  refresh$ = this.refreshSubject.asObservable();

  public reset() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.refreshSubject.next();
    }, 500);
  }  
}