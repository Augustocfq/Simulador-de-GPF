document.addEventListener("DOMContentLoaded", () => {
   definir_segmentos();
});

function definir_segmentos() {
   const CS = Math.floor(Math.random() * 13);
   const SS = CS + 1;
   const DS = SS + 1;
   const ES = DS + 1;

   //atualizar inputs
   document.getElementById("reg-cs").textContent = formatar_segmentos(CS * 0x1000);
   document.getElementById("reg-ss").textContent = formatar_segmentos(SS * 0x1000);
   document.getElementById("reg-ds").textContent = formatar_segmentos(DS * 0x1000);
   document.getElementById("reg-es").textContent = formatar_segmentos(ES * 0x1000);

   //atualizar na memória inicio
   document.getElementById("reg-cs-mem").textContent = formatar_segmentos(CS * 0x1000);
   document.getElementById("reg-ss-mem").textContent = formatar_segmentos(SS * 0x1000);
   document.getElementById("reg-ds-mem").textContent = formatar_segmentos(DS * 0x1000);
   document.getElementById("reg-es-mem").textContent = formatar_segmentos(ES * 0x1000);

   //atualizar na memória fim
   document.getElementById("reg-cs-end").textContent = (formatar_segmentos(CS * 0x1000 + 0xFFF));
   document.getElementById("reg-ss-end").textContent = (formatar_segmentos(SS * 0x1000 + 0xFFF));
   document.getElementById("reg-ds-end").textContent = (formatar_segmentos(DS * 0x1000 + 0xFFF));
   document.getElementById("reg-es-end").textContent = (formatar_segmentos(ES * 0x1000 + 0xFFF));
}

function formatar_segmentos(num) {
   return (num ).toString(16).toUpperCase();
}