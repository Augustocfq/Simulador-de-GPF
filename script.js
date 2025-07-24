let CS, SS, DS, ES, IP, SP, BP, DI, SI;

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
   CS = (Math.floor(Math.random() * 12) + 1) * 0x1000;
   SS = CS + 0x1000;
   DS = SS + 0x1000;
   ES = DS + 0x1000;

   //atualizar inputs
   document.getElementById("reg-cs").textContent = formatar_segmentos(CS);
   document.getElementById("reg-ss").textContent = formatar_segmentos(SS);
   document.getElementById("reg-ds").textContent = formatar_segmentos(DS);
   document.getElementById("reg-es").textContent = formatar_segmentos(ES);

   //atualizar na memória inicio
   document.getElementById("reg-cs-mem").textContent = formatar_segmentos(CS);
   document.getElementById("reg-ss-mem").textContent = formatar_segmentos(SS);
   document.getElementById("reg-ds-mem").textContent = formatar_segmentos(DS);
   document.getElementById("reg-es-mem").textContent = formatar_segmentos(ES);

   //atualizar na memória fim
   document.getElementById("reg-cs-end").textContent = formatar_segmentos(
      CS + 0xfff
   );
   document.getElementById("reg-ss-end").textContent = formatar_segmentos(
      SS + 0xfff
   );
   document.getElementById("reg-ds-end").textContent = formatar_segmentos(
      DS + 0xfff
   );
   document.getElementById("reg-es-end").textContent = formatar_segmentos(
      ES + 0xfff
   );
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

    if (IP > 0xFFF || IP < 0) {
        const fisico = CS + IP;
        if (fisico >= SS && fisico <= SS + 0xFFF) {
            erros.push(`ERRO: GPF de Código em Pilha (CS:SS), IP = ${IP}`);
        } else if (fisico >= DS && fisico <= DS + 0xFFF) {
            erros.push(`ERRO: GPF de Código em Dados (CS:DS), IP = ${IP}`);
        } else if (fisico >= ES && fisico <= ES + 0xFFF) {
            erros.push(`ERRO: GPF de Código em Dados (CS:ES), IP = ${IP}`);
        } else {
            erros.push(`ERRO: GPF de Código em Área Inválida (CS:?️), IP = ${IP}`);
        }
    }

    if (SP > 0xFFF || SP < 0) {
        const fisico = SS + SP;
        if (fisico >= CS && fisico <= CS + 0xFFF) {
            erros.push(`ERRO: GPF de Pilha em Código (SS:CS), SP = ${SP}`);
        } else if (fisico >= DS && fisico <= DS + 0xFFF) {
            erros.push(`ERRO: GPF de Pilha em Dados (SS:DS), SP = ${SP}`);
        } else if (fisico >= ES && fisico <= ES + 0xFFF) {
            erros.push(`ERRO: GPF de Pilha em Dados (SS:ES), SP = ${SP}`);
        } else {
            erros.push(`ERRO: GPF de Pilha em Área Inválida (SS:?️), SP = ${SP}`);
        }
    }

    if (BP > 0xFFF || BP < 0) {
        const fisico = SS + BP;
        if (fisico >= CS && fisico <= CS + 0xFFF) {
            erros.push(`ERRO: GPF de Pilha em Código (SS:CS), BP = ${BP}`);
        } else if (fisico >= DS && fisico <= DS + 0xFFF) {
            erros.push(`ERRO: GPF de Pilha em Dados (SS:DS), BP = ${BP}`);
        } else if (fisico >= ES && fisico <= ES + 0xFFF) {
            erros.push(`ERRO: GPF de Pilha em Dados (SS:ES), BP = ${BP}`);
        } else {
            erros.push(`ERRO: GPF de Pilha em Área Inválida (SS:?️), BP = ${BP}`);
        }
    }

    if (SI > 0xFFF || SI < 0) {
        const fisico = DS + SI;
        if (fisico >= CS && fisico <= CS + 0xFFF) {
            erros.push(`ERRO: GPF de Dados em Código (DS:CS), SI = ${SI}`);
        } else if (fisico >= SS && fisico <= SS + 0xFFF) {
            erros.push(`ERRO: GPF de Dados em Pilha (DS:SS), SI = ${SI}`);
        } else if (fisico >= ES && fisico <= ES + 0xFFF) {
            erros.push(`ERRO: GPF de Dados em Dados (DS:ES), SI = ${SI}`);
        } else {
            erros.push(`ERRO: GPF de Dados em Área Inválida (DS:?️), SI = ${SI}`);
        }
    }

    if (DI > 0xFFF || DI < 0) {
        const fisico = DS + DI;
        if (fisico >= CS && fisico <= CS + 0xFFF) {
            erros.push(`ERRO: GPF de Dados em Código (DS:CS), DI = ${DI}`);
        } else if (fisico >= SS && fisico <= SS + 0xFFF) {
            erros.push(`ERRO: GPF de Dados em Pilha (DS:SS), DI = ${DI}`);
        } else if (fisico >= ES && fisico <= ES + 0xFFF) {
            erros.push(`ERRO: GPF de Dados em Dados (DS:ES), DI = ${DI}`);
        } else {
            erros.push(`ERRO: GPF de Dados em Área Inválida (DS:?️), DI = ${DI}`);
        }
    }

    if (erros.length === 0) {
        print_log("Nenhum GPF detectado.");
    } else {
        erros.forEach(e => print_log(e));
    }
}