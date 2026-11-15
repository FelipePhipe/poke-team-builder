import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-equipo',
  standalone: true,
  imports: [],
  templateUrl: './equipo.html',
  styleUrl: './equipo.css'
})
export class Equipo {
  @Input() miembros: any[] = [];
  @Output() eliminarMiembro = new EventEmitter<number>();
  @Output() limpiarEquipo = new EventEmitter<void>();

  quitar(indice: number) {
    this.eliminarMiembro.emit(indice);
  }

  vaciar() {
    this.limpiarEquipo.emit();
  }

  // Calcula qué tipos amenazan más al equipo construido
  obtenerResumenDebilidades(): { tipo: string; cantidad: number }[] {
    const conteo: { [tipo: string]: number } = {};

    this.miembros.forEach((pokemon) => {
      pokemon.debilidades.forEach((tipoDebil: string) => {
        conteo[tipoDebil] = (conteo[tipoDebil] || 0) + 1;
      });
    });

    return Object.entries(conteo)
      .map(([tipo, cantidad]) => ({ tipo, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad);
  }
}