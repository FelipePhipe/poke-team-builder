import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Pokeapi {
  private baseUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) {}

  // Endpoint 1: Obtener datos generales, stats, tipos y habilidades de un Pokémon
  obtenerPokemon(nombreOId: string): Observable<any> {
    const termino = nombreOId.trim().toLowerCase();
    return this.http.get<any>(`${this.baseUrl}/pokemon/${termino}`);
  }

  // Endpoint 2: Obtener relaciones de daño de un tipo (debilidades, resistencias, inmunidades)
  obtenerTipo(nombreTipo: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/type/${nombreTipo.toLowerCase()}`);
  }

  // Endpoint 3: Obtener descripción detallada de una habilidad
  obtenerHabilidad(nombreHabilidad: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/ability/${nombreHabilidad.toLowerCase()}`);
  }
}