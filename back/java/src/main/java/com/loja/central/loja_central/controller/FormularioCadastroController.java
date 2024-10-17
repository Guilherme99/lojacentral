package com.loja.central.loja_central.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.loja.central.loja_central.dto.FormularioCadastroDTO;
import com.loja.central.loja_central.enums.UserRole;
import com.loja.central.loja_central.exceptions.AppException;
import com.loja.central.loja_central.model.FormularioCadastro;
import com.loja.central.loja_central.service.FormularioCadastroService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
@Tag(description = "Loja Central Controller", name = "LOJA CENTRAL")
public class FormularioCadastroController {

    @Autowired
    private FormularioCadastroService service;

    @PostMapping(value = "/register", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(description = "Criar registro via API.", summary = "Registrar", responses = {
            @ApiResponse(responseCode = "200", description = "Sucesso"),
    })
    public ResponseEntity<String> cadastroUserFormulario(@RequestBody FormularioCadastroDTO dadosCadastro) {
        if (dadosCadastro.role().equals(UserRole.ERG_ADMIN.name())) {
            var dadosForm = service.salvarCadastro(dadosCadastro);
            return dadosForm;
        } else {
            throw new AppException("Erro ao cadastrar.");
        }
    }

    @GetMapping("/{id}")
    public FormularioCadastro getClientById(@PathVariable Long id) {
        var response = service.getClient(id);
        return response;
    }

    @GetMapping("/all")
    @ResponseStatus(HttpStatus.OK)
    public List<FormularioCadastro> getAllClients() {
        List<FormularioCadastro> response = service.getAllClients();
        if (response.isEmpty()) {
            throw new AppException("Usuários não encontrados");
        } else {
            return response;
        }
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.deleteClient(id);
    }

    @PutMapping("/{id}")
    public void update(@PathVariable String id, @RequestBody @Valid FormularioCadastro client) {
        if (client.getRole().equals(UserRole.ERG_ADMIN.name())) {
            service.updateClient(id, client);
        } else {
            throw new AppException("Erro ao atualizar.");
        }
    }
}
