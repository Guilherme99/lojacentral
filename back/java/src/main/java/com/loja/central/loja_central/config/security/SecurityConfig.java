package com.loja.central.loja_central.config.security;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Autowired
	SecurityFilterConfig securityFilter;

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
		return httpSecurity.csrf(csrf -> csrf.disable())
				.cors(cors -> cors
						.configurationSource(request -> {
							CorsConfiguration corsConfiguration = new CorsConfiguration();
							corsConfiguration.setAllowedOrigins(Arrays.asList("http://localhost:4300",
									"http://192.168.18.43:4300"));
							corsConfiguration.setAllowedMethods(
									Arrays.asList("POST", "PUT", "GET", "PATCH", "DELETE", "OPTIONS"));
							corsConfiguration.setAllowedHeaders(Arrays.asList("*"));
							corsConfiguration.setAllowCredentials(true);
							return corsConfiguration;
						}))
				.authorizeHttpRequests(authorize -> authorize
						.requestMatchers(HttpMethod.POST, "/auth/login").permitAll()
						.requestMatchers(HttpMethod.POST, "/auth/me")
						.hasAnyRole("ERG_ADMIN")
						.requestMatchers(HttpMethod.POST, "/auth/logout")
						.hasAnyRole("ERG_ADMIN")
						.requestMatchers(HttpMethod.POST, "/auth/refresh")
						.hasAnyRole("ERG_ADMIN")
						.requestMatchers(HttpMethod.GET, "/auth/checkRole/**")
						.hasAnyRole("ERG_ADMIN")
						.requestMatchers(HttpMethod.POST, "/user/register").permitAll()
						.requestMatchers(HttpMethod.POST, "/user/password/reset").permitAll()
						.requestMatchers(HttpMethod.PATCH, "/user/password/reset/validation").permitAll()
						.requestMatchers(HttpMethod.POST, "/user/system/register").hasAnyRole("ERG_ADMIN")
						.requestMatchers(HttpMethod.GET, "/user/**")
						.hasAnyRole("ERG_ADMIN")
						.requestMatchers(HttpMethod.PUT, "/user/**").hasAnyRole("ERG_ADMIN")
						.requestMatchers(HttpMethod.DELETE, "/user/**")
						.hasAnyRole("ERG_ADMIN")
						.requestMatchers("/swagger-ui/**").permitAll()
						.requestMatchers("/v3/api-docs/**").permitAll()
						.requestMatchers(HttpMethod.POST, "/arquivos/**").hasAnyRole("ERG_ADMIN")
						.requestMatchers(HttpMethod.GET, "/arquivos/**").hasAnyRole("ERG_ADMIN")
						.requestMatchers(HttpMethod.PUT, "/arquivos/**").hasAnyRole("ERG_ADMIN")
						.requestMatchers(HttpMethod.DELETE, "/arquivos/**").hasAnyRole("ERG_ADMIN")
						.requestMatchers(HttpMethod.POST, "/solicitacoes/**").hasAnyRole("ERG_ADMIN")
						.requestMatchers(HttpMethod.GET, "/solicitacoes/**").hasAnyRole("ERG_ADMIN")
						.requestMatchers(HttpMethod.PUT, "/solicitacoes/**").hasAnyRole("ERG_ADMIN")
						.requestMatchers(HttpMethod.DELETE, "/solicitacoes/**").hasAnyRole("ERG_ADMIN")
						.anyRequest()
						.authenticated())
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
				.build();
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
			throws Exception {
		return authenticationConfiguration.getAuthenticationManager();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}