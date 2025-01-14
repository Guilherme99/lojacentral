package com.loja.central.loja_central.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.loja.central.loja_central.dto.AuthenticationDTO;
import com.loja.central.loja_central.dto.LoginResponseDTO;
import com.loja.central.loja_central.exceptions.AppException;
import com.loja.central.loja_central.model.FormularioCadastro;
import com.loja.central.loja_central.repository.FormularioCadastroRepository;
import com.loja.central.loja_central.service.AuthServiceRedis;
import com.loja.central.loja_central.service.token.TokenService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private TokenService tokenService;

	@Autowired
	private AuthServiceRedis serviceRedis;

	@Autowired
	private FormularioCadastroRepository userRepository;

	@PostMapping("/login")
	public ResponseEntity login(@RequestBody @Valid AuthenticationDTO loginDto) {

		UserDetails user = userRepository.findByEmail(loginDto.email());

		if (user == null) {
			ResponseEntity.status(400).body("Erro ao fazer login.").ok();
		} else {
			var usernamePassword = new UsernamePasswordAuthenticationToken(loginDto.email(), loginDto.senha());
			var auth = this.authenticationManager.authenticate(usernamePassword);

			List<String> roles = new ArrayList<>();
			var accessToken = tokenService.generateAccessToken((FormularioCadastro) auth.getPrincipal());
			var refreshToken = tokenService.generateRefreshToken((FormularioCadastro) auth.getPrincipal());

			if (auth.isAuthenticated()) {
				var newUser = (FormularioCadastro) user;
				roles.add(newUser.getRole());

				Map<String, Object> responseMap = new LinkedHashMap<>();
				responseMap.put("email", newUser.getEmail());
				responseMap.put("name", newUser.getNomeCompleto());
				responseMap.put("roles", roles);
				responseMap.put("access_token", accessToken);
				responseMap.put("refresh_token", refreshToken);

				return ResponseEntity.ok(new LoginResponseDTO(responseMap).obj());
			} else {
				throw new AppException("Usuário não autenticado.");
			}
		}

		return null;
	}

	@GetMapping("/me")
	public ResponseEntity getUserInfo() {
		try {
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

			if (authentication.isAuthenticated() && authentication.getPrincipal() instanceof FormularioCadastro) {
				FormularioCadastro user = (FormularioCadastro) authentication.getPrincipal();
				List<String> roles = new ArrayList<>();
				var newUser = (FormularioCadastro) userRepository.findByEmail(user.getEmail());
				roles.add(newUser.getRole());

				Map<String, Object> responseMap = new HashMap<>();
				responseMap.put("roles", roles);
				responseMap.put("email", newUser.getEmail());
				responseMap.put("name", newUser.getNomeCompleto());

				return ResponseEntity.ok(responseMap);
			} else {
				throw new AppException("Usuário não autenticado.");
			}
		} catch (Exception e) {
			return ResponseEntity.status(200).body("Erro ao obter informações do usuário");
		}
	}

	@GetMapping("/checkRole/{role}")
	public boolean checkUserRole(@PathVariable String role) {

		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		if (authentication.isAuthenticated() && authentication.getPrincipal() instanceof FormularioCadastro) {
			FormularioCadastro user = (FormularioCadastro) authentication.getPrincipal();

			if (user.getRole().equals(role))
				return true;
		}
		return false;
	}

	@DeleteMapping("/logout")
	public ResponseEntity logout(HttpServletRequest request) {
		try {
			String token = tokenService.recoverToken(request);
			String refreshToken = tokenService.recoverRefreshToken(request);

			tokenService.revokeToken(token, refreshToken);
			SecurityContextHolder.clearContext();
			return ResponseEntity.ok("Logout realizado com sucesso");
		} catch (Exception e) {
			return ResponseEntity.ok("Erro durante o logout");
		}
	}

	@PostMapping("/refresh")
	public ResponseEntity<?> refreshToken(HttpServletRequest request) {
		String token = tokenService.recoverToken(request);
		String refreshToken = tokenService.recoverRefreshToken(request);
		
		if (refreshToken != null) {
			// // Recupera o refresh token armazenado no Redis para o email
			String storedRefreshToken = serviceRedis.getRefreshToken(refreshToken);
			
			if(storedRefreshToken != null){
				var login = tokenService.validateRefreshToken(refreshToken);
				UserDetails user = userRepository.findByEmail(login);
				if (storedRefreshToken.equals(user.getUsername())) { 
				
					// Gera um novo access token
					serviceRedis.revokeTokens(token, refreshToken);
					
					var accessToken = tokenService.generateAccessToken((FormularioCadastro) user);
					var newRefreshToken = tokenService.generateRefreshToken((FormularioCadastro) user);
	
					Map<String, String> responseMap = new HashMap<>();
					responseMap.put("access_token", accessToken);
					responseMap.put("refresh_token", newRefreshToken);
	
					return ResponseEntity.ok(responseMap);
				} else {
					return ResponseEntity.status(401).body("Refresh Token inválido ou expirado.");
				}
			}

			
		}
		
		return ResponseEntity.status(401).body("Refresh Token inválido.");
	}

}
