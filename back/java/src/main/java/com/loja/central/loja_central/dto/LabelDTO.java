package com.loja.central.loja_central.dto;

import jakarta.validation.constraints.NotBlank;

public record LabelDTO(
		Long id,
		@NotBlank(message = "Campo obrigatorio") String coordX,
		@NotBlank(message = "Campo obrigatorio") String coordY, @NotBlank(message = "Campo obrigatorio") String texto,
		@NotBlank(message = "Campo obrigatorio") String largura, @NotBlank(message = "Campo obrigatorio") String altura,
		@NotBlank(message = "Campo obrigatorio") String rotacao,
		@NotBlank(message = "Campo obrigatorio") String cor,
		@NotBlank(message = "Campo obrigatorio") String tamanhoFonte,
		@NotBlank(message = "Campo obrigatorio") String familiaFonte

) {
}
