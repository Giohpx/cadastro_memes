package com.desenhos.cadastro_meme.infrastructure.entitys;

import jakarta.persistence.*;

@Entity
@Table(name = "desenhos")
public class Desenho {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true) // 'unique = true' garante que não existam emails repetidos
    private String email;

    @Column(nullable = false)
    private String descricao;

    @Column(nullable = false)
    private String urlImagem;

    public Desenho() {}

    public Desenho(String nome, String email, String descricao, String urlImagem) {
        this.nome = nome;
        this.email = email;
        this.descricao = descricao;
        this.urlImagem = urlImagem;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public String getUrlImagem() { return urlImagem; }
    public void setUrlImagem(String urlImagem) { this.urlImagem = urlImagem; }
}