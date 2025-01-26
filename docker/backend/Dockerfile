# Build stage
FROM maven:3.8.7-openjdk-18 AS build
WORKDIR /build

# Copy the pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy the source code and build the application
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime stage
FROM amazoncorretto:17

# Arguments for runtime configuration
ARG PROFILE=dev
ARG APP_VERSION=1.0.4

# Define the working directory
WORKDIR /app

# Copy the built JAR file from the build stage
COPY --from=build /build/target/book-network-*.jar /app/app.jar

# Expose the application port
EXPOSE 8088

# Set environment variables
ENV DB_URL=jdbc:mysql://mysql-bsn:3306/book_social_network
ENV ACTIVE_PROFILE=$PROFILE
ENV JAR_VERSION=$APP_VERSION

# Command to run the application
CMD java -Dspring.profiles.active=${ACTIVE_PROFILE} -Dspring.datasource.url=${DB_URL} -jar app.jar
