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

   if (IP > 0xfff || IP < 0) {
      const fisico = CS + IP;
      if (fisico >= SS && fisico <= SS + 0xfff) {
         erros.push(
            `GPF: IP invadiu segmento SS (CS:SS) → ${formatar_segmentos(
               fisico
            )}`
         );
      } else if (fisico >= DS && fisico <= DS + 0xfff) {
         erros.push(
            `GPF: IP invadiu segmento DS (CS:DS) → ${formatar_segmentos(
               fisico
            )}`
         );
      } else if (fisico >= ES && fisico <= ES + 0xfff) {
         erros.push(
            `GPF: IP invadiu segmento ES (CS:ES) → ${formatar_segmentos(
               fisico
            )}`
         );
      } else {
         erros.push(
            `GPF: IP acessou região inválida → ${formatar_segmentos(fisico)}`
         );
      }
   }

   if (SP > 0xfff || SP < 0) {
      const fisico = SS + SP;
      if (fisico >= CS && fisico <= CS + 0xfff) {
         erros.push(
            `GPF: SP invadiu segmento CS (SS:CS) → ${formatar_segmentos(
               fisico
            )}`
         );
      } else if (fisico >= DS && fisico <= DS + 0xfff) {
         erros.push(
            `GPF: SP invadiu segmento DS (SS:DS) → ${formatar_segmentos(
               fisico
            )}`
         );
      } else if (fisico >= ES && fisico <= ES + 0xfff) {
         erros.push(
            `GPF: SP invadiu segmento ES (SS:ES) → ${formatar_segmentos(
               fisico
            )}`
         );
      } else {
         erros.push(
            `GPF: SP acessou região inválida → ${formatar_segmentos(fisico)}`
         );
      }
   }

   if (BP > 0xfff || BP < 0) {
      const fisico = SS + BP;
      if (fisico >= CS && fisico <= CS + 0xfff) {
         erros.push(
            `GPF: BP invadiu segmento CS (SS:CS) → ${formatar_segmentos(
               fisico
            )}`
         );
      } else if (fisico >= DS && fisico <= DS + 0xfff) {
         erros.push(
            `GPF: BP invadiu segmento DS (SS:DS) → ${formatar_segmentos(
               fisico
            )}`
         );
      } else if (fisico >= ES && fisico <= ES + 0xfff) {
         erros.push(
            `GPF: BP invadiu segmento ES (SS:ES) → ${formatar_segmentos(
               fisico
            )}`
         );
      } else {
         erros.push(
            `GPF: BP acessou região inválida → ${formatar_segmentos(fisico)}`
         );
      }
   }

   if (SI > 0xfff || SI < 0) {
      const fisico = DS + SI;
      if (fisico >= CS && fisico <= CS + 0xfff) {
         erros.push(
            `GPF: SI invadiu segmento CS (DS:CS) → ${formatar_segmentos(
               fisico
            )}`
         );
      } else if (fisico >= SS && fisico <= SS + 0xfff) {
         erros.push(
            `GPF: SI invadiu segmento SS (DS:SS) → ${formatar_segmentos(
               fisico
            )}`
         );
      } else if (fisico >= ES && fisico <= ES + 0xfff) {
         erros.push(
            `GPF: SI invadiu segmento ES (DS:ES) → ${formatar_segmentos(
               fisico
            )}`
         );
      } else {
         erros.push(
            `GPF: SI acessou região inválida → ${formatar_segmentos(fisico)}`
         );
      }
   }

   if (DI > 0xfff || DI < 0) {
      const fisico = DS + DI;
      if (fisico >= CS && fisico <= CS + 0xfff) {
         erros.push(
            `GPF: DI invadiu segmento CS (DS:CS) → ${formatar_segmentos(
               fisico
            )}`
         );
      } else if (fisico >= SS && fisico <= SS + 0xfff) {
         erros.push(
            `GPF: DI invadiu segmento SS (DS:SS) → ${formatar_segmentos(
               fisico
            )}`
         );
      } else if (fisico >= ES && fisico <= ES + 0xfff) {
         erros.push(
            `GPF: DI invadiu segmento ES (DS:ES) → ${formatar_segmentos(
               fisico
            )}`
         );
      } else {
         erros.push(
            `GPF: DI acessou região inválida → ${formatar_segmentos(fisico)}`
         );
      }
   }

   if (erros.length === 0) {
      print_log("Nenhum GPF detectado.");
   } else {
      erros.forEach((e) => print_log(e));
   }
}
