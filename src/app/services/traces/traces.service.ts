import { Injectable } from '@angular/core';
import { Trace } from 'src/app/class/trace/trace';

@Injectable({
  providedIn: 'root'
})
export class TracesService {

  constructor() { }

  traces: Trace[] = [new Trace(0, 'new', undefined, undefined, 'all', 'Scenario')];

}
