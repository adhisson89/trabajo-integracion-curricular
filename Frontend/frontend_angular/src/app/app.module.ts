import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { InicioSesionComponent } from './components/inicio-sesion/inicio-sesion.component';
import { ReactiveFormsModule } from '@angular/forms';  // Importar ReactiveFormsModule

@NgModule({
  declarations: [
  
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule 
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }
