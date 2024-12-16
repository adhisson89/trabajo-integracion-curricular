import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { InicioSesionComponent } from './components/inicio-sesion/inicio-sesion.component';
import { ReactiveFormsModule } from '@angular/forms';  // Importar ReactiveFormsModule
import { ModuloListadoComponent } from './components/modulo-listado/modulo-listado.component';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    ModuloListadoComponent,
     ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }
