import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'recipe';
  loadedFeature: string = 'recipe';

  onNavigate(feature: string) {
    if (feature !== this.loadedFeature) {
      this.loadedFeature = feature;
    }
  }
}
