/**
 * SARAH IA Core v5.2 PRO - Módulo Cidadão Sensor
 * Linguagem: JavaScript (Vanilla / ES6+)
 * Contexto: Defesa Civil Comunitária • Grupo Comunitário A Chave da Esperança (Mesquita/RJ)
 */

class SarahIACore {
    constructor(config = {}) {
        this.versao = "5.2 PRO";
        this.localidade = config.localidade || "Mesquita/RJ";
        this.baciasAtendidas = ["Sarapuí", "Dona Eugênia", "Prata"];
        this.telefonesEmergencia = {
            defesaCivil: "199",
            bombeiros: "193",
            crasRochaSobrinho: "(21) 2042-8931"
        };
    }

    /**
     * Processa mensagens do chat e retorna a diretriz da IA baseada em palavras-chave.
     * @param {string} mensagemUsuario 
     * @returns {string} Resposta formatada da SARAH
     */
    processarMensagem(mensagemUsuario) {
        if (!mensagemUsuario || typeof mensagemUsuario !== 'string') {
            return "Por favor, insira uma instrução válida.";
        }

        const termo = mensagemUsuario.toLowerCase();

        if (termo.includes('sarapuí') || termo.includes('rio') || termo.includes('enchente')) {
            return `⚠️ [ALERTA HIDROLÓGICO]: Monitoramento ativo para os rios ${this.baciasAtendidas.join(', ')}. Em caso de transbordo no trecho de Rocha Sobrinho, acione imediatamente a base comunitária.`;
        } 
        
        if (termo.includes('emergencia') || termo.includes('ajuda') || termo.includes('socorro')) {
            return `🚨 [EMERGÊNCIA]: Contate a Defesa Civil Municipal ligando para ${this.telefonesEmergencia.defesaCivil} ou o Corpo de Bombeiros em ${this.telefonesEmergencia.bombeiros}.`;
        }

        return `🤖 [SARAH IA v${this.versao}]: Sistema operacional em ${this.localidade}. Monitorando bacias hidrográficas e diretrizes do Grupo Comunitário A Chave da Esperança. Como posso auxiliar tecnicamente?`;
    }

    /**
     * Gera um relatório estruturado de vistoria de campo para envio rápido.
     * @param {Object} dadosOcorrencia 
     * @returns {string} Texto formatado para o WhatsApp
     */
    gerarRelatorioCampo(dadosOcorrencia) {
        const { local, severidade, descricao } = dadosOcorrencia;
        const dataHora = new Date().toLocaleString('pt-BR');

        return `🚨 *RELATÓRIO DE CAMPO - CIDADÃO SENSOR* 🚨\n` +
               `📍 *Local:* ${local || 'Não especificado'}\n` +
               `⚠️ *Severidade:* ${severidade || 'MONITORAMENTO'}\n` +
               `📝 *Descrição:* ${descricao || 'Sem observações'}\n` +
               `⏱️ *Data/Hora:* ${dataHora}\n` +
               `👥 *Grupo Comunitário A Chave da Esperança (Mesquita/RJ)*\n` +
               `#DefesaCivil #MesquitaResiliente`;
    }
}

// Exemplo de uso imediato:
// const sarah = new SarahIACore();
// console.log(sarah.processarMensagem("Como está o Rio Sarapuí?"));
