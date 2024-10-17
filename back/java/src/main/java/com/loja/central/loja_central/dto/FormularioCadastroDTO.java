package com.loja.central.loja_central.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record FormularioCadastroDTO(

		@NotBlank(message = "Campo obrigatorio") @Size(max = 255) String nomeCompleto,

		@NotBlank(message = "Campo obrigatorio") String email,

		@NotBlank(message = "Campo obrigatorio") String role,

		@NotBlank(message = "Campo obrigatorio") boolean ativo,

		@NotBlank(message = "Campo obrigatorio") String senha

) {
}
