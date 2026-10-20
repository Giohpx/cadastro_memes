package com.desenhos.cadastro_meme.controller;

import com.desenhos.cadastro_meme.bussines.EletronicoService;
import com.desenhos.cadastro_meme.infrastructure.entitys.Eletronico;
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
    public ResponseEntity<Desenho> buscarDesenhoPorEmail(@RequestParam String email){
        return ResponseEntity.ok(desenhoService.buscarDesenhoPorEmail(email));
    }

    @DeleteMapping
    public ResponseEntity<Void> deletarDesenhoPorEmail(@RequestParam String email){
        desenhoService.deletarDesenhoPorEmail(email);
        return ResponseEntity.ok().build();
    }

    @PutMapping
    public ResponseEntity<Void> atualizarDesenhoPorId(@RequestParam Integer id,
                                                      @RequestBody desenhoService usuario){
        desenhoService.atualizarDesenhoPorId(id, usuario);
        return ResponseEntity.ok().build();
    }
}
