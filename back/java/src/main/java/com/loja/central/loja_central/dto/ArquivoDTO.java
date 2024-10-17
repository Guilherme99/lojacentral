package com.loja.central.loja_central.dto;

import java.util.List;

import jakarta.validation.constraints.NotBlank;

public record ArquivoDTO(

		Long id,

		@NotBlank(message = "Campo obrigatorio") String nome,

		@NotBlank(message = "Campo obrigatorio") String base64,

		@NotBlank(message = "Campo obrigatorio") List<LabelDTO> labels) {
}
