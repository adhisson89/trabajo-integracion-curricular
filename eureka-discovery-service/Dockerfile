# Etapa de compilación
FROM maven:3.9.8-amazoncorretto-21 AS build
WORKDIR /app/servicio

# Copiamos el POM y el src
COPY pom.xml ./pom.xml
COPY src ./src

RUN mvn clean package -DskipTests

# Etapa de ejecución
FROM amazoncorretto:21-alpine3.17
WORKDIR /app
COPY --from=build /app/servicio/target/*.jar app.jar
EXPOSE 8761
ENTRYPOINT ["java", "-jar", "app.jar"]