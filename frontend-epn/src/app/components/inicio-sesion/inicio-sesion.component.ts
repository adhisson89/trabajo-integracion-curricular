import { Component,ViewEncapsulation  } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import Swal from 'sweetalert2';

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
  // Función para manejar el envío del formulario
  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      // Datos para la solicitud de login
      const loginData = {
        email: username, // Si el backend espera 'email' como clave
        password: password
      };

      // Realizar la solicitud fetch para autenticar
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

          // Redirigir si el token está presente (indica que la autenticación fue exitosa)
          if (data.token) {
            localStorage.setItem('authToken', data.token);
            console.log('Token guardado:', data.token); // Verifica si el token se guarda correctamente
            
            this.redirectTo('/moduloAdministrador'); // Redirigir a la ruta deseada
          } else {
            alert(data.message || 'Credenciales incorrectas');
          }
        })
        .catch(error => {
          console.error('Error durante el inicio de sesión:', error);
          Swal.fire({
            title: 'Error',
            html: '<p>Hubo un problema al iniciar sesión.</p><p>Inténtalo de nuevo más tarde.</p>',
            icon: 'error',
            confirmButtonText: 'Intentar de nuevo',
          });
        });
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Por favor completa todos los campos.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
  
    }
  }

  // Método para redirigir a una ruta específica
  redirectTo(route: string) {
    this.router.navigate([route]);
  }
}