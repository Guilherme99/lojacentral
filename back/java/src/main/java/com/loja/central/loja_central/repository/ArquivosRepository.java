package com.loja.central.loja_central.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.loja.central.loja_central.model.Arquivos;

public interface ArquivosRepository extends JpaRepository<Arquivos, Long> {

    Page<Arquivos> findAllByDataRemocaoIsNull(Pageable pageable);

    @Query("SELECT ag FROM Arquivos ag WHERE LOWER(ag.nome) LIKE LOWER(CONCAT('%', :nome, '%')) AND dataRemocao IS NULL")
	Page<Arquivos> findAllByNome(@Param("nome") String nome,
			Pageable pageable);
}
