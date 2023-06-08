const ExcelJS = require('exceljs'),
workbook = new ExcelJS.Workbook(),
express = require('express'),
app = express(),
fileUpload = require("express-fileupload"),
path = require('path')



const polosAnakS = 14900,
		polosAnakM = 16899,
		polosAnakL = 18899,
		polosAnakXL = 23899,
	  salurAnakS = 17500,
	    salurAnakM = 19500,
	    salurAnakL = 21500,
	    salurAnakXL = 25500,
	  sakuBatikAnakS = 18900,
	    sakuBatikAnakM = 19900,
	    sakuBatikAnakL = 22900,
	    sakuBatikAnakXL = 25900,
	  sakuHawaiiAnakS = 18900,
	    sakuHawaiiAnakM = 19900,
	    sakuHawaiiAnakL = 22900,
	    sakuHawaiiAnakXL = 25900,
	  sakuWAnakS = 18900,
	    sakuWAnakM = 19900,
	    sakuWAnakL = 22900,
	    sakuWAnakXL = 25900,
	  sakuWarnaAnakS = 18900,
	    sakuWarnaAnakM = 19900,
	    sakuWarnaAnakL = 22900,
	    sakuWarnaAnakXL = 25900,
	  stelanAnakS = 26900,
	    stelanAnakM = 29900,
	    stelanAnakL = 34900,
	    stelanAnakXL = 43900,
	    // stelanAnakL = 34899,
	    // stelanAnakXL = 43899,
	  stelanAnakRegelanS = 29900,
	    stelanAnakRegelanM = 35900,
	    stelanAnakRegelanL = 39900,
	    stelanAnakRegelanXL = 45900,
	  celanaAnakS = 13900,
	    celanaAnakM = 15900,
	    celanaAnakL = 17900,
	    celanaAnakXL = 21900








app.use(express.static('./dist'))
app.use(fileUpload());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('index'));

app.post('/upload', (req, res) => {

    workbook.xlsx.load(req.files.ExcelFile.data)
        .then(async function () {
            const worksheet = workbook.getWorksheet('Sheet1');

            worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
				console.log(row.values[1])

                 if (row.values[3].includes("Kuning")) {

                     if (row.values[11] == "Menunggu Konfirmasimu") {
                             row.getCell(12).value = 'Tolak'
                     }
                 }
                 if (row.values[3].includes("Turkis")) {

                     if (row.values[11] == "Menunggu Konfirmasimu") {
                             row.getCell(12).value = 'Tolak'
                     }
                 }
                 if (row.values[1].includes("Kurta")) {

                     if (row.values[11] == "Menunggu Konfirmasimu") {
                             row.getCell(12).value = 'Tolak'
                     }
                 }

                if (row.values[7] == 0 && row.values[11] == "Menunggu Konfirmasimu") {
                    row.getCell(12).value = 'Tolak'
                }


				if (row.values[1] == 'KAOS POLOS ANAK LENGAN PENDEK COTTON COMBED 30S BAJU KAOS KIDS WARNA SOLID' && row.values[11] == "Menunggu Konfirmasimu" && row.values[7] != 0) {

					if (row.values[3].toLowerCase().includes(",s")) {

						row.getCell(6).value = polosAnakS
						row.getCell(7).value = polosAnakS
						row.getCell(12).value = 'Ubah'
					} else if (row.values[3].toLowerCase().includes(",m")) {

						row.getCell(6).value = polosAnakM
						row.getCell(7).value = polosAnakM
						row.getCell(12).value = 'Ubah'
					} else if (row.values[3].toLowerCase().includes(",l")) {

						row.getCell(6).value = polosAnakL
						row.getCell(7).value = polosAnakL
						row.getCell(12).value = 'Ubah'
					}else if (row.values[3].toLowerCase().includes(",xl")) {

						row.getCell(6).value = polosAnakXL
						row.getCell(7).value = polosAnakXL
						row.getCell(12).value = 'Ubah'
					}

				}


			if (row.values[1] == 'KAOS POLOS ANAK LENGAN PENDEK COTTON COMBED 30S BAJU KAOS KIDS UMUR 0- 12 TAHUN' && row.values[11] == "Menunggu Konfirmasimu" && row.values[7] != 0){
                        if (row.values[3].toLowerCase().includes(",s")) {

                            row.getCell(6).value = polosAnakS
                            row.getCell(7).value = polosAnakS
                            row.getCell(12).value = 'Ubah'
                        } else if (row.values[3].toLowerCase().includes(",m")) {

                            row.getCell(6).value = polosAnakM
                            row.getCell(7).value = polosAnakM
                            row.getCell(12).value = 'Ubah'
                        } else if (row.values[3].toLowerCase().includes(",l")) {

                            row.getCell(6).value = polosAnakL
                            row.getCell(7).value = polosAnakL
                            row.getCell(12).value = 'Ubah'
                        }else if (row.values[3].toLowerCase().includes(",xl")) {

                            row.getCell(6).value = polosAnakXL
                            row.getCell(7).value = polosAnakXL
                            row.getCell(12).value = 'Ubah'
                        }
                    }
			if (row.values[1] == 'KAOS POLOS ANAK' && row.values[11] == "Menunggu Konfirmasimu" && row.values[7] != 0){
                        if (row.values[3].toLowerCase().includes(",s")) {

                            row.getCell(6).value = polosAnakS
                            row.getCell(7).value = polosAnakS
                            row.getCell(12).value = 'Ubah'
                        } else if (row.values[3].toLowerCase().includes(",m")) {

                            row.getCell(6).value = polosAnakM
                            row.getCell(7).value = polosAnakM
                            row.getCell(12).value = 'Ubah'
                        } else if (row.values[3].toLowerCase().includes(",l")) {

                            row.getCell(6).value = polosAnakL
                            row.getCell(7).value = polosAnakL
                            row.getCell(12).value = 'Ubah'
                        }else if (row.values[3].toLowerCase().includes(",xl")) {

                            row.getCell(6).value = polosAnakXL
                            row.getCell(7).value = polosAnakXL
                            row.getCell(12).value = 'Ubah'
                        }
                    }

				if (row.values[1] == "KAOS ANAK LAKI LAKI SAKU KEREN" && row.values[11] == "Menunggu Konfirmasimu" && row.values[7] != 0) {
						console.log(row.values[3])
                        if (row.values[3].toLowerCase().includes(",s")) {

                            row.getCell(6).value = salurAnakS
                            row.getCell(7).value = salurAnakS
                            row.getCell(12).value = 'Ubah'
                        } else if (row.values[3].toLowerCase().includes(",m")) {

                            row.getCell(6).value = salurAnakM
                            row.getCell(7).value = salurAnakM
                            row.getCell(12).value = 'Ubah'
                        } else if (row.values[3].toLowerCase().includes(",l")) {

                            row.getCell(6).value = salurAnakL
                            row.getCell(7).value = salurAnakL
                            row.getCell(12).value = 'Ubah'
                        } else if (row.values[3].toLowerCase().includes(",xl")) {

                            row.getCell(6).value = salurAnakXL
                            row.getCell(7).value = salurAnakXL
                            row.getCell(12).value = 'Ubah'
                        }

                    }

										if (row.values[1] == "KAOS ANAK SAKU  HAWAI" && row.values[11] == "Menunggu Konfirmasimu" && row.values[7] != 0) {
												console.log(row.values[3])
						                        if (row.values[3].toLowerCase().includes(",s")) {

						                            row.getCell(6).value = sakuHawaiiAnakS
						                            row.getCell(7).value = sakuHawaiiAnakS
						                            row.getCell(12).value = 'Ubah'
						                        } else if (row.values[3].toLowerCase().includes(",m")) {

						                            row.getCell(6).value = sakuHawaiiAnakM
						                            row.getCell(7).value = sakuHawaiiAnakM
						                            row.getCell(12).value = 'Ubah'
						                        } else if (row.values[3].toLowerCase().includes(",l")) {

						                            row.getCell(6).value = sakuHawaiiAnakL
						                            row.getCell(7).value = sakuHawaiiAnakL
						                            row.getCell(12).value = 'Ubah'
						                        } else if (row.values[3].toLowerCase().includes(",xl")) {

						                            row.getCell(6).value = sakuHawaiiAnakXL
						                            row.getCell(7).value = sakuHawaiiAnakXL
						                            row.getCell(12).value = 'Ubah'
						                        }

						     }
										if (row.values[1] == "KAOS ANAK SAKU GARIS W" && row.values[11] == "Menunggu Konfirmasimu" && row.values[7] != 0) {
												console.log(row.values[3])
						                        if (row.values[3].toLowerCase().includes(",s")) {

						                            row.getCell(6).value = sakuWAnakS
						                            row.getCell(7).value = sakuWAnakS
						                            row.getCell(12).value = 'Ubah'
						                        } else if (row.values[3].toLowerCase().includes(",m")) {

						                            row.getCell(6).value = sakuWAnakM
						                            row.getCell(7).value = sakuWAnakM
						                            row.getCell(12).value = 'Ubah'
						                        } else if (row.values[3].toLowerCase().includes(",l")) {

						                            row.getCell(6).value = sakuWAnakL
						                            row.getCell(7).value = sakuWAnakL
						                            row.getCell(12).value = 'Ubah'
						                        } else if (row.values[3].toLowerCase().includes(",xl")) {

						                            row.getCell(6).value = sakuWAnakXL
						                            row.getCell(7).value = sakuWAnakXL
						                            row.getCell(12).value = 'Ubah'
						                        }

						     }
										if (row.values[1] == "KAOS ANAK LAKI LAKI . BAJU ANAK LAKI LAKI SAKU KEREN" && row.values[11] == "Menunggu Konfirmasimu" && row.values[7] != 0) {
												console.log(row.values[3])
						                        if (row.values[3].toLowerCase().includes("s,")) {

						                            row.getCell(6).value = sakuWarnaAnakS
						                            row.getCell(7).value = sakuWarnaAnakS
						                            row.getCell(12).value = 'Ubah'
						                        } else if (row.values[3].toLowerCase().includes("m,")) {

						                            row.getCell(6).value = sakuWarnaAnakM
						                            row.getCell(7).value = sakuWarnaAnakM
						                            row.getCell(12).value = 'Ubah'
						                        } else if (row.values[3].toLowerCase().includes("l,")) {

						                            row.getCell(6).value = sakuWarnaAnakL
						                            row.getCell(7).value = sakuWarnaAnakL
						                            row.getCell(12).value = 'Ubah'
						                        } else if (row.values[3].toLowerCase().includes("xl,")) {

						                            row.getCell(6).value = sakuWarnaAnakXL
						                            row.getCell(7).value = sakuWarnaAnakXL
						                            row.getCell(12).value = 'Ubah'
						                        }

						     }
										if (row.values[1] == "KAOS ANAK  SAKU BATIK" && row.values[11] == "Menunggu Konfirmasimu" && row.values[7] != 0) {
												console.log(row.values[3])
						                        if (row.values[3].toLowerCase().includes(",s")) {

						                            row.getCell(6).value = sakuBatikAnakS
						                            row.getCell(7).value = sakuBatikAnakS
						                            row.getCell(12).value = 'Ubah'
						                        } else if (row.values[3].toLowerCase().includes(",m")) {

						                            row.getCell(6).value = sakuBatikAnakM
						                            row.getCell(7).value = sakuBatikAnakM
						                            row.getCell(12).value = 'Ubah'
						                        } else if (row.values[3].toLowerCase().includes(",l")) {

						                            row.getCell(6).value = sakuBatikAnakL
						                            row.getCell(7).value = sakuBatikAnakL
						                            row.getCell(12).value = 'Ubah'
						                        } else if (row.values[3].toLowerCase().includes(",xl")) {

						                            row.getCell(6).value = sakuBatikAnakXL
						                            row.getCell(7).value = sakuBatikAnakXL
						                            row.getCell(12).value = 'Ubah'
						                        }

						     }


                if (row.values[1] == "CELANA PENDEK ANAK BAHAN LEMBUT KATUN COMBED 30S USIA 0-12 TAHUN" &&  row.values[11] == "Menunggu Konfirmasimu" && row.values[7] != 0) {

                        // if (row.values[3].toLowerCase().includes("putih,s")) {

                            // row.getCell(6).value = celanaAnakS
                            // row.getCell(7).value = celanaAnakS
                            // row.getCell(12).value = 'Ubah'
                        // }else

						if (row.values[3] != "PUTIH,S") {

                            if (row.values[3].toLowerCase().includes(",s")) {
                                row.getCell(6).value = celanaAnakS
                                row.getCell(7).value = celanaAnakS
                                row.getCell(12).value = 'Ubah'
                            }
                            else if (row.values[3].toLowerCase().includes(",m")) {

                                row.getCell(6).value = celanaAnakM
                                row.getCell(7).value = celanaAnakM
                                row.getCell(12).value = 'Ubah'
                            } else if (row.values[3].toLowerCase().includes(",l")) {

                                row.getCell(6).value = celanaAnakL
                                row.getCell(7).value = celanaAnakL
                                row.getCell(12).value = 'Ubah'
                            } else if (row.values[3].toLowerCase().includes(",xl")) {

                                row.getCell(6).value = celanaAnakXL
                                row.getCell(7).value = celanaAnakXL
                                row.getCell(12).value = 'Ubah'
                            }
                        }
                }
                if (row.values[1] == "STELAN BAYI DAN ANAK, KAOS STELAN BAHAN KATUN COMBED 30S USIA 0-12 TAHUN" &&  row.values[11] == "Menunggu Konfirmasimu" && row.values[7] != 0) {

                        if (row.values[3].toLowerCase().includes(",s")) {

                            row.getCell(6).value = stelanAnakS
                            row.getCell(7).value = stelanAnakS
                            row.getCell(12).value = 'Ubah'

							// if (row.values[3].toLowerCase().includes("putih,s")) {
								// row.getCell(6).value = stelanAnakM
								// row.getCell(7).value = stelanAnakM
								// row.getCell(12).value = 'Ubah'
							// }
                        }else if (row.values[3].toLowerCase().includes(",m")) {

                            row.getCell(6).value = stelanAnakM
                            row.getCell(7).value = stelanAnakM
                            row.getCell(12).value = 'Ubah'
                        } else if (row.values[3].toLowerCase().includes(",l")) {

                            row.getCell(6).value = stelanAnakL
                            row.getCell(7).value = stelanAnakL
                            row.getCell(12).value = 'Ubah'
                        }else if (row.values[3].toLowerCase().includes(",xl")) {

                            row.getCell(6).value = stelanAnakXL
                            row.getCell(7).value = stelanAnakXL
                            row.getCell(12).value = 'Ubah'
                        }
                }
                if (row.values[1] == "BAJU ANAK LAKI LAKI . KAOS ANAK LAKI LAKI KOMBINASI KEREN" &&  row.values[11] == "Menunggu Konfirmasimu" && row.values[7] != 0) {

                        if (row.values[3].toLowerCase().includes("s,")) {

                            row.getCell(6).value = 18900
                            row.getCell(7).value = 18900
                            row.getCell(12).value = 'Ubah'
                        }else if (row.values[3].toLowerCase().includes("m,")) {

                            row.getCell(6).value = 19900
                            row.getCell(7).value = 19900
                            row.getCell(12).value = 'Ubah'
                        } else if (row.values[3].toLowerCase().includes("l,")) {

                            row.getCell(6).value = 22900
                            row.getCell(7).value = 22900
                            row.getCell(12).value = 'Ubah'
                        }else if (row.values[3].toLowerCase().includes("xl,")) {

                            row.getCell(6).value = 25900
                            row.getCell(7).value = 25900
                            row.getCell(12).value = 'Ubah'
                        }
                }

                if (row.values[1].includes("Ringger") && row.values[11] == "Menunggu Konfirmasimu" && row.values[7] >= 50) {
                    row.getCell(6).value = 38900
                    row.getCell(7).value = 38900
                    row.getCell(12).value = 'Ubah'
                }

                 if (row.values[1] == "Fernco Kaos Pocket Misty. Baju Saku Kombinasi Cotton Combed 30s" && row.values[11] == "Menunggu Konfirmasimu" && row.values[7] >= 5) {
									 row.getCell(6).value = 39900
									 row.getCell(7).value = 39900
									 row.getCell(12).value = 'Ubah'
                 }

								 if (row.values[1] == "Fernco Kaos Saku Pria Batik . Baju Saku Kombinasi Pria" && row.values[11] == "Menunggu Konfirmasimu" && row.values[7] >= 5) {
									 row.getCell(6).value = 39900
									 row.getCell(7).value = 39900
									 row.getCell(12).value = 'Ubah'
                 }

                if (row.values[1] == "Fernco Kaos Pocket. Baju Saku Kombinasi Cotton Combed 30s" && row.values[11] == "Menunggu Konfirmasimu" && row.values[7] >= 5) {
                    row.getCell(6).value = 38900
                    row.getCell(7).value = 38900
                    row.getCell(12).value = 'Ubah'

                }

                if (row.values[1] == "Fernco Kaos Utro Tee Loreng Camo. Baju Kombinasi Cotton Combed 30s" && row.values[11] == "Menunggu Konfirmasimu" && row.values[7] >= 5 && row.values[7] != 0) {
                    row.getCell(6).value = 49900
                    row.getCell(7).value = 49900
                    row.getCell(12).value = 'Ubah'
                }
                if (row.values[1].includes("Fernco Kaos Utro Tee Loreng Camo. Baju Kombinasi Cotton Combed 30s Warna") && row.values[11] == "Menunggu Konfirmasimu" && row.values[7] >= 5 && row.values[7] != 0) {
                    row.getCell(6).value = 49900
                    row.getCell(7).value = 49900
                    row.getCell(12).value = 'Ubah'
                }
                if (row.values[1].includes("Fernco Kaos Pocket Loreng Camo. Baju Kombinasi Cotton Combed 30s Warna") && row.values[11] == "Menunggu Konfirmasimu" && row.values[7] >= 5 && row.values[7] != 0) {
                    row.getCell(6).value = 49900
                    row.getCell(7).value = 49900
                    row.getCell(12).value = 'Ubah'
                }

                if (row.values[1] == "Fernco Kaos Utro Tee. Baju Kombinasi Cotton Combed 30s" && row.values[11] == "Menunggu Konfirmasimu" && row.values[7] >= 5) {
                    row.getCell(6).value = 44900
                    row.getCell(7).value = 44900
                    row.getCell(12).value = 'Ubah'
                }
                if (row.values[1].includes("Fernco Kaos Utro Tee. Baju Kombinasi Cotton Combed 30s Warna") && row.values[11] == "Menunggu Konfirmasimu" && row.values[7] >= 5) {
                    row.getCell(6).value = 44900
                    row.getCell(7).value = 44900
                    row.getCell(12).value = 'Ubah'
                }
                if (row.values[1].includes("Fernco Kaos Utro Tee. Baju Kombinasi Cotton Combed 30s Hijau Warna") && row.values[11] == "Menunggu Konfirmasimu" && row.values[7] >= 5) {
                    row.getCell(6).value = 44900
                    row.getCell(7).value = 44900
                    row.getCell(12).value = 'Ubah'
                }
                if (row.values[1].includes("Fernco Kaos Pocket. Baju Saku Kombinasi Cotton Combed 30s Warna") && row.values[11] == "Menunggu Konfirmasimu" && row.values[7] >= 5) {
                    row.getCell(6).value = 38900
                    row.getCell(7).value = 38900
                    row.getCell(12).value = 'Ubah'
                }
                if (row.values[1] == "Fernco Kaos Saku Pria Hawaii. Baju Pocket Kombinasi" && row.values[11] == "Menunggu Konfirmasimu" && row.values[7] >= 5) {

                    row.getCell(6).value = 39900
                    row.getCell(7).value = 39900
                    row.getCell(12).value = 'Ubah'
                }

				if (row.values[1] == "KAOS DEWASA SAKU HAWAII WARNA PUTIH" && row.values[11] == "Menunggu Konfirmasimu" && row.values[7] >= 5) {
                    row.getCell(6).value = 39900
                    row.getCell(7).value = 39900
                    row.getCell(12).value = 'Ubah'
                }

                // if (row.values[1] == "Kaos pria saku W. Baju Pocket Pria" && row.values[11] == "Menunggu Konfirmasimu" && row.values[7] >= 5) {
                    // row.getCell(6).value = 36900
                    // row.getCell(7).value = 36900
                    // row.getCell(12).value = 'Ubah'
                // }
                 if (row.values[1] == "Fernco Kaos Utro Tee . Baju Kombinasi Hawaii" && row.values[11] == "Menunggu Konfirmasimu" && row.values[7] >= 5) {
                     row.getCell(6).value = 49900
                     row.getCell(7).value = 49900
                     row.getCell(12).value = 'Ubah'
                 }
                 // if (row.values[1].includes("Fernco Kaos Polos Lengan Pendek  Katun Combed 30s Warna") && row.values[11] == "Menunggu Konfirmasimu" && row.values[7] >= 5) {
                     // row.getCell(6).value = 35900
                     // row.getCell(7).value = 35900
// <<<<<<< HEAD
                     // row.getCell(12).value = 'Ubah'
                 // }

				 if (row.values[1].includes("KAOS POLOS PANJANG COTTON COMBED 30S - KAOS LENGAN PANJANG PRIA ROUND NECK REGULER FIT") && row.values[11] == "Menunggu Konfirmasimu" && row.values[7] >= 5) {
                     row.getCell(12).value = 'Tolak'
                 }

// =======
                     // row.getCell(12).value = 1
                 // }

				 // // if (row.values[1].includes("KAOS POLOS PANJANG COTTON COMBED 30S - KAOS LENGAN PANJANG PRIA ROUND NECK REGULER FIT") && row.values[11] == "Menunggu Konfirmasimu" && row.values[7] >= 5) {
                     // // row.getCell(12).value = 3
                 // // }

// <<<<<<< HEAD
				 // if (row.values[1].includes("Fernco Kaos Polos Lengan Pendek  Katun Combed 30s Warna") && row.values[11] == "Menunggu Konfirmasimu" && row.values[7] >= 5) {
                     // row.getCell(12).value = 3
                 // }
                // if (row.values[1].includes("Fernco Kaos Polos Lengan Panjang Katun Combed 30s") &&  row.values[11] == "Menunggu Konfirmasimu") {
                    // row.getCell(12).value = 3
                // }

				// if (row.values[1].includes("Fernco Kaos Polos Lengan Pendek Katun Combed 30s") &&  row.values[11] == "Menunggu Konfirmasimu") {
                    // row.getCell(12).value = 3
                // }

				// if (row.values[1] == "Kaos Polos Bahan Cotton, Combad 30s Unisex Cewek Cowok Casua" &&  row.values[11] == "Menunggu Konfirmasimu") {
                    // row.getCell(12).value = 3
                // }
// =======
// >>>>>>> 318f1bbb7472f9c4138c77aa0d8c8cb9d29647b5
				 if (row.values[1].includes("Fernco Kaos Polos Lengan Pendek  Katun Combed 30s Warna") && row.values[11] == "Menunggu Konfirmasimu" && row.values[7] >= 5) {
                     row.getCell(12).value = 'Tolak'
                 }
                if (row.values[1].includes("Fernco Kaos Polos Lengan Panjang Katun Combed 30s") &&  row.values[11] == "Menunggu Konfirmasimu") {
                    row.getCell(12).value = 'Tolak'
                }

				if (row.values[1].includes("Fernco Kaos Polos Lengan Pendek  Katun Combed 30s") &&  row.values[11] == "Menunggu Konfirmasimu") {
                    row.getCell(12).value = 'Tolak'
                }

				if (row.values[1] == "Kaos Polos Bahan Cotton, Combad 30s Unisex Cewek Cowok Casua" &&  row.values[11] == "Menunggu Konfirmasimu") {
                    row.getCell(12).value = 'Tolak'
                }
// >>>>>>> 9110a6281553ff52b7513c32f4a5ce170996b271
            });

            const buffer = await workbook.xlsx.writeBuffer();

            res.status(200)
            res.send(buffer)
            });


    })

const port = 3001;

app.listen(port, () => console.log(`Server started on port ${port}`));
