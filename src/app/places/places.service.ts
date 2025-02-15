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
    const prevPlaces = this.userPlaces();
    if (!prevPlaces.some((p) => p.id === selectedPlace.id)) {
      this.userPlaces.set([...prevPlaces, selectedPlace]);
    }

    return this.http
      .put<{ userPlaces: Place[] }>('http://localhost:3000/user-places', {
        placeId: selectedPlace.id,
      })
      .pipe(
        catchError((error) => {
          return throwError(() => new Error('Failed to store selected place'));
        })
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

  removeUserPlaces(selectedPlace: Place) {
    const prevPlaces = this.userPlaces();
    if (prevPlaces.some((p) => p.id === selectedPlace.id)) {
      this.userPlaces.set(prevPlaces.filter((p) => p.id !== selectedPlace.id));
    }
    return this.http.delete(`http://localhost:3000/user-places/${selectedPlace.id}`)
  }
}
