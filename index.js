const ExcelJS = require('exceljs'),
workbook = new ExcelJS.Workbook(),
express = require('express'),
app = express(),
fileUpload = require("express-fileupload"),
decompress = require('decompress'),
fs = require('fs'),
path = require('path'),
bodyParser = require('body-parser');

let polosAnakS = null,
		polosAnakM = null,
		polosAnakL = null,
		polosAnakXL = null,
	  salurAnakS = null,
	    salurAnakM = null,
	    salurAnakL = null,
	    salurAnakXL = null,
	  sakuBatikAnakS = null,
	    sakuBatikAnakM = null,
	    sakuBatikAnakL = null,
	    sakuBatikAnakXL = null,
	  sakuHawaiiAnakS = null,
	    sakuHawaiiAnakM = null,
	    sakuHawaiiAnakL = null,
	    sakuHawaiiAnakXL = null,
	  sakuWAnakS = null,
	    sakuWAnakM = null,
	    sakuWAnakL = null,
	    sakuWAnakXL = null,
	  sakuWarnaAnakS = null,
	    sakuWarnaAnakM = null,
	    sakuWarnaAnakL = null,
	    sakuWarnaAnakXL = null,
	  stelanAnakS = null,
	    stelanAnakM = null,
	    stelanAnakL = null,
	    stelanAnakXL = null,
	  stelanAnakRegelanS = null,
	    stelanAnakRegelanM = null,
	    stelanAnakRegelanL = null,
	    stelanAnakRegelanXL = null,
	  celanaAnakS = null,
	    celanaAnakM = null,
	    celanaAnakL = null,
	    celanaAnakXL = null


app.use("/dist", express.static(path.join(__dirname, 'dist')));
app.use("/public", express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json()); // Parse JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(fileUpload());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const directoryPath = 'public/json/'; // Specify the directory path here
const fileName = 'products.json'; // Specify the file name here

const filePath = path.join(directoryPath, fileName);

// Function to read and edit a JSON file
function getJSONFile(filename) {
	try {
		const jsonData = fs.readFileSync(filename, 'utf8');
		const data = JSON.parse(jsonData);

		for (var i = 0; i < data.length; i++) {
				if (data[i].name.toLowerCase() == "polos anak") {
					if (data[i].sizes.S) {
						polosAnakS = data[i]["sizes"]["S"]
					}

					if (data[i].sizes.M) {
						polosAnakM = data[i]["sizes"]["M"]
					}

					if (data[i].sizes.L) {
						polosAnakL = data[i]["sizes"]["L"]
					}

					if (data[i].sizes.XL) {
						polosAnakXL = data[i]["sizes"]["XL"]
					}
				}

				if (data[i].name.toLowerCase() == "saku salur anak") {
					if (data[i].sizes.S) {
						salurAnakS = data[i]["sizes"]["S"]
					}

					if (data[i].sizes.M) {
						salurAnakM = data[i]["sizes"]["M"]
					}

					if (data[i].sizes.L) {
						salurAnakL = data[i]["sizes"]["L"]
					}

					if (data[i].sizes.XL) {
						salurAnakXL = data[i]["sizes"]["XL"]
					}
				}

				if (data[i].name.toLowerCase() == "saku anak batik") {
					if (data[i].sizes.S) {
						sakuBatikAnakS = data[i]["sizes"]["S"]
					}

					if (data[i].sizes.M) {
						sakuBatikAnakM = data[i]["sizes"]["M"]
					}

					if (data[i].sizes.L) {
						sakuBatikAnakL = data[i]["sizes"]["L"]
					}

					if (data[i].sizes.XL) {
						sakuBatikAnakXL = data[i]["sizes"]["XL"]
					}
				}

				if (data[i].name.toLowerCase() == "saku anak hawaii") {
					if (data[i].sizes.S) {
						sakuHawaiiAnakS = data[i]["sizes"]["S"]
					}

					if (data[i].sizes.M) {
						sakuHawaiiAnakM = data[i]["sizes"]["M"]
					}

					if (data[i].sizes.L) {
						sakuHawaiiAnakL = data[i]["sizes"]["L"]
					}

					if (data[i].sizes.XL) {
						sakuHawaiiAnakXL = data[i]["sizes"]["XL"]
					}
				}

				if (data[i].name.toLowerCase() == "saku anak garis w") {
					if (data[i].sizes.S) {
						sakuWAnakS = data[i]["sizes"]["S"]
					}

					if (data[i].sizes.M) {
						sakuWAnakM = data[i]["sizes"]["M"]
					}

					if (data[i].sizes.L) {
						sakuWAnakL = data[i]["sizes"]["L"]
					}

					if (data[i].sizes.XL) {
						sakuWAnakXL = data[i]["sizes"]["XL"]
					}
				}

				if (data[i].name.toLowerCase() == "saku anak warna") {
					if (data[i].sizes.S) {
						sakuWarnaAnakS = data[i]["sizes"]["S"]
					}

					if (data[i].sizes.M) {
						sakuWarnaAnakM = data[i]["sizes"]["M"]
					}

					if (data[i].sizes.L) {
						sakuWarnaAnakL = data[i]["sizes"]["L"]
					}

					if (data[i].sizes.XL) {
						sakuWarnaAnakXL = data[i]["sizes"]["XL"]
					}
				}

				if (data[i].name.toLowerCase() == "stelan anak") {
					if (data[i].sizes.S) {
						stelanAnakS = data[i]["sizes"]["S"]
					}

					if (data[i].sizes.M) {
						stelanAnakM = data[i]["sizes"]["M"]
					}

					if (data[i].sizes.L) {
						stelanAnakL = data[i]["sizes"]["L"]
					}

					if (data[i].sizes.XL) {
						stelanAnakXL = data[i]["sizes"]["XL"]
					}
				}

				if (data[i].name.toLowerCase() == "stelan regelan anak") {
					if (data[i].sizes.S) {
						stelanAnakRegelanS = data[i]["sizes"]["S"]
					}

					if (data[i].sizes.M) {
						stelanAnakRegelanM = data[i]["sizes"]["M"]
					}

					if (data[i].sizes.L) {
						stelanAnakRegelanL = data[i]["sizes"]["L"]
					}

					if (data[i].sizes.XL) {
						stelanAnakRegelanXL = data[i]["sizes"]["XL"]
					}
				}

				if (data[i].name.toLowerCase() == "celana anak") {
					if (data[i].sizes.S) {
						celanaAnakS = data[i]["sizes"]["S"]
					}

					if (data[i].sizes.M) {
						celanaAnakM = data[i]["sizes"]["M"]
					}

					if (data[i].sizes.L) {
						celanaAnakL = data[i]["sizes"]["L"]
					}

					if (data[i].sizes.XL) {
						celanaAnakXL = data[i]["sizes"]["XL"]
					}
				}
		}
	} catch (err) {
		console.error(`Error editing ${filename}:`, err);
	}
}

app.get('/', (req, res) => {
	getJSONFile(filePath);
	res.render('index')
});

app.get('/products', (req, res) => {
  const directoryPath = 'public/json/';
  const fileName = "products.json";
  const filePath = path.join(directoryPath, fileName);

	const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  // Read the JSON data from the file
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }

    const jsonData = JSON.parse(data);

    // Calculate the starting and ending index for the current page
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // Slice the items array based on the calculated indices
    const paginatedItems = jsonData.slice(startIndex, endIndex);

    // Calculate the total number of pages
    const totalPages = Math.ceil(jsonData.length / limit);

    // Prepare the response object
    const response = {
      items: paginatedItems,
      totalPages: totalPages,
    };

    res.json(response);
})
})

app.post('/products/:id/edit', (req, res) => {

  const productId = req.params.id
	const formData = req.body;

	let nameProduct = null;
	let priceProductSizeS = null;
  let priceProductSizeM = null;
  let priceProductSizeL = null;
  let priceProductSizeXL = null;

	const directoryPath = 'public/json/'; // Specify the directory path here
	const fileName = 'products.json'; // Specify the file name here

	const filePath = path.join(directoryPath, fileName);

  let priceProduct = {
    S: null,
    M: null,
    L: null,
    XL: null
  }

  if (formData.priceProductSizeS) {
		priceProduct.S = parseInt(formData.priceProductSizeS)
	}

  if (formData.priceProductSizeM) {
		priceProduct.M = parseInt(formData.priceProductSizeM)
	}

  if (formData.priceProductSizeL) {
		priceProduct.L = parseInt(formData.priceProductSizeL)
	}

  if (formData.priceProductSizeXL) {
		priceProduct.XL = parseInt(formData.priceProductSizeXL)
	}

  if (formData.nameProduct) {
		nameProduct = formData.nameProduct;
	}

  // Function to read and edit a JSON file
  function editJSONFile(filename) {
    try {
      const jsonData = fs.readFileSync(filename, 'utf8');
      const data = JSON.parse(jsonData);
      let index = data.findIndex(x => x.id == productId);

      if (index != -1) {
        for (var key in priceProduct) {
          if (priceProduct[key] === null) {
            priceProduct[key] = parseInt(data[index]["sizes"][key])
          }
        }
        if (nameProduct !== null) {
          data[index].name = nameProduct
          data[index].sizes = priceProduct
        }else {
          data[index].name = data[index].name
          data[index].sizes = priceProduct
        }

        const updatedJsonData = JSON.stringify(data, null, 2);
        fs.writeFileSync(filename, updatedJsonData);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
					status: 200,
					message: "Updated successfully"
				}));
        console.log(`Updated ${filename} successfully.`);
      }
    } catch (err) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
				status: 400,
				message: "Updated failed"
			}));
      console.error(`Error editing ${filename}:`, err);
    }
  }


  editJSONFile(filePath);
})

app.post('/upload', (req, res) => {
	// console.log(req.files)
	decompress(req.files.ZipFile.data).then(files => {
		// console.log(files[0].data)
		workbook.xlsx.load(files[0].data)
		    .then(async function () {
		        const worksheet = workbook.getWorksheet('Sheet1');

		        worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {

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
		            if (row.values[1] == "STELAN BAYI DAN ANAK, KAOS STELAN BAHAN KATUN COMBED 30S USIA 0-12 TAHUN" &&  row.values[11] == "Menunggu Konfirmasimu" && row.values[7] != 0) {

		                    if (row.values[3].toLowerCase().includes(",s")) {

		                        row.getCell(6).value = stelanAnakS
		                        row.getCell(7).value = stelanAnakS
		                        row.getCell(12).value = 'Ubah'

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
		                 // row.getCell(12).value = 'Ubah'
		             // }

				 if (row.values[1].includes("KAOS POLOS PANJANG COTTON COMBED 30S - KAOS LENGAN PANJANG PRIA ROUND NECK REGULER FIT") && row.values[11] == "Menunggu Konfirmasimu" && row.values[7] >= 5) {
		                 row.getCell(12).value = 'Tolak'
		             }


				 // // if (row.values[1].includes("KAOS POLOS PANJANG COTTON COMBED 30S - KAOS LENGAN PANJANG PRIA ROUND NECK REGULER FIT") && row.values[11] == "Menunggu Konfirmasimu" && row.values[7] >= 5) {
		                 // // row.getCell(12).value = 3
		             // // }
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
		        });

		        const buffer = await workbook.xlsx.writeBuffer();

		        res.status(200)
		        res.send(buffer)
		        });


	});


    })

const port = 3001;

app.listen(port, () => console.log(`Server started on port ${port}`));
