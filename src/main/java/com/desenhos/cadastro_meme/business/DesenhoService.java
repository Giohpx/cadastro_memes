package com.desenhos.cadastro_meme.business;

import com.desenhos.cadastro_meme.infrastructure.entitys.Desenho;
import com.desenhos.cadastro_meme.infrastructure.repository.DesenhoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DesenhoService {

    private final DesenhoRepository repository;

    public DesenhoService(DesenhoRepository repository) {
        this.repository = repository;
    }

    public Desenho salvarDesenho(Desenho desenho) {
        return repository.saveAndFlush(desenho);
    }

    public List<Desenho> buscarDesenhosPorNome(String nome) {
        return repository.findAllByNomeIgnoreCase(nome);
    }

    public List<Desenho> listarDesenhos() {
        return repository.findAll();
    }

    public void deletarDesenhosPorNome(String nome) {
        List<Desenho> desenhos = repository.findAllByNomeIgnoreCase(nome);
        if (desenhos.isEmpty()) {
            throw new RuntimeException("Desenho (Meme) não encontrado");
        }
        repository.deleteAll(desenhos);
    }

    public void atualizarDesenhoPorId(Long id, Desenho desenhoAtualizado) {
        Desenho desenhoEntity = repository.findById(id).orElseThrow(() ->
                new RuntimeException("Desenho (Meme) não encontrado"));

        if (desenhoAtualizado.getNome() != null) {
            desenhoEntity.setNome(desenhoAtualizado.getNome());
        }
        if (desenhoAtualizado.getDescricao() != null) {
            desenhoEntity.setDescricao(desenhoAtualizado.getDescricao());
        }
        if (desenhoAtualizado.getUrlImagem() != null) {
            desenhoEntity.setUrlImagem(desenhoAtualizado.getUrlImagem());
        }

        repository.saveAndFlush(desenhoEntity);
    }
}