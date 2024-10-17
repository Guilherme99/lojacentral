package com.loja.central.loja_central.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.loja.central.loja_central.model.LabelSolicitacao;

public interface LabelSolicitacaoRepository extends JpaRepository<LabelSolicitacao, Long> {

    List<LabelSolicitacao> findAllByDataRemocaoIsNull();

    List<LabelSolicitacao> findBySolicitacaoIdAndDataRemocaoIsNull(Long solId);
    
}
