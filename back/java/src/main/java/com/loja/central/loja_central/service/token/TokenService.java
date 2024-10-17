package com.loja.central.loja_central.service.token;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.loja.central.loja_central.model.FormularioCadastro;

@Service
public class TokenService {

	@Value("${api.security.token.secret}")
	private String secret;

	private final Set<String> validTokens = new HashSet<>();

	public String generateToken(FormularioCadastro user) {
		try {
			Algorithm algorithm = Algorithm.HMAC256(secret);
			String token = JWT.create().withIssuer("auth-api")
					.withSubject(user.getEmail())
					.withExpiresAt(genExpirationDate())
					.sign(algorithm);
			validTokens.add(token);
			return token;
		} catch (JWTCreationException e) {
			throw new RuntimeException("Erro ao gerar token", e);
		}
	}

	public String validateToken(String token) {
		try {
			Algorithm algorithm = Algorithm.HMAC256(secret);
			return JWT.require(algorithm)
					.withIssuer("auth-api")
					.build()
					.verify(token)
					.getSubject();
		} catch (JWTVerificationException exception) {
			return "";
		}
	}

	private Instant genExpirationDate() {
		return LocalDateTime.now().plusHours(14).toInstant(ZoneOffset.of("-03:00"));
	}

	public void revokeToken(String token) {
		if (isTokenValid(token)) {
			validTokens.remove(token);
		}
	}

	public boolean isTokenValid(String token) {
		return validTokens.contains(token);
	}

	public String generateTokenForRecoveryRegister(String email) {
		try {
			Algorithm algorithm = Algorithm.HMAC256(secret);
			String token = JWT.create().withIssuer("auth-api")
					.withSubject(email)
					.withExpiresAt(LocalDateTime.now().plusMinutes(10).toInstant(ZoneOffset.of("-03:00")))
					.sign(algorithm);
			validTokens.add(token);
			return token;
		} catch (JWTCreationException e) {
			throw new RuntimeException("Erro ao gerar token", e);
		}
	}
}
