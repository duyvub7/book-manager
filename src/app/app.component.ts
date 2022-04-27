import { Component } from '@angular/core';
import { SidebarService } from './component/sidebar/sidebar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-pro-sidebar';
  constructor(public sidebarservice: SidebarService) { }

}
