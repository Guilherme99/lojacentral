package com.loja.central.loja_central.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArquivosResponseDTO {
    private Long id;
    private LocalDateTime dataCriacao;
    private LocalDateTime dataRemocao;
    private List<LabelDTO> labels;
}
