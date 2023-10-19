import { Injectable } from '@angular/core';
import Minimap from 'js-minimap';

@Injectable({
  providedIn: 'root'
})
export class MinimapService {

  constructor() { }

  minimap!: Minimap;
  private timer: any;

  public reset() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.minimap.reset()
    }, 2000);
  }  
}