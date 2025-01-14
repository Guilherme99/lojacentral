package com.loja.central.loja_central.service.token;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.loja.central.loja_central.model.FormularioCadastro;
import com.loja.central.loja_central.service.AuthServiceRedis;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class TokenService {

	@Value("${api.security.token.secret}")
	private String secret;

	@Value("${api.security.token.expiration}")
	private long accessTokenExpirationTime;

	@Value("${api.security.token.refreshExpiration}")
	private long refreshTokenExpirationTime;

	@Autowired
    private AuthServiceRedis redisTokenService;

	private static final String JWT_ISSUER = "LojaCentral";

	public String generateAccessToken(FormularioCadastro user) {
		try {
			Algorithm algorithm = Algorithm.HMAC256(secret);
			String token = JWT.create().withIssuer(JWT_ISSUER)
					.withSubject(user.getEmail())
					.withExpiresAt(genExpirationDateAccessToken(accessTokenExpirationTime))
					.sign(algorithm);

			redisTokenService.storeAccessToken(token, user.getEmail(), accessTokenExpirationTime);
        
			return token;
		} catch (JWTCreationException e) {
			throw new RuntimeException("Erro ao gerar token", e);
		}
	}

	public String generateRefreshToken(FormularioCadastro user) {
		try {
			Algorithm algorithm = Algorithm.HMAC256(secret);
			String token = JWT.create()
					.withSubject(user.getEmail())
					.withExpiresAt(genExpirationDateRefreshToken(refreshTokenExpirationTime))
					.sign(algorithm);

			redisTokenService.storeRefreshToken(token, user.getEmail(), refreshTokenExpirationTime);
        
			return token;
		} catch (JWTCreationException e) {
			throw new RuntimeException("Erro ao gerar refresh token", e);
		}
    }

	public String validateAccessToken(String token) {
		try {
			if (redisTokenService.hasAccessToken(token)==false) {
				throw new RuntimeException("Token revogado/não existe.");
			}
			
			Algorithm algorithm = Algorithm.HMAC256(secret);
			return JWT.require(algorithm)
					.withIssuer(JWT_ISSUER)
					.build()
					.verify(token)
					.getSubject();
		} catch (JWTVerificationException exception) {
			return "";
		}
	}

	public String validateRefreshToken(String token) {
		try {
			if (redisTokenService.hasRefreshToken(token)==false) {
				throw new RuntimeException("Refresh Token revogado/não existe.");
			}
			
			Algorithm algorithm = Algorithm.HMAC256(secret);
			return JWT.require(algorithm)
					.build()
					.verify(token)
					.getSubject();
		} catch (JWTVerificationException exception) {
			return "";
		}
	}

	private Instant genExpirationDateAccessToken(long time) {
		return LocalDateTime.now().plusMinutes(convertMillisToMinutes(time)).toInstant(ZoneOffset.of("-03:00"));
	}


	private Instant genExpirationDateRefreshToken(long time) {
		return LocalDateTime.now().plusDays(convertMillisToDays(time)).toInstant(ZoneOffset.of("-03:00"));
	}

	public void revokeToken(String token, String refreshToken) {
		redisTokenService.revokeTokens(token, refreshToken);
	}

	public String recoverToken(HttpServletRequest request) {
		var authHeader = request.getHeader("Authorization");
		if (authHeader == null)
			return null;
		return authHeader.replace("Bearer ", "");
	}

	public String recoverRefreshToken(HttpServletRequest request) {
		var authHeader = request.getHeader("Refresh-Token");
		if (authHeader == null)
			return null;
		return authHeader;
	}

	private long convertMillisToMinutes(long millis) {
		return millis / 1000 / 60;
	}

	private long convertMillisToDays(long millis) {
		return millis / 1000 / 60 / 60 / 24;
	}
	
}
