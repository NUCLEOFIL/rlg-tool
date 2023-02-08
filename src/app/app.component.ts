import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'RLG Maker';

  range(n: number): number[] {
    return Array.from(Array(n), (_, i) => i);
  }
}