import { Component, signal } from '@angular/core';
import { Buscador } from './components/buscador/buscador';
import { Equipo } from './components/equipo/equipo';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Buscador, Equipo],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  equipoPokemon = signal<any[]>([]);

  agregarAlEquipo(pokemon: any) {
    if (this.equipoPokemon().length < 6) {
      this.equipoPokemon.update((lista) => [...lista, pokemon]);
    }
  }

  eliminarDelEquipo(indice: number) {
    this.equipoPokemon.update((lista) => lista.filter((_, i) => i !== indice));
  }

  vaciarEquipo() {
    this.equipoPokemon.set([]);
  }
}