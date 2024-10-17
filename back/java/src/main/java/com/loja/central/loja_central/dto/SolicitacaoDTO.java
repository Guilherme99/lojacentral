package com.loja.central.loja_central.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.List;


public record SolicitacaoDTO(

		Long id,

		@NotBlank(message = "Campo obrigatorio") Long idArquivo,

		@NotBlank(message = "Campo obrigatorio") String nome,

		@NotBlank(message = "Campo obrigatorio") List<LabelDTO> labels

) {
}
