import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ZoomService {

  constructor() { }

  zoom: number = 1;
}
