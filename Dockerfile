FROM openjdk:14-alpine
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar
COPY target/application.yml application.yml
ENTRYPOINT ["java","-jar","/app.jar"]