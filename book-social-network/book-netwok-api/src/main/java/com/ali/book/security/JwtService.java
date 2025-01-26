package com.ali.book.security;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
	@Value("${spring.application.security.jwt.secret-key}")
	private String secretKey;
	@Value("${spring.application.security.jwt.expiration}")
	private long jwtExpiration;
	
	public String extractUsername(String token) {
		// TODO Auto-generated method stub
		return extractClaim(token, Claims::getSubject);
	}
	
	public <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
		final Claims claims = extratAllClaims(token);
		return claimResolver.apply(claims);
	}
	
	private Claims extratAllClaims(String token) {
		// TODO Auto-generated method stub
		return Jwts
				.parserBuilder()
				.setSigningKey(getSignInKey())
				.build()
				.parseClaimsJws(token)
				.getBody()
				;
	}

	public String generateToken(UserDetails userDetails) {
		return generateToken(new HashMap<>(), userDetails); 
	}
	
	public String generateToken(Map<String, Object> claims, UserDetails userDetails) {
		return buildToken(claims, userDetails, jwtExpiration);
	}

	private String buildToken(Map<String, Object> extraClaims, UserDetails userDetails, Long jwtExpiration) {
		// TODO Auto-generated method stub
		var authorities = userDetails.getAuthorities()
				.stream()
				.map(GrantedAuthority::getAuthority)
				.toList();
		
				return Jwts
						.builder()
						.setClaims(extraClaims)
						.setSubject(userDetails.getUsername())
						.setIssuedAt(new Date(System.currentTimeMillis()))
						.setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
						.claim("authorities", authorities)
						.signWith(getSignInKey())
						.compact()
						;
	}

	private Key getSignInKey() {
		
		// TODO Auto-generated method stub
		  byte[] keyBytes = Decoders.BASE64.decode(secretKey);
	        return Keys.hmacShaKeyFor(keyBytes);
	}
	
	public boolean isTokenValid(String token, UserDetails userDetails) {
		final String username = extractUsername(token);
		return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
	}

	private boolean isTokenExpired(String token) {
		// TODO Auto-generated method stub
		return extractExpiration(token).before(new Date());
	}

	private Date extractExpiration(String token) {
		// TODO Auto-generated method stub
		return extractClaim(token, Claims::getExpiration);
	}

	

}
