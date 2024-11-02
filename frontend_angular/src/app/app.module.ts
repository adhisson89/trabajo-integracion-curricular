import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app.routes'; // Asegúrate de que la ruta sea correcta
import { AppComponent } from './app.component';
import { InicioSesionComponent } from './components/inicio-sesion/inicio-sesion.component';
import { PrincipalComponent } from './components/principal/principal.component';

@NgModule({
  declarations: [
    AppComponent,
    InicioSesionComponent,
    PrincipalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule // Aquí se importa el módulo de rutas
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
