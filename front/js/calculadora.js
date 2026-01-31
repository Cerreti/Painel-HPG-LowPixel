function calcular() {

    let lista = [
        document.getElementById("value1").value,
        document.getElementById("value2").value,
        document.getElementById("value3").value,
        document.getElementById("value4").value
    ];

    let totalSegundos = 0;

    lista.forEach(hora => {
        if (!hora) return;

        let p = hora.split(":");

        let h = parseInt(p[0]) || 0;
        let m = parseInt(p[1]) || 0;
        let s = parseInt(p[2]) || 0;

        totalSegundos += h * 3600 + m * 60 + s;
    });

    let horas = Math.floor(totalSegundos / 3600);
    let minutos = Math.floor((totalSegundos % 3600) / 60);
    let segundos = totalSegundos % 60;

    let formatado = 
        String(horas).padStart(2, "0") + ":" +
        String(minutos).padStart(2, "0") + ":" +
        String(segundos).padStart(2, "0");

    document.getElementById("result").value = formatado;
}

function limparCalc() {
    const ids = ["value1","value2","value3","value4"];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";   // use .value para inputs
    });
    console.log("Campos limpos");
}

