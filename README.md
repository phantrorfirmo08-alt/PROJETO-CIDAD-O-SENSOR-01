🛡️ Sara IA — Defesa Civil Digital
Comunidade de Rocha Sobrinho,Sebinho
Mesquita - RJ

📌 Visão Geral
A Sara IA é uma assistente virtual progressiva (PWA) desenvolvida para atuar na Defesa Civil Digital da comunidade de Rocha Sobrinho (Mesquita - RJ). Integrada ao ecossistema do projeto Cidadão Sensor, a aplicação combina inteligência artificial conversacional de ponta com telemetria hidrometeorológica em tempo real para mitigar riscos socioambientais na Bacia do Sarapuí.
O sistema foi arquitetado como uma solução leve, de arquivo único (Single-File Architecture), garantindo alta performance, resiliência offline e total conformidade com a LGPD.
🚀 Principais Funcionalidades
🧠 Inteligência Artificial Generativa: Conectada ao modelo Gemini 2.5 Flash (via API Key do Google AI Studio), com personalidade acolhedora configurada para orientar moradores sobre prevenção de enchentes, deslizamentos e rotas de evacuação.
📊 Telemetria Hidrometeorológica: Gráficos interativos em tempo real alimentados pela API Open-Meteo, monitorando probabilidade de precipitação e temperatura para a região.
🌐 Modo Híbrido / Offline-First: Funciona mesmo sem conexão à internet (com respostas locais básicas) e registra-se como PWA, permitindo instalação direta na tela inicial de dispositivos móveis.
🎙️ Reconhecimento de Voz: Suporte nativo à API de Fala (Speech Recognition) para acessibilidade e interação rápida por voz.
🔒 Privacidade e LGPD: Armazenamento estritamente local (localStorage) de preferências, histórico de chat e chaves de API, sem envio de dados pessoais a servidores de terceiros.
🌙 Alternância de Temas: Suporte dinâmico aos modos Claro (Light) e Escuro (Dark).
🛠️ Stack Tecnológica

🛠️ Stack Tecnológica
CamadaTecnologia / BibliotecaFinalidade
FrontendHTML5, CSS3, JavaScript (ES6+)Interface responsiva e moderna de arquivo único
EstilizaçãoCSS Custom Properties, Font Awesome 6.4Design System adaptativo (Dark/Light)
Visualização de DadosChart.jsGráficos de telemetria climática
Inteligência ArtificialGoogle Gemini 2.5 Flash APIProcessamento de linguagem natural e diretrizes de defesa civil
Dados ClimáticosOpen-Meteo APIPrevisão meteorológica geolocalizada para Mesquita - RJ
ResiliênciaService Worker (Blob API)Cache offline e conversão PWA
