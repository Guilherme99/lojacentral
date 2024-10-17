package com.loja.central.loja_central.config.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.loja.central.loja_central.repository.FormularioCadastroRepository;
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
	FormularioCadastroRepository userRepository;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws IOException, ServletException {
		var token = this.recoverToken(request);

		if (request.getServletPath().contains("/swagger-ui") || request.getServletPath().contains("/v3/api-docs")) {
			filterChain.doFilter(request, response);
		} else {
			if (token != null) {
				// Boolean validToken = tokenService.isTokenValid(token);
				var login = tokenService.validateToken(token);
				UserDetails user = userRepository.findByEmail(login);

				var authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
				SecurityContextHolder.getContext().setAuthentication(authentication);
			}

			filterChain.doFilter(request, response);
		}

	}

	private String recoverToken(HttpServletRequest request) {
		var authHeader = request.getHeader("Authorization");
		if (authHeader == null)
			return null;
		return authHeader.replace("Bearer ", "");
	}

}
