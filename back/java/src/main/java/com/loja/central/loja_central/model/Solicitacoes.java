package com.loja.central.loja_central.model;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.loja.central.loja_central.serializer.LocalDateTimeSerializer;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "solicitacoes_sol")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Solicitacoes {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "id_sol", nullable = false)
	@GeneratedValue(strategy = GenerationType.AUTO, generator = "SEQ_SOLICITACOES_SOL")
	@SequenceGenerator(name = "SEQ_SOLICITACOES_SOL", sequenceName = "SEQ_SOLICITACOES", allocationSize = 1, initialValue = 1)
	private Long id;

	@Column(name = "nome_sol", nullable = false)
	@NotEmpty(message = "O campo nome é obrigatório.")
	private String nome;

	// @JsonIgnore
	@ManyToOne
	@JoinColumn(name = "id_arq_sol", referencedColumnName = "id_arq")
	private Arquivos arquivo;

	@Transient
	@OneToMany(mappedBy = "solicitacao", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<LabelSolicitacao> labels;

	@JsonSerialize(using = LocalDateTimeSerializer.class)
	@JsonProperty("data_criacao_sol")
	@Column(name = "data_criacao_sol", nullable = false)
	private LocalDateTime dataCriacao;

	@JsonSerialize(using = LocalDateTimeSerializer.class)
	@JsonProperty("data_remocao_sol")
	@Column(name = "data_remocao_sol")
	private LocalDateTime dataRemocao;

}
