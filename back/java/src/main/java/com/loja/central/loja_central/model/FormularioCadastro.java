package com.loja.central.loja_central.model;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import org.hibernate.validator.constraints.Length;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.loja.central.loja_central.enums.UserRole;
import com.loja.central.loja_central.serializer.LocalDateTimeSerializer;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "usuarios_usu")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FormularioCadastro implements UserDetails {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "id_usu", nullable = false)
	@GeneratedValue(strategy = GenerationType.AUTO, generator = "SEQ_CADASTRO_USUARIO_USU")
	@SequenceGenerator(name = "SEQ_CADASTRO_USUARIO_USU", sequenceName = "seq_cadastro_usuario", allocationSize = 1, initialValue = 1)
	private Long id;

	@Column(name = "role_usu", nullable = false)
	@NotEmpty(message = "O campo perfil é obrigatório.")
	private String role;

	@Column(name = "flg_ativo_usu")
	private boolean ativo;

	@Column(name = "nome_completo_usu", nullable = false, length = 255)
	@Length(max = 255, message = "Informe um nome com no máximo 255 caracteres")
	private String nomeCompleto;

	@Column(name = "email_usu", nullable = false, unique = true, length = 255)
	@Length(max = 255, message = "Informe um e-mail com no máximo 255 caracteres")
	private String email;

	@JsonIgnore
	@Column(name = "senha_usu")
	private String senha;

	@JsonSerialize(using = LocalDateTimeSerializer.class)
	@JsonProperty("criado_em_usu")
	@Column(name = "criado_em_usu", nullable = false)
	private LocalDateTime created_at;

	@Override
	@JsonIgnore
	public Collection<? extends GrantedAuthority> getAuthorities() {
		if (UserRole.ERG_ADMIN.name().equals(this.role)) {
			return List.of(new SimpleGrantedAuthority("ROLE_ERG_ADMIN"));
		}
		return List.of(new SimpleGrantedAuthority("ROLE_ERG_USER"));

	}

	@Override
	@JsonIgnore
	public String getPassword() {
		return senha;
	}

	@Override
	@JsonIgnore
	public String getUsername() {
		return email;
	}

	@Override
	@JsonIgnore
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	@JsonIgnore
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	@JsonIgnore
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	@JsonIgnore
	public boolean isEnabled() {
		return true;
	}

}
