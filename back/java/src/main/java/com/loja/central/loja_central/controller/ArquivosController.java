package com.loja.central.loja_central.controller;

import java.util.HashMap;
import java.util.List;
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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.loja.central.loja_central.dto.ArquivoDTO;
import com.loja.central.loja_central.model.Arquivos;
import com.loja.central.loja_central.model.Label;
import com.loja.central.loja_central.repository.LabelRepository;
import com.loja.central.loja_central.service.ArquivosService;

@RestController
@RequestMapping("/arquivos")
public class ArquivosController {

    @Autowired
    private ArquivosService arquivosService;

    @Autowired
    private LabelRepository labelRepository;

    @PostMapping("/criar")
    public Long createArquivos(@RequestBody ArquivoDTO arquivo) {
        return arquivosService.saveArquivo(arquivo).getId();
    }

    @PutMapping("/atualizar")
    public Long atualizarArquivos(@RequestBody ArquivoDTO arquivo) {
        return arquivosService.atualizarArquivo(arquivo).getId();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ByteArrayResource> downloadArquivo(@PathVariable Long id) {
        byte[] arquivoBytes = arquivosService.buscarArquivo(id);

        ByteArrayResource resource = new ByteArrayResource(arquivoBytes);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"arquivo_" + id + ".pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .contentLength(arquivoBytes.length)
                .body(resource);
    }

    @GetMapping("/labels/{id}")
    public ResponseEntity<List<Label>> buscarLabelsArquivo(@PathVariable Long id) {
        return  ResponseEntity.ok().body(labelRepository.findByArquivoIdAndDataRemocaoIsNull(id));
    }

    @DeleteMapping("/remover/{id}")
    public ResponseEntity<Void> deleteArquivo(@PathVariable Long id) {
        arquivosService.deletarArquivo(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> listarTodos(
            @RequestParam(defaultValue = "1", name = "page") int page,
            @RequestParam(defaultValue = "10", name = "size") int size,
            @RequestParam(defaultValue = "ASC", name = "sort") String sort) {

        try {
            Pageable paging = PageRequest.of(page - 1, size, Sort.by(Direction.valueOf(sort), "id"));
            Page<Arquivos> arquivos = arquivosService.listarTodosArquivos(paging);

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
            Page<Arquivos> arquivos;
            if (nome != null) {
                arquivos = arquivosService.filterArquivos(nome, paging);
            } else {
                arquivos = arquivosService.listarTodosArquivos(paging);
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
