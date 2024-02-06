import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NodeListComponent } from './node-list/node-list.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NodeListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'financial-accounting-system-angular-front';
}
