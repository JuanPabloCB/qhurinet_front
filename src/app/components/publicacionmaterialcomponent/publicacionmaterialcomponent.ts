import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin, of, catchError, map, switchMap } from 'rxjs';
import { Material } from '../../models/Material';
import { Publicacion } from '../../models/Publicacion';
import { MaterialDetalle, PublicacionDetalle } from '../../models/PublicacionDetalle';
import { AuthService } from '../../services/authservice';
import { MaterialService } from '../../services/materialservice';
import { PublicacionService } from '../../services/publicacionservice';
import { obtenerMensajeBackend } from '../../utils/backend-error';

interface PublicacionConMateriales {
  publicacion: Publicacion;
  materiales: MaterialDetalle[];
}

@Component({
  selector: 'app-publicacionmaterialcomponent',
  imports: [CommonModule, FormsModule],
  templateUrl: './publicacionmaterialcomponent.html',
  styleUrl: './publicacionmaterialcomponent.css',
})
export class Publicacionmaterialcomponent implements OnInit {
  materiales: Material[] = [];
  publicaciones: PublicacionConMateriales[] = [];
  categorias: string[] = [];
  categoriaFiltro = '';
  cargandoMateriales = true;
  cargandoPublicaciones = true;
  mensajeError = '';

  constructor(
    private readonly materialService: MaterialService,
    private readonly publicacionService: PublicacionService,
    private readonly authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.cargarMateriales();
    this.cargarPublicaciones();
  }

  get materialesFiltrados(): Material[] {
    if (!this.categoriaFiltro) {
      return this.materiales;
    }
    return this.materiales.filter(
      (m) => m.categoria.toLowerCase() === this.categoriaFiltro.toLowerCase(),
    );
  }

  filtrarCategoria(): void {
    // reactive via getter
  }

  totalPuntosPublicacion(materiales: MaterialDetalle[]): number {
    return materiales.reduce((sum, m) => sum + m.puntosEstimados, 0);
  }

  private cargarMateriales(): void {
    this.cargandoMateriales = true;
    this.materialService.listar().subscribe({
      next: (materiales) => {
        this.materiales = materiales;
        this.categorias = [...new Set(materiales.map((m) => m.categoria).filter(Boolean))];
        this.cargandoMateriales = false;
      },
      error: (error) => {
        this.mensajeError = obtenerMensajeBackend(error);
        this.cargandoMateriales = false;
      },
    });
  }

  private cargarPublicaciones(): void {
    this.cargandoPublicaciones = true;
    const idUsuario = this.authService.getCurrentUserId();

    if (!idUsuario) {
      this.cargandoPublicaciones = false;
      return;
    }

    this.publicacionService
      .listarPorUsuario(idUsuario)
      .pipe(
        switchMap((publicaciones) => {
          if (publicaciones.length === 0) {
            return of([]);
          }
          return forkJoin(
            publicaciones.map((pub) =>
              this.publicacionService.obtenerDetalle(pub.id).pipe(
                map((detalle) => ({
                  publicacion: pub,
                  materiales: detalle.materiales ?? [],
                })),
                catchError(() =>
                  of({
                    publicacion: pub,
                    materiales: [] as MaterialDetalle[],
                  }),
                ),
              ),
            ),
          );
        }),
      )
      .subscribe({
        next: (publicaciones) => {
          this.publicaciones = publicaciones;
          this.cargandoPublicaciones = false;
        },
        error: (error) => {
          this.mensajeError = obtenerMensajeBackend(error);
          this.cargandoPublicaciones = false;
        },
      });
  }
}
