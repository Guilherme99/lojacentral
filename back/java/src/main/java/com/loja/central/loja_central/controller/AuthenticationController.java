package com.loja.central.loja_central.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
import com.loja.central.loja_central.service.token.TokenService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {

	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private TokenService tokenService;

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
			var token = tokenService.generateToken((FormularioCadastro) auth.getPrincipal());

			if (auth.isAuthenticated()) {
				var newUser = (FormularioCadastro) user;
				roles.add(newUser.getRole());

				Map<String, Object> responseMap = new HashMap<>();
				responseMap.put("token", token);
				responseMap.put("roles", roles);
				responseMap.put("email", newUser.getEmail());
				responseMap.put("name", newUser.getNomeCompleto());

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
	public ResponseEntity logout() {
		try {
			String token = (String) SecurityContextHolder.getContext().getAuthentication().getCredentials();
			tokenService.revokeToken(token);
			SecurityContextHolder.clearContext();
			return ResponseEntity.ok("Logout realizado com sucesso");
		} catch (Exception e) {
			return ResponseEntity.ok("Erro durante o logout");
		}
	}
}
