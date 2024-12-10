import { Routes } from '@angular/router';
import { InicioSesionComponent } from './components/inicio-sesion/inicio-sesion.component';
import { InicioComponent } from './inicio/inicio.component';
import { ModuloAdministradorComponent } from './components/modulo-administrador/modulo-administrador.component';
import { ModuloListadoComponent} from './components/modulo-listado/modulo-listado.component';
import { ModuloRegistroComponent } from './components/modulo-registro/modulo-registro.component';

import { PantallaAnalisisComponent } from './components/pantalla-analisis/pantalla-analisis.component';


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
  //{ path: 'moduloRegistroProfesor', component: ModuloRegistroProfesorAdminComponent },
  { path: 'pantallaAnalisis', component: PantallaAnalisisComponent },

];
