# SARAH AI Core v4.0 — G.C.E.

Sistema corporativo de Progressive Web App (PWA) de última geração voltado para o monitoramento hidrológico da bacia do Rio Sarapuí e Defesa Civil Comunitária, desenvolvido com estética inspirada no ecossistema OpenAI ("Obsidian Slate") e motor de inteligência artificial de alta performance integrado à Groq API.

## Especificações Técnicas e Arquitetura

* **Identidade Visual:** Tema *Obsidian Slate* em modo escuro profundo, estruturado em quatro pilares de cores (Obsidian Slate, Midnight Surface, Electric Cyan e Branco Neve/Cinza Metálico), com design 100% livre de emojis na interface.
* **Motor de IA:** Integração direta com a **Groq API** (`llama-3.3-70b-versatile`) via painel de configuração retrátil.
* **Conformidade Legal:** Tela de Aceite Obrigatório de Termos de Responsabilidade baseada em 4 pilares normativos exibida na primeira inicialização.
* **Mecanismo de Alerta:** Escudo inteligente de dupla função que atua como indicador dinâmico de status e botão de acionamento rápido para alarme de emergência da Defesa Civil.
* **Avatar Vetorial Animado:** Ícone corporativo da Sara estruturado em SVG modular com animações orgânicas de piscar de olhos e pulsos de telemetria em tempo real.
* **Gestão Temporal:** Saudações automatizadas ajustadas ao Horário de Brasília (Bom dia, Boa tarde, Boa noite, Boa madrugada) com introdução restrita exclusivamente ao primeiro turno da sessão.
* **Persistência de Dados:** Armazenamento local seguro (`localStorage`) para histórico de chat, com controle manual de limpeza de sessão.

## Acesso e Instalação (PWA)

O **SARAH AI Core v4.0** opera sob arquitetura de Progressive Web App (PWA) de acesso restrito e distribuído exclusivamente por meio de link oficial de implantação, preservando a integridade do código-fonte e a segurança institucional.

1. **Acesso via Link Oficial:** Acesse a aplicação por meio do link de distribuição corporativa fornecido pela gestão do projeto.
2. **Inicialização e Termos:** Na primeira inicialização, proceda com a leitura e o aceite obrigatório dos **Termos de Responsabilidade**.
3. **Credenciamento de IA:** Clique em **Configurar API** no cabeçalho superior direito, insira a sua credencial da **Groq API** e salve os parâmetros de conexão.
4. **Instalação do PWA:** Para utilizar o sistema de forma nativa e otimizada no dispositivo móvel ou desktop, utilize a função do navegador para "Instalar Aplicativo" ou "Adicionar à Tela Inicial" a partir do link oficial.

## Estrutura de Arquivos

```text
/
├── index.html       # Arquivo monolítico PWA contendo HTML, CSS e Lógica JS encapsulada
└── README.md        # Documentação oficial do projeto
