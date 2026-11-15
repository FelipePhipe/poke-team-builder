import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Pokeapi } from '../../services/pokeapi';

@Component({
  selector: 'app-buscador',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './buscador.html',
  styleUrl: './buscador.css'
})
export class Buscador {
  @Input() cantidadEquipo: number = 0;
  @Output() agregarPokemon = new EventEmitter<any>();

  terminoBusqueda: string = 'charizard';
  cargando = signal<boolean>(false);
  errorMensaje = signal<string>('');

  pokemonActual = signal<any>(null);
  debilidades = signal<{ tipo: string; multiplicador: number }[]>([]);
  resistencias = signal<{ tipo: string; multiplicador: number }[]>([]);
  inmunidades = signal<string[]>([]);

  habilidadSeleccionada = signal<string>('');
  descripcionHabilidad = signal<string>('');
  cargandoHabilidad = signal<boolean>(false);

  constructor(private pokeService: Pokeapi) {
    this.buscar();
  }

  buscar() {
    if (!this.terminoBusqueda.trim()) {
      this.errorMensaje.set('Por favor, escribe el nombre o número de un Pokémon.');
      return;
    }

    this.cargando.set(true);
    this.errorMensaje.set('');
    this.pokemonActual.set(null);
    this.habilidadSeleccionada.set('');
    this.descripcionHabilidad.set('');

    // 1. Llamada al endpoint /pokemon
    this.pokeService.obtenerPokemon(this.terminoBusqueda).subscribe({
      next: (data) => {
        this.pokemonActual.set(data);
        this.calcularRelacionesDeTipo(data.types);
        if (data.abilities && data.abilities.length > 0) {
          this.verHabilidad(data.abilities[0].ability.name);
        }
      },
      error: () => {
        this.cargando.set(false);
        this.errorMensaje.set(
          `No se encontró ningún Pokémon con "${this.terminoBusqueda}". Intenta con otro nombre o ID (ej. pikachu, 25, garchomp).`
        );
      }
    });
  }

  // 2. Llamada al endpoint /type
  calcularRelacionesDeTipo(tipos: any[]) {
    const peticiones = tipos.map((t) => this.pokeService.obtenerTipo(t.type.name));

    forkJoin(peticiones).subscribe({
      next: (resultadosTipos) => {
        const multiplicadores: { [key: string]: number } = {};

        resultadosTipos.forEach((tipoInfo) => {
          tipoInfo.damage_relations.double_damage_from.forEach((t: any) => {
            multiplicadores[t.name] = (multiplicadores[t.name] ?? 1) * 2;
          });
          tipoInfo.damage_relations.half_damage_from.forEach((t: any) => {
            multiplicadores[t.name] = (multiplicadores[t.name] ?? 1) * 0.5;
          });
          tipoInfo.damage_relations.no_damage_from.forEach((t: any) => {
            multiplicadores[t.name] = 0;
          });
        });

        const listaDebiles: { tipo: string; multiplicador: number }[] = [];
        const listaResistentes: { tipo: string; multiplicador: number }[] = [];
        const listaInmunes: string[] = [];

        for (const [tipo, mult] of Object.entries(multiplicadores)) {
          if (mult > 1) {
            listaDebiles.push({ tipo, multiplicador: mult });
          } else if (mult > 0 && mult < 1) {
            listaResistentes.push({ tipo, multiplicador: mult });
          } else if (mult === 0) {
            listaInmunes.push(tipo);
          }
        }

        this.debilidades.set(listaDebiles);
        this.resistencias.set(listaResistentes);
        this.inmunidades.set(listaInmunes);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        this.errorMensaje.set('Error al consultar la tabla de tipos en PokéAPI.');
      }
    });
  }

  // 3. Llamada al endpoint /ability
  verHabilidad(nombreHabilidad: string) {
    this.habilidadSeleccionada.set(nombreHabilidad);
    this.cargandoHabilidad.set(true);

    this.pokeService.obtenerHabilidad(nombreHabilidad).subscribe({
      next: (data) => {
        const entradaEs = data.flavor_text_entries.find(
          (entry: any) => entry.language.name === 'es'
        );
        const entradaEn = data.flavor_text_entries.find(
          (entry: any) => entry.language.name === 'en'
        );

        this.descripcionHabilidad.set(
          entradaEs
            ? entradaEs.flavor_text
            : entradaEn
            ? entradaEn.flavor_text
            : 'Sin descripción disponible.'
        );
        this.cargandoHabilidad.set(false);
      },
      error: () => {
        this.descripcionHabilidad.set('No se pudo cargar la información de esta habilidad.');
        this.cargandoHabilidad.set(false);
      }
    });
  }

  enviarAlEquipo() {
    const actual = this.pokemonActual();
    if (!actual || this.cantidadEquipo >= 6) return;

    this.agregarPokemon.emit({
      id: actual.id,
      nombre: actual.name,
      imagen:
        actual.sprites.other['official-artwork'].front_default ||
        actual.sprites.front_default,
      tipos: actual.types.map((t: any) => t.type.name),
      habilidadActiva: this.habilidadSeleccionada(),
      debilidades: this.debilidades().map((d) => d.tipo)
    });
  }
}