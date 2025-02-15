import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Place } from './place.model';
import { map, catchError, throwError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  places = signal<Place[] | undefined>(undefined);
  isFetching = false;
  isError = false;
  error: string = '';
  private userPlaces = signal<Place[]>([]);

  loadedUserPlaces = this.userPlaces.asReadonly();

  constructor(private http: HttpClient) {}

  loadAvailabalePlaces() {
    return this.fetchPlaces('http://localhost:3000/places');
  }

  loadUserPlaces() {
    return this.fetchPlaces('http://localhost:3000/user-places').pipe(
      tap({
        next: (userPlaces) => this.userPlaces.set(userPlaces),
      })
    );
  }

  addPlaceToUserPlaces(selectedPlace: Place) {
    this.userPlaces.update((prevPlaces) => [...prevPlaces, selectedPlace]);
    
    return this.http.put<{ userPlaces: Place[] }>(
      'http://localhost:3000/user-places',
      { placeId: selectedPlace.id }
    );
  }

  private fetchPlaces(url: string) {
    this.isFetching = true;
    return this.http.get<{ places: Place[] }>(url).pipe(
      map((response) => response.places),
      catchError((error) => {
        return throwError(() => new Error());
      })
    );
  }
}
