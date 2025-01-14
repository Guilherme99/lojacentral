package com.loja.central.loja_central.config.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.loja.central.loja_central.repository.FormularioCadastroRepository;
import com.loja.central.loja_central.service.AuthServiceRedis;
import com.loja.central.loja_central.service.token.TokenService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class SecurityFilterConfig extends OncePerRequestFilter {

	@Autowired
	TokenService tokenService;

	@Autowired
    private AuthServiceRedis redisTokenService;

	@Autowired
	FormularioCadastroRepository userRepository;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws IOException, ServletException {
		String token = tokenService.recoverToken(request);
		String refresh_token = tokenService.recoverRefreshToken(request);

		if (request.getServletPath().contains("/swagger-ui") || request.getServletPath().contains("/v3/api-docs")) {
			filterChain.doFilter(request, response);
		} else {
			
			if (token != null && redisTokenService.hasAccessToken(token) == false && refresh_token == null) {
				SecurityContextHolder.clearContext();
				response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); 
				response.getWriter().write("Token revogado ou inválido.");
				return;
			}

			if (token != null && redisTokenService.hasAccessToken(token)==true) {
				var login = tokenService.validateAccessToken(token);
				UserDetails user = userRepository.findByEmail(login);

				var authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
				SecurityContextHolder.getContext().setAuthentication(authentication);
			}

			if (token != null && redisTokenService.hasAccessToken(token)==false && refresh_token != null  && redisTokenService.hasRefreshToken(refresh_token)==true) {
				var login = tokenService.validateRefreshToken(refresh_token);
				UserDetails user = userRepository.findByEmail(login);

				var authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
				SecurityContextHolder.getContext().setAuthentication(authentication);
			}

			filterChain.doFilter(request, response);
		}

	}
}
