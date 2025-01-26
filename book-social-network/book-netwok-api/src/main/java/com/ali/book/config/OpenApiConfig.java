package com.ali.book.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;

@OpenAPIDefinition(
		info = @Info(
				contact = @Contact(
						name = "Ali",
						email = "syedaliahsan2002@gmail.com",
						url = "https://fixtechsolution.net"
						),
				description = "Open Api documantaton for spring security",
				title = "Open Api specification -Ali",
				version = "1.0",
				license = @License(
						name = "licence name",
						url = "https://someUrl.com"),
				termsOfService = "termsOfService"
				),
		servers = {
				@Server(
						description = "Local enviroment",
						url = "http://localhost:8088/api/v1"),
				@Server(
						description = "production enviroment",
						url = "https://fixtechsolution.com")
		},
		security = 
	{
			@SecurityRequirement(
					name = "bearerAuth")
	}
		)
@SecurityScheme(
		name = "bearerAuth",
		description = "JWT auth descriotion",
		scheme = "bearer",
		type = SecuritySchemeType.HTTP,
		bearerFormat = "JWT",
		in = SecuritySchemeIn.HEADER )
public class OpenApiConfig {

}
