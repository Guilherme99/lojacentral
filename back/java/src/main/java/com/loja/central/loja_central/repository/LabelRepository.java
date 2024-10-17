package com.loja.central.loja_central.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.loja.central.loja_central.model.Label;

public interface LabelRepository extends JpaRepository<Label, Long> {

    List<Label> findAllByDataRemocaoIsNull();

    List<Label> findByArquivoIdAndDataRemocaoIsNull(Long arquivoId);
    
}
