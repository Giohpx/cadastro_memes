package com.desenhos.cadastro_meme.controller;

import com.desenhos.cadastro_meme.business.DesenhoService;
import com.desenhos.cadastro_meme.infrastructure.entitys.Desenho;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/desenho")
@RequiredArgsConstructor
public class DesenhoController {

    private final DesenhoService desenhoService;

    @PostMapping
    public ResponseEntity<Void> salvarDesenho(@RequestBody Desenho desenho){
        desenhoService.salvarDesenho(desenho);
        return ResponseEntity.ok().build();
    }

    @GetMapping(params = "nome")
    public ResponseEntity<List<Desenho>> buscarDesenhosPorNome(@RequestParam String nome){
        return ResponseEntity.ok(desenhoService.buscarDesenhosPorNome(nome));
    }

    @DeleteMapping(params = "nome")
    public ResponseEntity<Void> deletarDesenhosPorNome(@RequestParam String nome){
        desenhoService.deletarDesenhosPorNome(nome);
        return ResponseEntity.ok().build();
    }

    @PutMapping
    public ResponseEntity<Void> atualizarDesenhoPorId(@RequestParam Long id,
                                                      @RequestBody Desenho desenho){
        desenhoService.atualizarDesenhoPorId(id, desenho);
        return ResponseEntity.ok().build();
    }
}