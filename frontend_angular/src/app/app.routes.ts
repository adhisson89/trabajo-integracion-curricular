import { Routes } from '@angular/router';
import { InicioSesionComponent } from './components/inicio-sesion/inicio-sesion.component';
import { InicioComponent } from './inicio/inicio.component';
import { ModuloAdministradorComponent } from './components/modulo-administrador/modulo-administrador.component';
import { ModuloListadoComponent} from './components/modulo-listado/modulo-listado.component';
import { ModuloRegistroComponent } from './components/modulo-registro/modulo-registro.component';
import { ModuloRegistroDocenteAdminComponent } from './components/modulo-registro-docente-admin/modulo-registro-docente-admin.component';
import { PantallaAnalisisComponent } from './components/pantalla-analisis/pantalla-analisis.component';
import { PopupBorrarComponent } from './components/popup-borrar/popup-borrar.component';
import { PopupEditarComponent } from './components/popup-editar/popup-editar.component';

//base import {  } from './components/';
//import { PrincipalComponent } from './components/principal/principal.component';
// { path: 'principal', component: PrincipalComponent },


export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'inicioSesion', component: InicioSesionComponent },
  { path: 'inicio', component: InicioSesionComponent },
  { path: 'moduloAdministrador', component: ModuloAdministradorComponent },
  { path: 'moduloListado', component: ModuloListadoComponent },
  { path: 'moduloRegistro', component: ModuloRegistroComponent },
  { path: 'moduloRegistroDocente', component: ModuloRegistroDocenteAdminComponent },
  { path: 'pantallaAnalisis', component: PantallaAnalisisComponent },
  { path: 'popupBorrar', component: PopupBorrarComponent },
  { path: 'popupEditar', component: PopupEditarComponent },
];
