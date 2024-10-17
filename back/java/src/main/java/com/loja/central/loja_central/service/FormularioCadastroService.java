package com.loja.central.loja_central.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.loja.central.loja_central.dto.FormularioCadastroDTO;
import com.loja.central.loja_central.enums.UserRole;
import com.loja.central.loja_central.exceptions.AppException;
import com.loja.central.loja_central.model.FormularioCadastro;
import com.loja.central.loja_central.repository.FormularioCadastroRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FormularioCadastroService {

    @Autowired
    private FormularioCadastroRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public ResponseEntity<String> salvarCadastro(FormularioCadastroDTO dadosCadastro) {
        try {
            if (dadosCadastro != null) {
                FormularioCadastro newUser = criarFormularioCadastro(dadosCadastro);
                FormularioCadastro userExists = repository.findDetailsByEmail(newUser.getEmail());

                if (userExists == null) {
                    FormularioCadastro userSaved = repository.save(newUser);

                    if (userSaved != null) {
                        return ResponseEntity.status(HttpStatus.CREATED).body("Cadastro realizado com sucesso.");
                    } else {
                        throw new AppException("Erro ao cadastrar.");
                    }
                } else {
                    throw new AppException("Os dados do usuário já existem no sistema.");
                }
            } else {
                throw new AppException("Dados inválidos.");
            }
        } catch (AppException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Ocorreu um erro ao processar a solicitação. Tente novamente mais tarde.");
        }
    }

    private FormularioCadastro criarFormularioCadastro(FormularioCadastroDTO cadastro) {
        LocalDateTime horaAtual = LocalDateTime.now();

        return new FormularioCadastro(null, UserRole.ERG_ADMIN.getRole(), cadastro.ativo(),
                cadastro.nomeCompleto(),
                cadastro.email(), passwordEncoder.encode(cadastro.senha()), horaAtual);
    }

    public FormularioCadastro getClient(Long id) {
        return repository
                .findById(id)
                .orElseThrow(() -> new AppException("Usuário não encontrado."));
    }

    public List<FormularioCadastro> getAllClients() {
        List<FormularioCadastro> clientsList = repository.findAll();

        if (!clientsList.isEmpty()) {
            return clientsList;

        } else {
            throw new AppException("Usuários não encontrados.");
        }
    }

    public void deleteClient(Long id) {
        repository.findById(id)
                .map(client -> {
                    repository.delete(client);
                    return client;
                }).orElseThrow(() -> new AppException("Usuário não encontrado"));
    }

    @Transactional
    public void updateClient(String id, FormularioCadastro client) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication.isAuthenticated() && authentication.getPrincipal() instanceof FormularioCadastro) {
                FormularioCadastro user = (FormularioCadastro) authentication.getPrincipal();
                var newUser = (FormularioCadastro) repository.findByEmail(user.getEmail());

                repository
                        .findById(newUser.getId())
                        .map(currentClient -> {
                            client.setId(currentClient.getId());
                            client.setRole(currentClient.getRole());
                            client.setSenha(currentClient.getSenha());
                            repository.save(client);
                            return repository;
                        });
                ResponseEntity.ok("Usuário atualizado");
            } else {
                throw new AppException("Usuário não autenticado.");
            }
        } catch (Exception e) {
            ResponseEntity.status(200).body("Erro ao obter informações do usuário");
        }
    }

    public FormularioCadastro getUserToken() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication.isAuthenticated() && authentication.getPrincipal() instanceof FormularioCadastro) {
                FormularioCadastro user = (FormularioCadastro) authentication.getPrincipal();
                FormularioCadastro newUser = (FormularioCadastro) repository.findByEmail(user.getEmail());

                return newUser;
            } else {
                throw new AppException("Usuário não autenticado.");
            }
        } catch (Exception e) {
            return null;
        }
    }
}
