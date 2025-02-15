import { Component, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { HttpClient } from '@angular/common/http';
import { map, catchError, throwError } from 'rxjs';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent {
  places=this.placesService.loadedUserPlaces;
  isFetching = false;
  isError = false;
  error: string = '';

  constructor(private http: HttpClient, private placesService: PlacesService) {}

  ngOnInit() {
   
    this.placesService.loadUserPlaces().subscribe({
      error: (error) => {
        this.error = error.message;
      },
    });
  }
}
