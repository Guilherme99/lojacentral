package com.loja.central.loja_central.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.loja.central.loja_central.dto.LabelDTO;
import com.loja.central.loja_central.dto.SolicitacaoDTO;
import com.loja.central.loja_central.exceptions.ResourceNotFoundException;
import com.loja.central.loja_central.model.Arquivos;
import com.loja.central.loja_central.model.LabelSolicitacao;
import com.loja.central.loja_central.model.Solicitacoes;
import com.loja.central.loja_central.repository.ArquivosRepository;
import com.loja.central.loja_central.repository.LabelSolicitacaoRepository;
import com.loja.central.loja_central.repository.SolicitacaoRepository;

@Service
public class SolicitacoesService {

    @Autowired
    private SolicitacaoRepository solicitacaoRepository;

    @Autowired
    private ArquivosRepository arquivosRepository;

    @Autowired
    private LabelSolicitacaoRepository labelRepository;

    public Solicitacoes saveArquivo(SolicitacaoDTO data) {
        LocalDateTime horaAtual = LocalDateTime.now();
        ArrayList<LabelSolicitacao> listaLabels = new ArrayList<LabelSolicitacao>();
        Optional<Arquivos> arq = arquivosRepository.findById(data.idArquivo());

        if (arq.isPresent()) {
            Solicitacoes sol = new Solicitacoes();
            sol.setDataCriacao(horaAtual);
            sol.setArquivo(arq.get());
            sol.setNome(data.nome());

            solicitacaoRepository.save(sol);

            for (LabelDTO label : data.labels()) {
                LabelSolicitacao lbl = new LabelSolicitacao();
                lbl.setCoordX(label.coordX());
                lbl.setCoordY(label.coordY());
                lbl.setAltura(label.altura());
                lbl.setLargura(label.largura());
                lbl.setRotacao(label.rotacao());
                lbl.setTexto(label.texto());
                lbl.setCor(label.cor());
                lbl.setTamanhoFonte(label.tamanhoFonte());
                lbl.setFamiliaFonte(label.familiaFonte());
                lbl.setSolicitacao(sol);
                lbl.setDataCriacao(horaAtual);

                LabelSolicitacao newLabel = labelRepository.save(lbl);
                listaLabels.add(newLabel);
            }

            sol.setLabels(listaLabels);
            
            return sol;
        }

        return null;

    }

    public Solicitacoes buscarSolicitacao(Long id) {
        Solicitacoes sol = solicitacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitação não encontrado"));
        return sol;
    }

    public void deletarSolicitacao(Long id) {
        LocalDateTime horaAtual = LocalDateTime.now();
        Solicitacoes sol = solicitacaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id.toString()));

        List<LabelSolicitacao> labels = labelRepository.findBySolicitacaoIdAndDataRemocaoIsNull(sol.getId());
        sol.setLabels(labels);
        if (sol.getLabels() != null) {
            for (LabelSolicitacao label : sol.getLabels()) {
                label.setDataRemocao(horaAtual);
                labelRepository.save(label);
            }
        }

        sol.setDataRemocao(horaAtual);
        solicitacaoRepository.save(sol);
    }

    public Page<Solicitacoes> listarTodosSolicitacoes(Pageable pageable) {
        Page<Solicitacoes> sols = solicitacaoRepository.findAllByDataRemocaoIsNull(pageable);
        sols.forEach(sol -> {
            List<LabelSolicitacao> labels = labelRepository.findBySolicitacaoIdAndDataRemocaoIsNull(sol.getId());
            sol.setLabels(labels);
        });
        return sols;
    }

    public Page<Solicitacoes> filterSolicitacoes(String nome,
            Pageable pageable) {

        Page<Solicitacoes> sols = solicitacaoRepository.findAllByNome(nome, pageable);

        sols.forEach(sol -> {
            List<LabelSolicitacao> labels = labelRepository.findBySolicitacaoIdAndDataRemocaoIsNull(sol.getId());
            sol.setLabels(labels);
        });

        return sols;
    }

}
