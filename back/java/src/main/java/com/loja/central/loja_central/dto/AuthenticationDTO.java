package com.loja.central.loja_central.dto;

import jakarta.validation.constraints.NotBlank;

public record AuthenticationDTO(

		@NotBlank(message = "Campo obrigatorio") String email,

		@NotBlank(message = "Campo obrigatorio") String senha

) {
}
