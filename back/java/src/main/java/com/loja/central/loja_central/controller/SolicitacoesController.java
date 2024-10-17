package com.loja.central.loja_central.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.loja.central.loja_central.dto.SolicitacaoDTO;
import com.loja.central.loja_central.model.Arquivos;
import com.loja.central.loja_central.model.Solicitacoes;
import com.loja.central.loja_central.service.SolicitacoesService;

@RestController
@RequestMapping("/solicitacoes")
public class SolicitacoesController {

    @Autowired
    private SolicitacoesService solicitacoesService;

    @PostMapping("/criar")
    public Long createSolicitacao(@RequestBody SolicitacaoDTO sol) {
        Solicitacoes solAtual = solicitacoesService.saveArquivo(sol);
        if (solAtual != null) {
            return solAtual.getId();
        }

        return null;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Solicitacoes> buscarSolicitacao(@PathVariable Long id) {
        Solicitacoes sol = solicitacoesService.buscarSolicitacao(id);

        return ResponseEntity.ok()
                .body(sol);
    }

    @DeleteMapping("/remover/{id}")
    public ResponseEntity<Void> deleteSolicitacao(@PathVariable Long id) {
        solicitacoesService.deletarSolicitacao(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> listarTodos(
            @RequestParam(defaultValue = "1", name = "page") int page,
            @RequestParam(defaultValue = "10", name = "size") int size,
            @RequestParam(defaultValue = "ASC", name = "sort") String sort) {

        try {
            Pageable paging = PageRequest.of(page - 1, size, Sort.by(Direction.valueOf(sort), "id"));
            Page<Solicitacoes> arquivos = solicitacoesService.listarTodosSolicitacoes(paging);

            Map<String, Object> response = new HashMap<>();
            response.put("data", arquivos.getContent());
            response.put("currentPage", arquivos.getNumber());
            response.put("totalCount", arquivos.getTotalElements());
            response.put("totalPages", arquivos.getTotalPages());

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/buscar")
    public ResponseEntity<Map<String, Object>> filtrarArquivos(
            @RequestParam(required = false) String nome,
            @RequestParam(defaultValue = "1", name = "page") int page,
            @RequestParam(defaultValue = "10", name = "size") int size,
            @RequestParam(defaultValue = "ASC", name = "sort") String sort) {

        try {
            Pageable paging = PageRequest.of(page - 1, size, Sort.by(Direction.valueOf(sort), "id"));
            Page<Solicitacoes> arquivos;
            if (nome != null) {
                arquivos = solicitacoesService.filterSolicitacoes(nome, paging);
            } else {
                arquivos = solicitacoesService.listarTodosSolicitacoes(paging);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("data", arquivos.getContent());
            response.put("currentPage", arquivos.getNumber());
            response.put("totalCount", arquivos.getTotalElements());
            response.put("totalPages", arquivos.getTotalPages());

            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
