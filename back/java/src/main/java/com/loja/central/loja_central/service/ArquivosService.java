package com.loja.central.loja_central.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.loja.central.loja_central.dto.ArquivoDTO;
import com.loja.central.loja_central.dto.LabelDTO;
import com.loja.central.loja_central.exceptions.ResourceNotFoundException;
import com.loja.central.loja_central.model.Arquivos;
import com.loja.central.loja_central.model.Label;
import com.loja.central.loja_central.repository.ArquivosRepository;
import com.loja.central.loja_central.repository.LabelRepository;

@Service
public class ArquivosService {

    @Autowired
    private ArquivosRepository arquivosRepository;

    @Autowired
    private LabelRepository labelRepository;

    public Arquivos saveArquivo(ArquivoDTO data) {
        LocalDateTime horaAtual = LocalDateTime.now();
        ArrayList<Label> listaLabels = new ArrayList<Label>();

        Arquivos arquivo = new Arquivos();
        arquivo.setBytes(gerarBytesArquivo(data.base64()));
        arquivo.setDataCriacao(horaAtual);
        arquivo.setNome(data.nome());

        arquivosRepository.save(arquivo);

        for (LabelDTO label : data.labels()) {
            Label lbl = new Label();
            lbl.setCoordX(label.coordX());
            lbl.setCoordY(label.coordY());
            lbl.setAltura(label.altura());
            lbl.setLargura(label.largura());
            lbl.setRotacao(label.rotacao());
            lbl.setTexto(label.texto());
            lbl.setCor(label.cor());
            lbl.setTamanhoFonte(label.tamanhoFonte());
            lbl.setFamiliaFonte(label.familiaFonte());
            lbl.setArquivo(arquivo);
            lbl.setDataCriacao(horaAtual);

            Label newLabel = labelRepository.save(lbl);
            listaLabels.add(newLabel);
        }

        arquivo.setLabels(listaLabels);

        return arquivo;
    }

    public Arquivos atualizarArquivo(ArquivoDTO data) {
        ArrayList<Label> listaLabels = new ArrayList<>();
        LocalDateTime horaAtual = LocalDateTime.now();

        // Tenta encontrar o arquivo pelo ID
        Arquivos arquivo = arquivosRepository.findById(data.id())
                .orElseThrow(() -> new RuntimeException("Arquivo não encontrado com ID: " + data.id()));

        // Atualiza os dados do arquivo
        arquivo.setBytes(gerarBytesArquivo(data.base64()));
        arquivo.setDataCriacao(arquivo.getDataCriacao());
        arquivo.setId(data.id());
        arquivo.setNome(data.nome());

        // Salva o arquivo atualizado
        arquivosRepository.save(arquivo);

        // Atualiza as labels associadas
        for (LabelDTO label : data.labels()) {
            Label lbl = new Label();
            lbl.setId(label.id());
            lbl.setCoordX(label.coordX());
            lbl.setCoordY(label.coordY());
            lbl.setAltura(label.altura());
            lbl.setLargura(label.largura());
            lbl.setRotacao(label.rotacao());
            lbl.setTexto(label.texto());
            lbl.setCor(label.cor());
            lbl.setTamanhoFonte(label.tamanhoFonte());
            lbl.setFamiliaFonte(label.familiaFonte());
            lbl.setArquivo(arquivo);
            lbl.setDataCriacao(horaAtual);

            // Salva a nova label
            Label newLabel = labelRepository.save(lbl);
            listaLabels.add(newLabel);
        }

        // Atualiza a lista de labels do arquivo
        arquivo.setLabels(listaLabels);

        return arquivo;
    }

    public byte[] gerarBytesArquivo(String base64) {
        String base64Content = base64;
        byte[] arquivoBytes = Base64.getDecoder().decode(base64Content);

        return arquivoBytes;
    }

    public byte[] buscarArquivo(Long id) {
        Arquivos arquivo = arquivosRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Arquivo não encontrado"));
        return arquivo.getBytes();
    }

    public void deletarArquivo(Long id) {
        LocalDateTime horaAtual = LocalDateTime.now();
        Arquivos arquivo = arquivosRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id.toString()));

        List<Label> labels = labelRepository.findByArquivoIdAndDataRemocaoIsNull(arquivo.getId());
        arquivo.setLabels(labels);
        if (arquivo.getLabels() != null) {
            for (Label label : arquivo.getLabels()) {
                label.setDataRemocao(horaAtual);
                labelRepository.save(label);
            }
        }
        arquivo.setDataRemocao(horaAtual);
        arquivosRepository.save(arquivo);
    }

    public Page<Arquivos> listarTodosArquivos(Pageable pageable) {
        Page<Arquivos> arquivos = arquivosRepository.findAllByDataRemocaoIsNull(pageable);

        arquivos.forEach(arq -> {
            List<Label> labels = labelRepository.findByArquivoIdAndDataRemocaoIsNull(arq.getId());
            arq.setLabels(labels);
        });

        return arquivos;
    }

    public Page<Arquivos> filterArquivos(String nome,
            Pageable pageable) {

        Page<Arquivos> arquivos = arquivosRepository.findAllByNome(nome, pageable);

        arquivos.forEach(arq -> {
            List<Label> labels = labelRepository.findByArquivoIdAndDataRemocaoIsNull(arq.getId());
            arq.setLabels(labels);
        });

        return arquivos;
    }

}
