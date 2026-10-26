package com.desenhos.cadastro_meme.controller;

import com.desenhos.cadastro_meme.business.DesenhoService;
import com.desenhos.cadastro_meme.infrastructure.entitys.Desenho;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping
    public ResponseEntity<Desenho> buscarDesenhoPorId(@RequestParam Long id){
        return ResponseEntity.ok(desenhoService.buscarDesenhoPorId(id));
    }

    @DeleteMapping
    public ResponseEntity<Void> deletarDesenho(@RequestParam Long id){
        desenhoService.deletarDesenho(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping
    public ResponseEntity<Void> atualizarDesenhoPorId(@RequestParam Long id,
                                                      @RequestBody Desenho desenho){
        desenhoService.atualizarDesenhoPorId(id, desenho);
        return ResponseEntity.ok().build();
    }
}