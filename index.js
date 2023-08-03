const ExcelJS = require('exceljs'),
workbook = new ExcelJS.Workbook(),
express = require('express'),
app = express(),
fileUpload = require("express-fileupload"),
decompress = require('decompress'),
fs = require('fs'),
path = require('path'),
bodyParser = require('body-parser'),
{ Octokit } = require("octokit")

app.use("/dist", express.static(path.join(__dirname, 'dist')));
app.use("/public", express.static(path.join(__dirname, 'public')))

app.use('/upload', fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

let jsonDataContent = []

let shaData = null
let fetchedData = false

let cancelDataArr = {
    nameSize: [
      "kuning",
      "turkis"
    ],
    nameProduct: [
      "kurta",
      "Kaos Polos Bahan Cotton, Combad 30s Unisex Cewek Cowok Casua"
    ]
}

const octokit = new Octokit({
  auth: process.env.githubSecretKey
})

async function fetchContentFile() {
  const fetchingData = await octokit.request('GET /repos/Dickri-prog/jsonData/contents/product-price/products.json', {
    owner: 'Dickri-prog',
    repo: 'jsonData',
    path: 'product-price/products.json',
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  }).then((result) => {
    shaData = result['data']['sha']
    const base64Data = result['data']['content']
    const buffer = Buffer.from(base64Data, 'base64');
    const originalString = buffer.toString();
    //
    jsonDataContent = JSON.parse(originalString)
    console.log("fetched")
    return true
  }).catch(error => {
    console.error(error.message)
    return false
  })

  return fetchingData
}

function checkingData(req, res, next) {

  if (fetchedData === false) {
    fetchedData = fetchContentFile().then(result => {
      if (result) {
        next()
      } else {
        return res.json({
          isLoggedin: false,
          message: "Something Wrong, contact us"
        })
      }
    })
  } else {
    next()
  }
}

app.get('/', (req, res) => {
	res.render('index')
});

// app.get('/products/json', (req, res) => {
//   const jsonData = fs.readFileSync(filePath, 'utf8');
//   const data = JSON.parse(jsonData);
//
//   res.json(data)
//
// })

app.get('/products', checkingData , (req, res) => {
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

app.get('/products/cancelled', (req, res) => {
	const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  let data = null;

  if (cancelDataArr["nameSize"].length > 0 && cancelDataArr["nameProduct"].length > 0) {
     data = cancelDataArr["nameSize"].concat(cancelDataArr["nameProduct"])
  }else if (cancelDataArr["nameSize"].length > 0) {
    data = cancelDataArr["nameSize"]
  }else if (cancelDataArr["nameProduct"].length > 0) {
    data = cancelDataArr["nameProduct"]
  }

	if (data.length > 0) {

		// Calculate the starting and ending index for the current page
		const startIndex = (page - 1) * limit;
		const endIndex = startIndex + limit;

		// Slice the items array based on the calculated indices
		const paginatedItems = data.slice(startIndex, endIndex);

		// Calculate the total number of pages
		const totalPages = Math.ceil(data.length / limit);

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
		function editJSON() {
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
							message: "Updated successfully"
						});
						console.log(`Updated successfully.`);
					}else {
						res.status(404).json({
							message: "Updated failed item not found!!!"
						});
						console.log(`Updated failed.`);
					}
				}else if (jsonDataContent <= 0) {
					res.status(400).json({
						message: "Updated failed No data!!!"
					});
					console.log(`Updated failed.`);
				}
			} catch (err) {
				res.status(500).json({
					message: "Updated failed"
				});
				console.error(`Error editing :`, err);
			}
		}

		editJSON();
	} catch (e) {
		res.status(500).json({
			message: e.message });
	}
})

app.get('/products/json', checkingData, (req, res) => {
	try {
				if (jsonDataContent.length > 0) {
          res.json({
  					data: jsonDataContent
  				})
        }else {
          throw new Error('No data')
        }

	} catch (e) {
    console.log(e.message)

		res.status(500).json({
			message: "Something wrong!!!"
		});
	}
})

// app.post('/migrate', (req, res) => {
// 	try {
// 			let formData = req.body
//
// 			jsonDataContent = formData
//
// 			res.json({
// 				message: "Migrating successfully!!!"
// 			});
//
// 	} catch (e) {
//
// 		res.status(500).json({
// 			message: "Something Wrong!!!"
// 		});
// 	}
// })

// app.get('/export', (req, res) => {
// 	res.json(jsonDataContent)
// })

app.post('/upload', (req, res) => {

	function cancelled (value, property) {

    let valueToLower = value.toLowerCase()

    if (cancelDataArr[property].findIndex(item => valueToLower.includes(item.toLowerCase())) != -1) {
      // console.log(valueToLower);
     return true;
   }

    return false;

	}

	function dataNomination (value) {

    let valueToLower = value.toLowerCase()

    let index = jsonDataContent.findIndex(item => valueToLower.includes(item.name.toLowerCase()))

		if (index != -1) {
      let pricesData = jsonDataContent[index].sizes
			return pricesData;
		}

    return false;

	}

	decompress(req.files.ZipFile.data).then(files => {
		workbook.xlsx.load(files[0].data)
		    .then(async function () {
		        const worksheet = workbook.getWorksheet('Sheet1');

		        worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {

	            if (row.values[7] == 0 && row.values[11] == "Menunggu Konfirmasimu") {
	                row.getCell(12).value = 'Tolak'
	            }


				if (pricesData = dataNomination(row.values[1])) {
              if (row.values[11] == "Menunggu Konfirmasimu" && row.values[7] != 0) {
                if (row.values[3].toLowerCase().includes(",s") || row.values[3].toLowerCase().includes("s,")) {

      						if (pricesData.S !== undefined) {
                    row.getCell(6).value = pricesData.S
        						row.getCell(7).value = pricesData.S
                    row.getCell(12).value = 'Ubah'
                  }
      					} else if (row.values[3].toLowerCase().includes(",m") || row.values[3].toLowerCase().includes("m,")) {

                  if (pricesData.M !== undefined) {
                    row.getCell(6).value = pricesData.M
        						row.getCell(7).value = pricesData.M
                    row.getCell(12).value = 'Ubah'
                  }
      					} else if (row.values[3].toLowerCase().includes(",l") || row.values[3].toLowerCase().includes("l,")) {

                  if (pricesData.L !== undefined) {
                    row.getCell(6).value = pricesData.L
        						row.getCell(7).value = pricesData.L
                    row.getCell(12).value = 'Ubah'
                  }
      					}else if (row.values[3].toLowerCase().includes(",xl") || row.values[3].toLowerCase().includes("xl,")) {
                  if (pricesData.XL !== undefined) {
                    row.getCell(6).value = pricesData.XL
                    row.getCell(7).value = pricesData.XL
                    row.getCell(12).value = 'Ubah'
                  }
      					}
              }
				  }

          if (cancelled(row.values[1], "nameProduct")) {
            if (row.values[11] == "Menunggu Konfirmasimu") {
                    row.getCell(12).value = 'Tolak'
            }
          }
          if (cancelled(row.values[3], "nameSize")) {
            if (row.values[11] == "Menunggu Konfirmasimu") {
                    row.getCell(12).value = 'Tolak'
            }
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
