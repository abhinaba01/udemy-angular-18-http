import { Component, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent {
  places = signal<Place[] | undefined>(undefined);
  isFetching = false;
  isError = false;
  error: string = '';

  constructor(private http: HttpClient, private placesService: PlacesService) {}

  ngOnInit() {
    this.placesService.loadAvailabalePlaces().subscribe({
      next: (places) => {
        this.places.set(places);
      },
    });
  }

  onSelect(selectedPlace: Place) {
    this.placesService.addPlaceToUserPlaces(selectedPlace).subscribe({
      next: (resData) => {
        
        console.log(resData.userPlaces);
      },
      error: (error) => console.log(error),
    });
  }
}
