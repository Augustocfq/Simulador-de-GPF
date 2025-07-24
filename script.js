let CS, SS, DS, ES, IP, SP, BP, DI, SI, tamCS, tamDS, tamES, tamSS;

document.addEventListener("DOMContentLoaded", () => {
   definir_segmentos();
});

document.getElementById("simulate-btn").addEventListener("click", () => {
   limpar_log();
   get_offsets();
   print_log(`O endereço físico de IP é: ${formatar_segmentos(CS + IP)}`);
   print_log(`O endereço físico de SP é: ${formatar_segmentos(SS + SP)}`);
   print_log(`O endereço físico de BP é: ${formatar_segmentos(SS + BP)}`);
   print_log(`O endereço físico de DI é: ${formatar_segmentos(DS + DI)}`);
   print_log(`O endereço físico de SI é: ${formatar_segmentos(DS + SI)}`);
   print_log(" ");
   verificar_gpf();
});

function definir_segmentos() {
   function segmento_aleatorio_inicio(min = 0x1000, max = 0xF000) {
      return Math.floor(Math.random() * ((max - min) / 0x10)) * 0x10 + min;
   }

   function tamanho_aleatorio(min = 1, max = 0xFFFF) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
   }

   const tamanhos = {};
   const inicios = {};

   inicios.CS = segmento_aleatorio_inicio();
   tamanhos.CS = tamanho_aleatorio();
   tamCS = tamanhos.CS;

   inicios.SS = inicios.CS + tamanhos.CS + 1;
   tamanhos.SS = tamanho_aleatorio();
   tamSS = tamanhos.SS;

   inicios.DS = inicios.SS + tamanhos.SS + 1;
   tamanhos.DS = tamanho_aleatorio();
   tamDS = tamanhos.DS;

   inicios.ES = inicios.DS + tamanhos.DS + 1;
   tamanhos.ES = tamanho_aleatorio();
   tamES = tamanhos.ES;

   CS = inicios.CS;
   SS = inicios.SS;
   DS = inicios.DS;
   ES = inicios.ES;

   document.getElementById("reg-cs").textContent = formatar_segmentos(CS);
   document.getElementById("reg-ss").textContent = formatar_segmentos(SS);
   document.getElementById("reg-ds").textContent = formatar_segmentos(DS);
   document.getElementById("reg-es").textContent = formatar_segmentos(ES);

   document.getElementById("reg-cs-mem").textContent = formatar_segmentos(CS);
   document.getElementById("reg-ss-mem").textContent = formatar_segmentos(SS);
   document.getElementById("reg-ds-mem").textContent = formatar_segmentos(DS);
   document.getElementById("reg-es-mem").textContent = formatar_segmentos(ES);

   document.getElementById("reg-cs-end").textContent = formatar_segmentos(CS + tamanhos.CS);
   document.getElementById("reg-ss-end").textContent = formatar_segmentos(SS + tamanhos.SS);
   document.getElementById("reg-ds-end").textContent = formatar_segmentos(DS + tamanhos.DS);
   document.getElementById("reg-es-end").textContent = formatar_segmentos(ES + tamanhos.ES);

   // Atualizar tamanhos
   document.getElementById("reg-cs-size").textContent = `${formatar_segmentos(tamanhos.CS)} Bytes`;
   document.getElementById("reg-ss-size").textContent = `${formatar_segmentos(tamanhos.SS)} Bytes`;
   document.getElementById("reg-ds-size").textContent = `${formatar_segmentos(tamanhos.DS)} Bytes`;
   document.getElementById("reg-es-size").textContent = `${formatar_segmentos(tamanhos.ES)} Bytes`;
}


function formatar_segmentos(num) {
   return num.toString(16).toUpperCase();
}

function get_offsets() {
   IP = parseInt(document.querySelector('input[name="ip"]').value || 0, 16);
   SP = parseInt(document.querySelector('input[name="sp"]').value || 0, 16);
   BP = parseInt(document.querySelector('input[name="bp"]').value || 0, 16);
   DI = parseInt(document.querySelector('input[name="di"]').value || 0, 16);
   SI = parseInt(document.querySelector('input[name="si"]').value || 0, 16);
}

function print_log(mensagem) {
   logOutput = document.getElementById("log-output");

   linha = document.createElement("div");
   linha.textContent = mensagem;

   logOutput.appendChild(linha);
   logOutput.scrollTop = logOutput.scrollHeight;
}

function limpar_log() {
   const logOutput = document.getElementById("log-output");
   logOutput.innerHTML = "";
}

function verificar_gpf() {
    const erros = [];

    const limCS = CS + tamCS - 1;
    const limDS = DS + tamDS - 1;
    const limSS = SS + tamSS - 1;
    const limES = ES + tamES - 1;

    if (IP >= tamCS || IP < 0) {
        const fisico = CS + IP;
        if (fisico >= SS && fisico <= limSS) {
            erros.push(`ERRO: GPF de Código em Pilha (CS:SS), Endereço físico: ${formatar_segmentos(fisico)}`);
        } else if (fisico >= DS && fisico <= limDS) {
            erros.push(`ERRO: GPF de Código em Dados (CS:DS), Endereço físico: ${formatar_segmentos(fisico)}`);
        } else if (fisico >= ES && fisico <= limES) {
            erros.push(`ERRO: GPF de Código em Dados (CS:ES), Endereço físico: ${formatar_segmentos(fisico)}`);
        } else {
            erros.push(`ERRO: GPF de Código em Área Inválida (CS:??), Endereço físico: ${formatar_segmentos(fisico)}`);
        }
    }

    if (SP >= tamSS || SP < 0) {
        const fisico = SS + tamSS - 1 - SP;
        if (fisico >= CS && fisico <= limCS) {
            erros.push(`ERRO: GPF de Pilha em Código (SS:CS), Endereço físico: ${formatar_segmentos(fisico)}`);
        } else if (fisico >= DS && fisico <= limDS) {
            erros.push(`ERRO: GPF de Pilha em Dados (SS:DS), Endereço físico: ${formatar_segmentos(fisico)}`);
        } else if (fisico >= ES && fisico <= limES) {
            erros.push(`ERRO: GPF de Pilha em Dados (SS:ES), Endereço físico: ${formatar_segmentos(fisico)}`);
        } else {
            erros.push(`ERRO: GPF de Pilha em Área Inválida (SS:??), Endereço físico: ${formatar_segmentos(fisico)}`);
        }
    }

    if (BP >= tamSS || BP < 0) {
        const fisico = SS + tamSS - 1 - BP;
        if (fisico >= CS && fisico <= limCS) {
            erros.push(`ERRO: GPF de Pilha em Código (SS:CS), Endereço físico: ${formatar_segmentos(fisico)}`);
        } else if (fisico >= DS && fisico <= limDS) {
            erros.push(`ERRO: GPF de Pilha em Dados (SS:DS), Endereço físico: ${formatar_segmentos(fisico)}`);
        } else if (fisico >= ES && fisico <= limES) {
            erros.push(`ERRO: GPF de Pilha em Dados (SS:ES), Endereço físico: ${formatar_segmentos(fisico)}`);
        } else {
            erros.push(`ERRO: GPF de Pilha em Área Inválida (SS:??), Endereço físico: ${formatar_segmentos(fisico)}`);
        }
    }

    if (SI >= tamDS || SI < 0) {
        const fisico = DS + SI;
        if (fisico >= CS && fisico <= limCS) {
            erros.push(`ERRO: GPF de Dados em Código (DS:CS), Endereço físico: ${formatar_segmentos(fisico)}`);
        } else if (fisico >= SS && fisico <= limSS) {
            erros.push(`ERRO: GPF de Dados em Pilha (DS:SS), Endereço físico: ${formatar_segmentos(fisico)}`);
        } else if (fisico >= ES && fisico <= limES) {
            erros.push(`ERRO: GPF de Dados em Dados (DS:ES), Endereço físico: ${formatar_segmentos(fisico)}`);
        } else {
            erros.push(`ERRO: GPF de Dados em Área Inválida (DS:??), Endereço físico: ${formatar_segmentos(fisico)}`);
        }
    }

    if (DI >= tamDS || DI < 0) {
        const fisico = DS + DI;
        if (fisico >= CS && fisico <= limCS) {
            erros.push(`ERRO: GPF de Dados em Código (DS:CS), Endereço físico: ${formatar_segmentos(fisico)}`);
        } else if (fisico >= SS && fisico <= limSS) {
            erros.push(`ERRO: GPF de Dados em Pilha (DS:SS), Endereço físico: ${formatar_segmentos(fisico)}`);
        } else if (fisico >= ES && fisico <= limES) {
            erros.push(`ERRO: GPF de Dados em Dados (DS:ES), Endereço físico: ${formatar_segmentos(fisico)}`);
        } else {
            erros.push(`ERRO: GPF de Dados em Área Inválida (DS:??), Endereço físico: ${formatar_segmentos(fisico)}`);
        }
    }

    if (erros.length === 0) {
        print_log("Nenhum GPF detectado.");
    } else {
        erros.forEach(e => print_log(e));
    }
}
