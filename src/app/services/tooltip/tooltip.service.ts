import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TooltipService {

  constructor() { }

  activatedTooltips: boolean = true;
}
