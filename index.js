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

let shaData = null
let fetchedData = false

let jsonDataContent = []
let cancelProductDataArr = []
let productDataArr = []

const cancelData = []
const nominationData = []


app.use("/dist", express.static(path.join(__dirname, 'dist')));
app.use("/public", express.static(path.join(__dirname, 'public')))
app.use('/upload', fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

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

    jsonDataContent.forEach((item, index) => {
      if (item.isEnabled) {
        productDataArr.push(index)
      }else {
        cancelProductDataArr.push(index)
      }
    })
    console.log("fetched!!!")
    return true
  }).catch(error => {
    console.error(error)
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

async function updateFile() {
  const updatedContent = Buffer.from(JSON.stringify(jsonDataContent, null, 2)).toString('base64');
  const updatedData = await octokit.request('PUT /repos/Dickri-prog/jsonData/contents/product-price/products.json', {
    owner: 'Dickri-prog',
    repo: 'jsonData',
    sha: shaData,
    path: 'product-price/products.json',
    message: 'update products.json',
    content: updatedContent,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })
    .then(result => {
      shaData = result['data']['content']['sha']
      return true
    })
    .catch(error => {
      console.error(error.message);
      return false
    })

  return updatedData
}


app.get('/', (req, res) => {
	res.render('index')
});

app.get('/products', checkingData , (req, res) => {
	const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

	if (productDataArr.length > 0) {

		// Calculate the starting and ending index for the current page
		const startIndex = (page - 1) * limit;
		const endIndex = startIndex + limit;

    let dataIndexItems = productDataArr.slice(startIndex, endIndex);

    const paginatedItems = []

    dataIndexItems.forEach((item) => {
      paginatedItems.push({
        id: jsonDataContent[item].id,
        name: jsonDataContent[item].name,
        sizes: jsonDataContent[item].sizes,
        isEnabled: jsonDataContent[item].isEnabled
      })
    });


    function compare( a, b ) {
      if ( a.name < b.name ){
        return -1;
      }
      if ( a.name > b.name ){
        return 1;
      }
      return 0;
    }

    paginatedItems.sort(compare)

		// Calculate the total number of pages
		const totalPages = Math.ceil(productDataArr.length / limit);

		// Prepare the response object
		const response = {
			items: paginatedItems,
			totalPages: totalPages,
		};

		res.json(response);
	}else if (productDataArr.length <= 0) {
		const response = {
			items: 0,
			totalPages: 0,
			message: "Json Data empty!!!"
		}

		res.json(response)
	}
})

app.get('/products/cancelled', checkingData, (req, res) => {
	const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);


	if (cancelProductDataArr.length > 0) {

		// Calculate the starting and ending index for the current page
		const startIndex = (page - 1) * limit;
		const endIndex = startIndex + limit;

		// Slice the items array based on the calculated indices
		let dataIndexItems = cancelProductDataArr.slice(startIndex, endIndex);

    const paginatedItems = []

    dataIndexItems.forEach((item) => {
      paginatedItems.push({
        id: jsonDataContent[item].id, name: jsonDataContent[item].name
      })
    });

    function compare( a, b ) {
      if ( a.name < b.name ){
        return -1;
      }
      if ( a.name > b.name ){
        return 1;
      }
      return 0;
    }

    paginatedItems.sort(compare)


		// Calculate the total number of pages
		const totalPages = Math.ceil(cancelProductDataArr.length / limit);

		// Prepare the response object
		const response = {
			items: paginatedItems,
			totalPages: totalPages,
		};

		res.json(response);
	}else if (cancelProductDataArr.length <= 0) {
		const response = {
			items: 0,
			totalPages: 0,
			message: "Json Data empty!!!"
		}

		res.json(response)
	}
})

app.post('/products/:id/name', checkingData,  async (req, res) => {
  try {
    const productId = parseInt(req.params.id)
    let productName = req.body.productName
    productName = productName.trim()

    const findIndexOfProduct = jsonDataContent.findIndex(item => item.id === productId)

    if (findIndexOfProduct != -1) {
      if (productName != '' && productName != ' ') {
        jsonDataContent[findIndexOfProduct]["name"] = productName

        const updatedContent = await updateFile()

        if (updatedContent) {
          res.json({
            message: "Updated successfully!!!"
          })
          console.log(`Updated successfully.`);
        } else {
          throw new Error('Updated Failed!!!')

          console.log(`Updated Failed!!!.`);
        }

      }else {
        throw new Error('Product Name should fill!!!')
      }
    }else {
      throw new Error('Product not found!!!')
    }

  } catch (e) {
    if (e.name == 'Error') {
      return res.status(400).json({
        message: e.message
      })
    }
    console.log(e)

    res.status(500).json({
      message: 'Something Wrong!!!'
    })
  }
})

app.post('/products/:id/edit', checkingData,  async (req, res) => {

	try {
		const productId = req.params.id
		const formData = req.body;

		// let nameProduct = null;
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

		// if (formData.nameProduct) {
		// 	nameProduct = formData.nameProduct;
		// }

		let index = null;

		for (var key in formData) {
			index = formSize.findIndex(x => x == key)
			if (index == -1) {
				throw new Error("Something wrong input!!!")
			}
		}

		// Function to read and edit a JSON file
		// async function editJSON() {
		// 	try {
				if (jsonDataContent.length > 0) {
					let index = jsonDataContent.findIndex(x => x.id == productId);

					if (index != -1) {
						for (var key in priceProduct) {
							if (jsonDataContent[index]["sizes"][key] === undefined) {
							 delete	priceProduct[key]
							}
							if (priceProduct[key] === null) {
								priceProduct[key] = parseInt(jsonDataContent[index]["sizes"][key])
							}
						}

						// if (nameProduct !== null) {
						// 	jsonDataContent[index].name = nameProduct
						// 	jsonDataContent[index].sizes = priceProduct
						// }else {
						// 	jsonDataContent[index].name = jsonDataContent[index].name
							jsonDataContent[index].sizes = priceProduct
						// }

            const updatedContent = await updateFile()

            if (updatedContent) {
              res.json({
                message: "Updated successfully!!!"
              })
              console.log(`Updated successfully.`);
            } else {
              throw new Error('Updated Failed!!!')

              console.log(`Updated Failed!!!.`);
            }

					}else {
            throw new Error('Updated failed item not found!!!')

						console.log(`Updated failed.`);
					}
				}else if (jsonDataContent <= 0) {
          throw new Error('Updated failed No data!!!')

					console.log(`Updated failed.`);
				}
			// } catch (err) {
			// 	res.status(500).json({
			// 		message: "Updated failed"
			// 	});
			// 	console.error(`Error editing :`, err);
			// }
		// }

		// editJSON();
	} catch (e) {
		if (e.name == 'Error') {
      return res.status(400).json({
  			message: e.message
      });
    }

    console.log(e)

      return res.status(500).json({
  			message: "Something wrong!!!"
      });
	}
})

app.post('/products/:id/is-enabled', checkingData,  async (req, res) => {
  try {
    // const isCancel = req.body.isCancel
    let isEnabled = req.body.isEnabled
    const id = parseInt(req.params.id)

      if (isEnabled !== undefined) {
        const indexOfItem  = jsonDataContent.findIndex(item => item.id === id)
        if (indexOfItem != -1) {

          if (isEnabled == 'true' || isEnabled == 'false') {
            isEnabled = (isEnabled == 'true')
            if (isEnabled) {
              const indexOfCancel = cancelProductDataArr.findIndex(item => item === indexOfItem)
              if (indexOfCancel != -1) {
                cancelProductDataArr.splice(indexOfCancel, 1)
              }

              const indexOfItemProductArr = productDataArr.findIndex(item => item === indexOfItem)

              if (indexOfItemProductArr != -1) {
                throw new Error('Product Already Enabled!!!')
              }else {
                productDataArr.push(indexOfItem)
                jsonDataContent[indexOfItem].isEnabled = isEnabled

                const updatedContent = await updateFile()

                if (updatedContent) {
                  res.json({
                    isEnabled: jsonDataContent[indexOfItem].isEnabled,
                    message: "Succesfully!!!"
                  })
                } else {
                  res.status(400).json({
                    isEnabled: jsonDataContent[indexOfItem].isEnabled,
                    message: "Failed!!!"
                  })
                }
              }
            }else {
              const indexOfItemProductArr = productDataArr.findIndex(item => item === indexOfItem)
              if (indexOfItemProductArr != -1) {
                productDataArr.splice(indexOfItemProductArr, 1)
              }

              const indexOfCancel = cancelProductDataArr.findIndex(item => item === indexOfItem)

              if (indexOfCancel != -1) {
                throw new Error('Product Already Disabled!!!')
              }else {
                cancelProductDataArr.push(indexOfItem)
                jsonDataContent[indexOfItem].isEnabled = isEnabled

                const updatedContent = await updateFile()

                if (updatedContent) {
                  res.json({
                    isEnabled: jsonDataContent[indexOfItem].isEnabled,
                    message: "Succesfully!!!"
                  })
                } else {
                  res.status(400).json({
                    isEnabled: jsonDataContent[indexOfItem].isEnabled,
                    message: "Failed!!!"
                  })
                }
              }
            }
          }else {
            throw new Error('Something Wrong input!!!')
          }
        }else {
          throw new Error('product not found!!!')
        }
      }else {
        throw new Error('Something Wrong input!!!')
      }
  } catch (e) {
    console.log(e)
    if (e.name == 'Error') {
      res.status(500).json({
  			message: e.message
      });
    }else {
      res.status(500).json({
  			message: "Something wrong!!!"
      });
    }
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
    console.log(e)

		res.status(500).json({
			message: "Something wrong!!!"
		});
	}
})

app.post('/upload', (req, res) => {

  if (cancelProductDataArr.length > 0) {
    if (cancelData.length === 0) {
      cancelProductDataArr.forEach((item) => {
        cancelData.push(jsonDataContent[item].name)
      });
    }
  }

  if (productDataArr.length > 0) {
    productDataArr.forEach((item) => {
      if (nominationData.length === 0) {
        nominationData.push({
          name: jsonDataContent[item].name,
          sizes: jsonDataContent[item].sizes
        })
      }
    });
  }

  	function cancelled (value) {

      let valueToLower = value.toLowerCase()
      const checkIndex =  cancelProductDataArr.findIndex(item => item.toLowerCase().includes(valueToLower))

      if (checkIndex != -1) {
       return true;
     }

      return false;

  	}

  	function dataNomination (value) {

      let valueToLower = value.toLowerCase()

      let index = nominationData.findIndex(item => item.name.toLowerCase().includes(valueToLower))

  		if (index != -1) {
        let pricesData = nominationData[index].sizes
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


  				if (pricesData = dataNomination(row.values[1]) && pricesData !== false) {
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

            if (cancelled(row.values[1])) {
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
