import { Component,ViewEncapsulation  } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Importa CommonModule

@Component({
  selector: 'app-inicio-sesion',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule], // Agrega CommonModule aquí
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.css'],
  encapsulation: ViewEncapsulation.None, // Esto desactiva la encapsulación
})
export class InicioSesionComponent {
  loginForm: FormGroup;



  constructor(
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // onSubmit(): void {
  //   if (this.loginForm.valid) {
  //     const { username, password } = this.loginForm.value;
  //     console.log('Usuario:', username);
  //     console.log('Contraseña:', password);
      
  //     // Redirecciona a una ruta específica después del inicio de sesión exitoso
  //     this.redirectTo('/ruta-destino');
  //   }
  // }
onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
  
      // Configuración para la solicitud fetch
      const loginData = {
        email: username,
        password: password
      };
  
      // Realiza la petición fetch cuando el botón es presionado
      fetch('http://localhost:8080/api/administration/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error en la autenticación');
          }
          return response.json();
        })
        .then(data => {
          console.log('Respuesta del servidor:', data);
  
          // Redirigir si la autenticación fue exitosa
          if (data.token) { // Ajusta según la estructura de respuesta de tu API
            this.redirectTo('/moduloAdministrador');
          } else {
            alert(data.message || 'Credenciales incorrectas');
          }
        })
        .catch(error => {
          console.error('Error durante el inicio de sesión:', error);
          alert('Hubo un problema al iniciar sesión. Inténtalo de nuevo más tarde.');
        });
    } else {
      alert('Por favor completa todos los campos.');
    }
  }
  

  redirectTo(route: string) {
    this.router.navigate([route]);
  }
}
