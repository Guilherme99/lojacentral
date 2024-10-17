package com.loja.central.loja_central.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import com.loja.central.loja_central.config.log.AuditingInterceptor;

@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/ws/**")
				.allowedOrigins("http://localhost:4300", "http://192.168.18.43:4300")
				.allowedMethods("POST", "PUT", "GET", "PATCH", "DELETE", "OPTIONS")
				.allowedHeaders("http://localhost:4300", "http://192.168.18.43:4300")
				.allowCredentials(true);
	}

	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(new AuditingInterceptor());
	}
}