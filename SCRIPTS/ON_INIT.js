importClass("VSqlDatabase");
importClass("VProcess");
importClass("VByteArray");

let driver = "ODBCS";
let dan = "mysql_unicode";
let opciones = "";
let servidor = "prueba";
let puerto = "3306";
let usuario = "root";
let passwd = "";

if (getPreguntar()) {
    let bImportarDatos = confirm("Quieres importar los datos?");

    if (bImportarDatos) {
        if (importDB(driver, dan)) {
            console.log("Success - ¡Proceso Finalizado!");
            setPreguntar(0);
        } else {
            alert("Error - El proceso no finalizo correctamente");
        }
    } else {
        let bPreguntar = confirm("\n¿Estás Seguro?");
        setPreguntar(bPreguntar);
    }
}

function importDB(driver, dan) {
    theRoot.initProgressBar();
    let bOk = true;
    let nLoteSize = 1000; // Registros por lote que se enviarán al servidor
    let bdExterna = new VSqlDatabase();

    if (bdExterna) {
        bdExterna.configure(driver, dan, opciones, servidor, puerto);
        let bOpen = bdExterna.open(usuario, passwd);

        if (bOpen) {
            let aszTablas = bdExterna.tables(1); //Tablas Visibles para el user

            if (aszTablas.lenght) {
                //recorremos las tablas
                for (let i = 0; i < aszTablas.length; ++i) {
                    // tabla que importamos
                    let sizeTabla = aszTablas[i];
                    theRoot.setProgress(1 / aszTablas.length * 100);
                    theRoot.setTitle("Tabla en curso:\t" + sizeTabla);

                    //cargamos registros
                    // Identificador con espacios
                    let szSelect = "SELECT * FROM" + (sizeTabla.indexOf(" ", 0) > -1 ? "\u0022" + sizeTabla + "\u0022" : sizeTabla);

                    if (bdExterna.executeSQL(szSelect)) {
                        let sizeNombreCampoCodigo = getNombreCampoCodigo(sizeTabla);
                        let aszCol = [];
                        let nCampos = bdExterna.fieldCount(sizeTabla);

                        for (let nCol = 0; nCol < nCampos; ++nCol) {
                            aszCol[nCol] = bdExterna.getColumName(nCol).toUpperCase();

                            if (sizeNombreCampoCodigo.toUpperCase() === aszCol[nCol].toUpperCase()) {
                                aszCol[nCol] = "ID";
                            }
                        }
                        let tablaDatos = [];
                        let nReg = 0;
                        let bSiguienteRegistro = bdExterna.nextRegister();

                        while (bSiguienteRegistro) {
                            // Damos de alta los lotes
                            while (bSiguienteRegistro && nLoteSize > tablaDatos.length) {
                                let registro = [];
                                nReg++;
                                // Asignación de campos

                                for (let nCol = 0; nCol < nCampos; ++nCol) {
                                    if (!isBinaryObjectFieldType(sizeTabla, aszCol[nCol])) {
                                        registro[aszCol[nCol]] = bdExterna.getColumn(nCol);
                                    } else {
                                        let ba = VByteArray();
                                        ba = bdExterna.getColumn(nCol);
                                        let baComprimido = ba.compress();
                                        registro[aszCol[nCol]] = baComprimido.toBase64().toLatin1String();
                                    }
                                }
                                // Guardar Info registro
                                tablaDatos.push(registro);
                                // Permitir Refresh interfaz
                                theApp.processEvents();
                                // Sig registro
                                bSiguienteRegistro = bdExterna.nextRegister();
                            }
                            // Envío Servidor
                            theRoot.setTitle("\nTabla en curso:\t" + sizeTabla + ". " + nReg + "\t" + "registros en cola. ");
                            if (!procesoImportacion(sizeTabla, tablaDatos)) {
                                console.log("\n Error - No se ha podido ejecutar el proceso de alta de la tabla " + sizeTabla);
                                bOk = false;
                            }
                            tablaDatos = [];

                        }
                    } else {
                        console.log("Error - Error en la ejecución de Sentencia SQL: " + szSelect + ". " + bdExterna.getLastError());
                        bOk = false;
                    }
                }
            } else {
                console.log("Error - La tabla está vacía" + bdExterna.getLastError());
                bOk = false;
            }
        } else {
            console.log("Error - Error en la conexión: " + bdExterna.getLastError());
            bOk = false;
        }
    } else {
        console.log("Error - No se ha podido acceder a la base de datos: " + bdExterna.getLastError());
        bOk = false;
    }
}