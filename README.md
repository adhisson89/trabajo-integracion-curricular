# Trabajo de Integración Curricular

Este repositorio es el resultado del trabajo de integración curricular de los estudiantes de la Escuela Politécnica Nacional del Ecuador, de la Facultad de Ingeniería de Sistemas, para la obtención del título de `Ingeniero en Ciencias de la Computación`. El trabajo consiste en la creación de un sistema de reconocimiento facial que permita el acceso al campus politécnico. El sistema se compone de varios microservicios que se comunican entre sí para lograr el objetivo.

## Integrantes
- [Adhisson Cedeño](https://github.com/adhisson89)
- [Mireya Ramírez](https://github.com/Ivonne-Ramirez)
- [Daniela Román](https://github.com/danielaro2)
- [Verónica Zúñiga](https://github.com/Verolu)

## Arquitectura
La arquitectura del sistema sigue el siguiente diagrama:

![Arquitectura](./Arquitectura.png)

### Microservicios

#### [Microservicio Eureka Discovery](./administration-service/README.md)

Este microservicio es el servidor de descubrimiento que permite a los microservicios registrarse y descubrirse entre sí dinámicamente.

#### [Microservicio Spring Gateway](./spring-gateway-service/README.md)

Este microservicio es el encargado de enrutar las peticiones a los microservicios que se encuentran en la red. Para ello, se utiliza el servidor de descubrimiento Eureka.

#### [Microservicio de Administración](./administration-service/README.md)

Este microservicio se encarga de la administración de la aplicación. Registra administradores, permite el inicio de sesión, un CRUD de las personas a las que va a identificar el sistema.

