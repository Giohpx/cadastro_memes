package com.desenhos.cadastro_meme.infrastructure.repository;

import com.desenhos.cadastro_meme.infrastructure.entitys.Desenho;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DesenhoRepository extends JpaRepository<Desenho, Long> {

}