package com.loja.central.loja_central.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

import com.loja.central.loja_central.model.FormularioCadastro;

public interface FormularioCadastroRepository extends JpaRepository<FormularioCadastro, Long> {

	UserDetails findByEmail(String email);

	FormularioCadastro findDetailsByEmail(String email);
}
