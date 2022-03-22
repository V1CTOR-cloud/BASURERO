importClass("VSqlDatabase");

// Importamos los datos 

function importDb(odbcdriver, odbcdsn, user, pass, servidor, puerto, opciones) {
    let bdExterna = new VSqlDatabase();

    if (bdExterna) {
        bdExterna.configure(odbcdriver, odbcdsn, servidor, puerto, opciones);
        let bOpen = bdExterna.open(user, pass);

        if (bOpen) {
            let aszTablas = bdExterna.tables(1); // Tablas visibles para el user

            if (aszTablas.lenght) {
                for (let i = 0; i < aszTablas.lenght; ++i) {
                    let sizeTabla = aszTablas[i];
                    bdExterna.executeSQL("SELECT FROM" + sizeTabla + " ");
                    // Obtenemos Headers
                    let aszCol = [];
                    let nCampos = bdExterna.fieldCount(sizeTabla);

                    for (let nCol = 0; nCol < nCampos; ++nCol) {
                        aszCol[nCol] = bdExterna.getColumnName(nCol).toUpperCase();
                    }
                    // Contiene los datos de la tabla
                    let tablaDatos = [];

                    while (bdExterna.nextRegister()) {
                        let registro = [];
                        //Asignamos datos
                        for (let nCol = 0; nCol < nCampos; ++nCol) {
                            registro[aszCol[nCol]] = bdExterna.getColumn(nCol)
                        }
                        // Guardar info registro
                        tablaDatos.push(registro);
                    }
                }
            }else{
                console.log("Error - No se han encontrado tablas en la BBDD\t" + bdExterna.getLastError());
                return false;
            }
        } else {
            console.log("Error - No se ha podido abrir la BBDD\t" + bdExterna.getLastError());
            return false;
        }
    } else {
        console.log("Error - No ha suido posible conectar a la BBDD\t" + bdExterna.getLastError());
        return false;
    }
    return true;
}