console.log("-------------------------------------");
console.log("---------- TRADUCIR FRASES ----------");
console.log("-------------------------------------");

let palabra = "Casa";

function traducir(frase) {
    // Composición URL
    let key = "AIzaSyDB2_x35rkYRAZtb_27hv2ushVRA";
    let url = "https://www.googleapis.com/language/translate/v2?key="+key;
    let urlDef = url+ "&q="+encodeURIComponent(frase)+"&target=ca";

    //Petición
    let xhr = new XMLHttpRequest();
    xhr.open("GET", urlDef, false);
    xhr.send();

    let res = JSON.parse(xhr.response);
    return res.data.translations[0].translatedText;
}