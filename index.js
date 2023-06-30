const ExcelJS = require('exceljs'),
workbook = new ExcelJS.Workbook(),
express = require('express'),
app = express(),
fileUpload = require("express-fileupload"),
decompress = require('decompress'),
fs = require('fs'),
path = require('path'),
bodyParser = require('body-parser'),
multer = require('multer')

const session = require('express-session');
const flash = require('connect-flash');

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

let isIntegrate = null;


app.use("/dist", express.static(path.join(__dirname, 'dist')));
app.use("/public", express.static(path.join(__dirname, 'public')))

app.use(session({
  secret: 'action-excel-v3',
  resave: false,
  saveUninitialized: false
}));

// Set up flash middleware
app.use(flash());

// Set up a global middleware to make the flash messages available in all views
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});

app.use('file-upload', fileUpload());
app.use(bodyParser.json()); // Parse JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

let jsonDataContent = []

const directoryPath = 'public/json/'; // Specify the directory path here
const fileName = 'products.json'; // Specify the file name here

const filePath = path.join(directoryPath, fileName);

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads'); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
		const filename = 'products.json'
		// if (fs.existsSync('uploads/' + uniqueName)) {
    //   // Remove the existing file
    //   fs.unlinkSync('uploads/' + uniqueName);
    // }
    cb(null, filename); // Use original file name
  }
});

const fileFilter = function (req, file, cb) {
  const extname = path.extname(file.originalname);
  if (extname.toLowerCase() === '.json') {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Only JSON files are allowed')); // Reject the file
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });


// Function to read and edit a JSON file
function getJSONFile(filename = null) {
	try {
		// const jsonData = fs.readFileSync(filename, 'utf8');
		if (jsonDataContent.length > 0) {
			const data = jsonDataContent;

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
		}
	} catch (err) {
		console.error(`Error editing ${filename}:`, err);
	}
}

app.get('/', (req, res) => {
	getJSONFile();
	res.render('index')
});

app.get('/products', (req, res) => {
	const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

	if (jsonDataContent.length > 0) {
		const jsonData = jsonDataContent;

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
	}else if (jsonDataContent.length <= 0) {
		const response = {
			items: 0,
			totalPages: 0,
			message: "Json Data empty!!!"
		}

		res.json(response)
	}
})

app.post('/products/:id/edit',  (req, res) => {

	try {
		const productId = req.params.id
		const formData = req.body;

		let nameProduct = null;
		let priceProductSizeS = null;
		let priceProductSizeM = null;
		let priceProductSizeL = null;
		let priceProductSizeXL = null;


		let priceProduct = {
			S: null,
			M: null,
			L: null,
			XL: null
		}

		let formSize = [
			"priceProductSizeS",
			"priceProductSizeM",
			"priceProductSizeL",
			"priceProductSizeXL"
		]

		if (formData[formSize[0]]) {
			if (isNaN(parseInt(formData[formSize[0]]))) {
				throw new Error("Input is not a number")
			}else {
				priceProduct.S = parseInt(formData[formSize[0]])
			}
		}

		if (formData[formSize[1]]) {
			if (isNaN(parseInt(formData[formSize[1]]))) {
				throw new Error("Input is not a number")
			}else {
				priceProduct.M = parseInt(formData[formSize[1]])
			}
		}

		if (formData[formSize[2]]) {
			if (isNaN(parseInt(formData[formSize[2]]))) {
				throw new Error("Input is not a number")
			}else {
				priceProduct.L = parseInt(formData[formSize[2]])
			}
		}

		if (formData[formSize[3]]) {
			if (isNaN(parseInt(formData[formSize[3]]))) {
				throw new Error("Input is not a number")
			}else {
				priceProduct.XL = parseInt(formData[formSize[3]])
			}
		}

		if (formData.nameProduct) {
			nameProduct = formData.nameProduct;
		}

		let index = null;

		for (var key in formData) {
			index = formSize.findIndex(x => x == key)
			if (index == -1) {
				throw new Error("Something wrong input!!!")
			}
		}

		// Function to read and edit a JSON file
		function editJSONFile(filename) {
			try {
				if (jsonDataContent.length > 0) {
					const data = jsonDataContent;
					let index = data.findIndex(x => x.id == productId);

					if (index != -1) {
						for (var key in priceProduct) {
							if (data[index]["sizes"][key] === undefined) {
							 delete	priceProduct[key]
							}
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


						res.json({
							status: 200,
							message: "Updated successfully"
						});
						console.log(`Updated ${filename} successfully.`);
					}else {
						res.json({
							status: 404,
							message: "Updated failed item not found!!!"
						});
						console.log(`Updated ${filename} failed.`);
					}
				}else if (jsonDataContent <= 0) {
					res.json({
						status: 500,
						message: "Updated failed No data!!!"
					});
					console.log(`Updated ${filename} failed.`);
				}
			} catch (err) {
				res.json({
					status: 400,
					message: "Updated failed"
				});
				console.error(`Error editing ${filename}:`, err);
			}
		}

		editJSONFile(filePath);
	} catch (e) {
		res.json({
			status: 400,
			message: e.message });
	}
})

app.get('/migrate', (req, res) => {
	function migrateJsonFile(filename) {
		try {
				const jsonData = fs.readFileSync(filename, 'utf8');
				const data = JSON.parse(jsonData);

				if (jsonDataContent.length > 0) {
					jsonDataContent = []
				}

				data.forEach((data, i) => {
					jsonDataContent.push(data)
				});

				req.flash('success', 'Migrating successfully!!!');
				res.redirect('/');


		} catch (e) {
			req.flash('error', 'Something Wrong!!!');
  		res.redirect('/');

			res.json(response);
		}
	}

	migrateJsonFile(filePath)
})

app.get('/file-upload', (req, res) => {

	try {
		const folderPath = 'public/uploads';

		fs.readdir(folderPath, (err, files) => {
		  if (err) {
				res.json({
					status: 404,
				 files: 0});
		    return;
		  }

		  // files.forEach(file => {
			//
		  // });

			res.json({
				status: 200,
				files: files });
		});
	} catch (e) {
		res.json({
			status: 500,
			files: 0 });
	}
})

// Define a route to handle file uploads
// app.post('/upload-file', upload.single('file'), (req, res) => {
//   res.json({ message: 'File uploaded successfully.' });
// });


app.get('/export', (req, res) => {
	res.json(jsonDataContent)
})

app.get('/integrate', (req, res) => {

})

app.post('/file-upload', (req, res, next) => {
  upload.single('jsonFile')(req, res, (err) => {
		console.log(err)
    if (err instanceof multer.MulterError) {
      // A Multer error occurred during upload

      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
					 status: 400,
					 message: 'Unexpected number of files uploaded.' });
      }
      return res.status(500).json({
				 status: 500,
				 message: 'Internal server error.' });
    } else if (err) {
      // An unknown error occurred during upload
      return res.status(500).json({
				status: 500,
				message: 'Internal server error.' });
    }

    res.json({
			status: 200,
			message: 'File uploaded successfully.'
		});

  // console.log(req.file)
  });
});

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

const port = 3002;

app.listen(port, () => console.log(`Server started on port ${port}`));
