import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faAngleLeft, faAngleRight, faUsers, faUserPlus, faBook } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  isCollapsed = false;

  // Define icons
  faAngleLeft = faAngleLeft;
  faAngleRight = faAngleRight;
  faUsers = faUsers;
  faUserPlus = faUserPlus;
  faBook = faBook;

  constructor(private library: FaIconLibrary) {
    // Add icons to the library
    library.addIcons(faAngleLeft, faAngleRight, faUsers, faUserPlus, faBook);
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
