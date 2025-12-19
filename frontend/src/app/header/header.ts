import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  id: any = 'about';
  tabChange(ids: any) {
    this.id = ids;
  }
}
