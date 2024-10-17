package com.loja.central.loja_central.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.loja.central.loja_central.serializer.LocalDateTimeSerializer;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "label_solicitacao_lbsol")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LabelSolicitacao {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "id_lbsol", nullable = false)
	@GeneratedValue(strategy = GenerationType.AUTO, generator = "SEQ_LABEL_SOLICITACAO_LBSOL")
	@SequenceGenerator(name = "SEQ_LABEL_SOLICITACAO_LBSOL", sequenceName = "SEQ_LABEL_SOLICITACAO", allocationSize = 1, initialValue = 1)
	private Long id;

	@Column(name = "coord_x_lbsol", nullable = false)
	@NotEmpty(message = "O campo coordenada x é obrigatório.")
	private String coordX;

	@Column(name = "coord_y_lbsol", nullable = false)
	@NotEmpty(message = "O campo coordenada y é obrigatório.")
	private String coordY;

	@Column(name = "texto_lbsol", nullable = false)
	@NotEmpty(message = "O campo texto é obrigatório.")
	private String texto;

	@Column(name = "largura_lbsol", nullable = false)
	@NotEmpty(message = "O campo largura é obrigatório.")
	private String largura;

	@Column(name = "altura_lbsol", nullable = false)
	@NotEmpty(message = "O campo altura é obrigatório.")
	private String altura;

	@Column(name = "rotacao_lbsol", nullable = false)
	@NotEmpty(message = "O campo rotação é obrigatório.")
	private String rotacao;

	@Column(name = "cor_lbsol", nullable = false)
	@NotEmpty(message = "O campo cor é obrigatório.")
	private String cor;

	@Column(name = "tamanho_fonte_lbsol", nullable = false)
	@NotEmpty(message = "O campo tamanho da fonte é obrigatório.")
	private String tamanhoFonte;

	@Column(name = "familia_fonte_lbsol", nullable = false)
	@NotEmpty(message = "O campo familia fonte é obrigatório.")
	private String familiaFonte;

	@JsonSerialize(using = LocalDateTimeSerializer.class)
	@JsonProperty("data_criacao_lbsol")
	@Column(name = "data_criacao_lbsol", nullable = false)
	private LocalDateTime dataCriacao;

	@JsonSerialize(using = LocalDateTimeSerializer.class)
	@JsonProperty("data_remocao_lbsol")
	@Column(name = "data_remocao_lbsol")
	private LocalDateTime dataRemocao;

	@JsonIgnore
	@ManyToOne
	@JoinColumn(name = "id_sol_lbsol", referencedColumnName = "id_sol")
	private Solicitacoes solicitacao;
}
