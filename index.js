const ExcelJS = require('exceljs'),
workbook = new ExcelJS.Workbook(),
express = require('express'),
app = express(),
fileUpload = require("express-fileupload")

app.use(express.static('./dist'))
app.use(fileUpload());
app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('index'));

app.post('/upload', (req, res) => {

    workbook.xlsx.load(req.files.ExcelFile.data)
        .then(async function () {
            const worksheet = workbook.getWorksheet('Sheet1');
            
            worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {

                 if (row.values[3].includes("Kuning")) {

                     if (row.values[12] == "1,2,3") {
                             row.getCell('M').value = 3
                     }
                 }
                 if (row.values[3].includes("Turkis")) {

                     if (row.values[12] == "1,2,3") {
                             row.getCell('M').value = 3
                     }
                 }
                 if (row.values[1].includes("Kurta")) {

                     if (row.values[12] == "1,2,3") {
                             row.getCell('M').value = 3
                     }
                 }

                if (row.values[8] == 0 && row.values[12] == "1,2,3") {
                    row.getCell('M').value = 3
                }

                
                if (row.values[1].toLowerCase().includes("polos anak")) {
                    if (row.values[1].toLowerCase().includes("warna solid") && row.values[12] == "1,2,3" && row.values[8] != 0) {

                        if (row.values[3].toLowerCase().includes(",s")) {

                            row.getCell('F').value = 12900
                            row.getCell('G').value = 12900
                            row.getCell('M').value = 1
                        } else if (row.values[3].toLowerCase().includes(",m")) {

                            row.getCell('F').value = 15900
                            row.getCell('G').value = 15900
                            row.getCell('M').value = 1
                        } else if (row.values[3].toLowerCase().includes(",l")) {

                            row.getCell('F').value = 17900
                            row.getCell('G').value = 17900
                            row.getCell('M').value = 1
                        }

                    } else if (row.values[1].toLowerCase().includes("umur 0- 12 tahun") && row.values[12] == "1,2,3" && row.values[8] != 0){
                        if (row.values[3].toLowerCase().includes(",s")) {

                            row.getCell('F').value = 13900
                            row.getCell('G').value = 13900
                            row.getCell('M').value = 1
                        } else if (row.values[3].toLowerCase().includes(",m")) {

                            row.getCell('F').value = 15900
                            row.getCell('G').value = 15900
                            row.getCell('M').value = 1
                        } else if (row.values[3].toLowerCase().includes(",l")) {

                            row.getCell('F').value = 17900
                            row.getCell('G').value = 17900
                            row.getCell('M').value = 1
                        }else if (row.values[3].toLowerCase().includes(",xl")) {

                            row.getCell('F').value = 22900
                            row.getCell('G').value = 22900
                            row.getCell('M').value = 1
                        }
                    }  
                }
				
				if (row.values[1] == "KAOS ANAK LAKI LAKI SAKU KEREN" && row.values[12] == "1,2,3" && row.values[8] != 0) {

                        if (row.values[3].toLowerCase().includes(",s")) {

                            row.getCell('F').value = 16900
                            row.getCell('G').value = 16900
                            row.getCell('M').value = 1
                        } else if (row.values[3].toLowerCase().includes(",m")) {

                            row.getCell('F').value = 18900
                            row.getCell('G').value = 18900
                            row.getCell('M').value = 1
                        } else if (row.values[3].toLowerCase().includes(",l")) {

                            row.getCell('F').value = 19900
                            row.getCell('G').value = 19900
                            row.getCell('M').value = 1
                        } else if (row.values[3].toLowerCase().includes(",xl")) {

                            row.getCell('F').value = 25900
                            row.getCell('G').value = 25900
                            row.getCell('M').value = 1
                        }

                    }
				
				
                if (row.values[1] == "CELANA PENDEK ANAK BAHAN LEMBUT KATUN COMBED 30S USIA 0-12 TAHUN" &&  row.values[12] == "1,2,3" && row.values[8] != 0) {

                        if (row.values[3].toLowerCase().includes("putih,s")) {

                            row.getCell('F').value = 11900
                            row.getCell('G').value = 11900
                            row.getCell('M').value = 1
                        }else if (row.values[3] != "PUTIH,S") {

                            if (row.values[3].toLowerCase().includes(",s")) {
                                row.getCell('F').value = 13900
                                row.getCell('G').value = 13900
                                row.getCell('M').value = 1
                            }
                            else if (row.values[3].toLowerCase().includes(",m")) {

                                row.getCell('F').value = 15900
                                row.getCell('G').value = 15900
                                row.getCell('M').value = 1
                            } else if (row.values[3].toLowerCase().includes(",l")) {

                                row.getCell('F').value = 17900
                                row.getCell('G').value = 17900
                                row.getCell('M').value = 1
                            } else if (row.values[3].toLowerCase().includes(",xl")) {

                                row.getCell('F').value = 21900
                                row.getCell('G').value = 21900
                                row.getCell('M').value = 1
                            }
                        } 
                }
                if (row.values[1] == "STELAN BAYI DAN ANAK, KAOS STELAN BAHAN KATUN COMBED 30S USIA 0-12 TAHUN" &&  row.values[12] == "1,2,3" && row.values[8] != 0) {

                        if (row.values[3].toLowerCase().includes(",s")) {

                            row.getCell('F').value = 23900
                            row.getCell('G').value = 23900
                            row.getCell('M').value = 1
							
							if (row.values[3].toLowerCase().includes("putih,s")) {
								row.getCell('F').value = 21900
								row.getCell('G').value = 21900
								row.getCell('M').value = 1
							}
                        }else if (row.values[3].toLowerCase().includes(",m")) {

                            row.getCell('F').value = 27900
                            row.getCell('G').value = 27900
                            row.getCell('M').value = 1
                        } else if (row.values[3].toLowerCase().includes(",l")) {

                            row.getCell('F').value = 32900
                            row.getCell('G').value = 32900
                            row.getCell('M').value = 1
                        }else if (row.values[3].toLowerCase().includes(",xl")) {

                            row.getCell('F').value = 41900
                            row.getCell('G').value = 41900
                            row.getCell('M').value = 1
                        }
                }
                if (row.values[1] == "BAJU ANAK LAKI LAKI . KAOS ANAK LAKI LAKI KOMBINASI KEREN" &&  row.values[12] == "1,2,3" && row.values[8] != 0) {

                        if (row.values[3].toLowerCase().includes("s,")) {

                            row.getCell('F').value = 18900
                            row.getCell('G').value = 18900
                            row.getCell('M').value = 1
                        }else if (row.values[3].toLowerCase().includes("m,")) {

                            row.getCell('F').value = 19900
                            row.getCell('G').value = 19900
                            row.getCell('M').value = 1
                        } else if (row.values[3].toLowerCase().includes("l,")) {

                            row.getCell('F').value = 22900
                            row.getCell('G').value = 22900
                            row.getCell('M').value = 1
                        }else if (row.values[3].toLowerCase().includes("xl,")) {

                            row.getCell('F').value = 25900
                            row.getCell('G').value = 25900
                            row.getCell('M').value = 1
                        }
                }

                if (row.values[1].includes("Ringger") && row.values[12] == "1,2,3" && row.values[8] >= 50) {
                    row.getCell('F').value = 37900
                    row.getCell('G').value = 37900
                    row.getCell('M').value = 1
                } 
				
                 if (row.values[1] == "Fernco Kaos Pocket Misty. Baju Saku Kombinasi Cotton Combed 30s" && row.values[12] == "1,2,3" && row.values[8] >= 5) {
					 row.getCell('F').value = 36900
					 row.getCell('G').value = 36900
					 row.getCell('M').value = 1
                 }

                if (row.values[1] == "Fernco Kaos Pocket. Baju Saku Kombinasi Cotton Combed 30s" && row.values[12] == "1,2,3" && row.values[8] >= 5) {
                    row.getCell('F').value = 36900
                    row.getCell('G').value = 36900
                    row.getCell('M').value = 1
                    
                }
                
                if (row.values[1] == "Fernco Kaos Utro Tee Loreng Camo. Baju Kombinasi Cotton Combed 30s" && row.values[12] == "1,2,3" && row.values[8] >= 5 && row.values[8] != 0) {
                    row.getCell('F').value = 46900
                    row.getCell('G').value = 46900
                    row.getCell('M').value = 1
                }

                if (row.values[1] == "Fernco Kaos Utro Tee. Baju Kombinasi Cotton Combed 30s" && row.values[12] == "1,2,3" && row.values[8] >= 5) {
                    row.getCell('F').value = 41900
                    row.getCell('G').value = 41900
                    row.getCell('M').value = 1
                }
                if (row.values[1].includes("Fernco Kaos Utro Tee. Baju Kombinasi Cotton Combed 30s Warna") && row.values[12] == "1,2,3" && row.values[8] >= 5) {
                    row.getCell('F').value = 41900
                    row.getCell('G').value = 41900
                    row.getCell('M').value = 1
                }
                if (row.values[1].includes("Fernco Kaos Pocket. Baju Saku Kombinasi Cotton Combed 30s Warna") && row.values[12] == "1,2,3" && row.values[8] >= 5) {
                    row.getCell('F').value = 36900
                    row.getCell('G').value = 36900
                    row.getCell('M').value = 1
                }
                if (row.values[1] == "Fernco Kaos Saku Pria Hawaii. Baju Pocket Kombinasi" && row.values[12] == "1,2,3" && row.values[8] >= 5) {

                    row.getCell('F').value = 37900
                    row.getCell('G').value = 37900
                    row.getCell('M').value = 1
                }
				
				if (row.values[1] == "KAOS DEWASA SAKU HAWAII WARNA PUTIH" && row.values[12] == "1,2,3" && row.values[8] >= 5) {
                    row.getCell('F').value = 37900
                    row.getCell('G').value = 37900
                    row.getCell('M').value = 1
                }
				
                if (row.values[1] == "Kaos pria saku W. Baju Pocket Pria" && row.values[12] == "1,2,3" && row.values[8] >= 5) {
                    row.getCell('F').value = 36900
                    row.getCell('G').value = 36900
                    row.getCell('M').value = 1
                }
                 if (row.values[1] == "Fernco Kaos Utro Tee . Baju Kombinasi Hawaii" && row.values[12] == "1,2,3" && row.values[8] >= 5) {
                     row.getCell('F').value = 37900
                     row.getCell('G').value = 37900
                     row.getCell('M').value = 1
                 }
                 if (row.values[1].includes("Fernco Kaos Polos Lengan Pendek  Katun Combed 30s Warna") && row.values[12] == "1,2,3" && row.values[8] >= 5) {
                     row.getCell('F').value = 37900
                     row.getCell('G').value = 37900
                     row.getCell('M').value = 1
                 } 
				 
				 if (row.values[1].includes("KAOS POLOS PANJANG COTTON COMBED 30S - KAOS LENGAN PANJANG PRIA ROUND NECK REGULER FIT") && row.values[12] == "1,2,3" && row.values[8] >= 5) {
                     row.getCell('M').value = 3
                 } 
				 
				 if (row.values[1].includes("Fernco Kaos Polos Lengan Pendek  Katun Combed 30s Warna") && row.values[12] == "1,2,3" && row.values[8] >= 5) {
                     row.getCell('M').value = 3
                 }
                if (row.values[1].includes("Fernco Kaos Polos Lengan Panjang Katun Combed 30s") &&  row.values[12] == "1,2,3") {
                    row.getCell('M').value = 3
                }
				
				if (row.values[1].includes("Fernco Kaos Polos Lengan Pendek Katun Combed 30s") &&  row.values[12] == "1,2,3") {
                    row.getCell('M').value = 3
                }
				
				if (row.values[1] == "Kaos Polos Bahan Cotton, Combad 30s Unisex Cewek Cowok Casua" &&  row.values[12] == "1,2,3") {
                    row.getCell('M').value = 3
                }
            });

            const buffer = await workbook.xlsx.writeBuffer();

            res.status(200)
            res.send(buffer)
            });


    })

const port = 3001;

app.listen(port, () => console.log(`Server started on port ${port}`));