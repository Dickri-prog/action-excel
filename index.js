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
let historyData = new Set()


app.use("/dist", express.static(path.join(__dirname, 'dist')));
app.use("/public", express.static(path.join(__dirname, 'public')))
app.use('/upload', fileUpload());
app.use('/mass-add-product', fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const octokit = new Octokit({
  auth: process.env.githubSecretKey
})

async function fetchContentFile() {
  const fetchingData = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
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

    cancelProductDataArr = []
    productDataArr = []

    jsonDataContent = JSON.parse(originalString)

    jsonDataContent.forEach((item, index) => {
      if (item.isEnabled) {
        productDataArr.push(index)
      }else{
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
    if (process.env.githubSecretKey === undefined) {
      res.status(500).json({
        items: 0,
        message: 'Something wrong system'
      })

    }else {
      if (fetchedData === false) {
        fetchedData = fetchContentFile().then(result => {
          if (result) {
            next()
          } else {
            res.status(400).json({
              items: 0,
              message: 'Something wrong system'
            })
          }
        })
        .catch(error => {
          console.error(error);
          res.status(400).json({
            items: 0,
            message: 'Something wrong system'
          })
        })
      } else {
        next()
      }
    }


}

async function updateFile() {
  const updatedContent = Buffer.from(JSON.stringify(jsonDataContent, null, 2)).toString('base64');
  const updatedData = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
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
      if (jsonDataContent[item].sizes !== undefined) {
        paginatedItems.push({
          id: jsonDataContent[item].id,
          name: jsonDataContent[item].name,
          sizes: jsonDataContent[item].sizes,
          isEnabled: jsonDataContent[item].isEnabled
        })
      }else {
        paginatedItems.push({
          id: jsonDataContent[item].id,
          name: jsonDataContent[item].name,
          isEnabled: jsonDataContent[item].isEnabled
        })
      }
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
			totalPages: totalPages
		};

		res.json(response);
	}else if (productDataArr.length <= 0) {
		const response = {
			items: 0,
			totalPages: 0
		}

		res.json(response)
	}
})

app.get('/products/search', checkingData, (req, res) => {
  const text = req.query.q.toLowerCase()
  const filter = jsonDataContent.filter((item) => item.isEnabled && item['name'].toLowerCase().includes(text))

  if (filter.length > 0) {

    function compare( a, b ) {
      if ( a.name < b.name ){
        return -1;
      }
      if ( a.name > b.name ){
        return 1;
      }
      return 0;
    }

    filter.sort(compare)

		// Prepare the response object
		const response = {
			items: filter
		};

		res.json(response);
	}else if (filter.length <= 0) {
		const response = {
			items: 0
		}

		res.json(response)
	}
})

app.get('/products/history', (req, res) => {

  const scrapeData = []

  if (historyData.size > 0) {
    historyData.forEach((item) => {
        const data = jsonDataContent[item];

        scrapeData.push({
          isEnabled: data.isEnabled,
          title: data.name,
          sizes: data.sizes
        })

    });
  }


      res.json({
        items: scrapeData
      })

})

app.delete('/products/history', (req, res) => {
  if (historyData.size > 0) {
    historyData.clear()
    if (historyData.size === 0) {
      res.json({
        code: 200
      })
    }
  }else {
    res.json({
      code: 404
    })
  }

  res.json({
    code: 400
  })
})

app.get('/products/cancel', checkingData, (req, res) => {
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

app.put('/products/:id', checkingData,  async (req, res) => {
  const productId = req.params.id
  const formData = req.body;
  const formArray = {
    name: null,
    sizes: {}
  }

  Object.keys(formData).map(function(key) {
    if (key.toLowerCase() != 'name') {
      formArray['sizes'][key.toUpperCase()] = formData[key]
    }else {
      formArray['name'] = formData[key]
    }
  });


  if (jsonDataContent.length > 0) {
		let index = jsonDataContent.findIndex(x => x.id == productId);

    jsonDataContent[index].name = formArray['name']
    jsonDataContent[index].sizes = formArray['sizes']

    const updatedContent = await updateFile()


    if (updatedContent) {
      res.json({
        message: "Updated successfully!!!"
      })
      console.log(`Updated successfully.`);
    } else {

      console.log(`Updated Failed!!!.`);
    }
  } else {
      res.status(400).json({
  			message: 'Updated failed No Data!!!'
      });
  }

})

app.post('/products/:id/add', checkingData,  async (req, res) => {

	try {
		const productId = req.params.id
		const formData = req.body;

		let priceProductSizeS = null;
		let priceProductSizeM = null;
		let priceProductSizeL = null;
		let priceProductSizeXL = null;

		let priceProduct = {
			S: null,
			M: null,
			L: null,
			XL: null,
      XXL: null
		}

		let formSize = [
			"priceProductSizeS",
			"priceProductSizeM",
			"priceProductSizeL",
			"priceProductSizeXL",
			"priceProductSizeXXL"
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
		if (formData[formSize[4]]) {
			if (isNaN(parseInt(formData[formSize[4]]))) {
				throw new Error("Input is not a number")
			}else {
				priceProduct.XXL = parseInt(formData[formSize[4]])
			}
		}


		let index = null;

		for (var key in formData) {
			index = formSize.findIndex(x => x == key)
			if (index == -1) {
				throw new Error("Something wrong input!!!")
			}
		}

				if (jsonDataContent.length > 0) {
					let index = jsonDataContent.findIndex(x => x.id == productId);

					if (index != -1) {
						for (var key in priceProduct) {
							if (jsonDataContent[index]["sizes"][key] !== undefined) {
                if (priceProduct[key] !== null) {
                  priceProduct[key] = parseInt(priceProduct[key]);
                }else {
                  priceProduct[key] = parseInt(jsonDataContent[index]["sizes"][key]);
                }
							}

              if (priceProduct[key] === null) {
                  delete priceProduct[key];
							}

						}

							jsonDataContent[index].sizes = priceProduct

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

app.put('/products/:id/is-enabled', checkingData,  async (req, res) => {
  try {

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

              if (indexOfItemProductArr == -1) {
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
              }else {
                throw new Error('Product Already Enabled!!!')
              }

            }else {
              const indexOfItemProductArr = productDataArr.findIndex(item => item === indexOfItem)
              if (indexOfItemProductArr != -1) {
                productDataArr.splice(indexOfItemProductArr, 1)
              }

              const indexOfCancel = cancelProductDataArr.findIndex(item => item === indexOfItem)

              if (indexOfCancel == -1) {
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
              }else {
                throw new Error('Product Already Disabled!!!')
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
    console.error(e)
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
  					message: jsonDataContent
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

app.get('/products/enabled', checkingData, (req, res) => {
	try {
				if (productDataArr.length > 0) {
          const data = []
          productDataArr.forEach((item) => {
            data.push(jsonDataContent[item])
          });

          res.json({
  					message: data
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

app.get('/products/cancel-data', checkingData, (req, res) => {
	try {
				if (cancelProductDataArr.length > 0) {
          const data = []
          cancelProductDataArr.forEach((item) => {
            data.push(jsonDataContent[item])
          });
          res.json({
  					message: data
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

app.post('/mass-add-product', checkingData, (req, res) => {

  function checkJsonData(data) {
    const checkIndex = jsonDataContent.findIndex(item => item['name'] == data)

    if (checkIndex == -1) {
      return true
    }

    return false
  }

  function findIndexOfMaxId() {
    if (jsonDataContent.length === 0) {
      return -1; // Return -1 if the array is empty
    }

    // let maxIndex = 0; // Initialize the index of the maximum ID to the first element
    let maxId = jsonDataContent[0].id; // Initialize the maximum ID to the first element's ID

    for (let i = 1; i < jsonDataContent.length; i++) {
      if (jsonDataContent[i].id > maxId) {
        maxId = jsonDataContent[i].id;
        // maxIndex = i;
      }
    }

    return maxId;
  }

  	if (req.files.docFile !== undefined) {
      if (req.files.docFile.mimetype == 'application/zip' || req.files.docFile.mimetype == 'application/x-zip-compressed') {
        decompress(req.files.docFile.data).then(files => {
          workbook.xlsx.load(files[0].data)
              .then(async function () {
                  const worksheet = workbook.getWorksheet('Sheet1');

                  let data = []
                  let id = 1
                  let index = 0
                  let isCheckId = true
                  worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
                    if (index >= 3) {
                      if (checkJsonData(row.values[1])) {
                        if (isCheckId) {
                          const checkingBiggestId = findIndexOfMaxId()
                          if (checkingBiggestId !== -1) {
                            id = checkingBiggestId + 1
                            isCheckId = false
                          }
                        }
                        if (isCheckId === false) {
                          jsonDataContent.push({
                            id,
                            name: row.values[1],
                            isEnabled: false,
                            sizes: {

                            }
                          })
                          id++
                        }
                      }
                    }
                    index++
                  });

                  const updatedContent = await updateFile()

                  if (updatedContent) {
                    res.json({
                      message: "Updated successfully!!!"
                    })
                    console.log(`Updated successfully.`);
                    fetchedData = false
                  } else {
                    throw new Error('Updated Failed!!!')

                    console.log(`Updated Failed!!!.`);
                  }
        });
      })
    }else if (req.files.docFile.mimetype == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      workbook.xlsx.load(req.files.docFile.data)
          .then(async function () {
              const worksheet = workbook.getWorksheet('Sheet1');

              let data = []
              let id = 1
              let index = 0
              let isCheckId = true
              worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
                if (index >= 3) {
                  if (checkJsonData(row.values[1])) {
                    if (isCheckId) {
                      const checkingBiggestId = findIndexOfMaxId()
                      if (checkingBiggestId !== -1) {
                        id = checkingBiggestId + 1
                        isCheckId = false
                      }
                    }
                    if (isCheckId === false) {
                      jsonDataContent.push({
                        id,
                        name: row.values[1],
                        isEnabled: false,
                        sizes: {

                        }
                      })
                      id++
                    }
                  }
                }
                index++
              });

              const updatedContent = await updateFile()

              if (updatedContent) {
                res.json({
                  message: "Updated successfully!!!"
                })
                console.log(`Updated successfully.`);
                fetchedData = false
              } else {
                throw new Error('Updated Failed!!!')

                console.log(`Updated Failed!!!.`);
              }
    })
    }else {
        res.status(400).json({
          message: "File should be zip or excel file!!!"
        })
    }
}else {
  res.status(400).json({
    message: "No data File!!!"
  })
}

})


app.post('/upload', checkingData, (req, res) => {

  const cancelData = []
  const nominationData = []

  historyData = new Set()

    if (cancelProductDataArr.length > 0) {
      cancelProductDataArr.forEach((item) => {
        const data = jsonDataContent[item];

        if (data.isEnabled === false) {
          cancelData.push({
            index: item,
            name: data.name
          })
        }
      });
    }

    if (productDataArr.length > 0) {
      productDataArr.forEach((item) => {
        const data = jsonDataContent[item];

        if (data.isEnabled) {
          nominationData.push({
            index: item,
            name: jsonDataContent[item].name,
            sizes: jsonDataContent[item].sizes
          })
        }
      });
    }

  	function cancelled (value) {

      let valueToLower = value.toLowerCase()
      const formattedSearch = valueToLower.replace(/\s+/g, '');


      const index =  cancelData.findIndex(item => {
        const formattedTarget = item['name'].toString().toLowerCase().replace(/\s+/g, '');
        if (formattedSearch == formattedTarget) {
          return true
        }
      })

      if (index != -1) {
        const itemIndex = cancelData[index].index
        historyData.add(itemIndex)

       return true;
     }

      return false;

  	}

  	function dataNomination (value) {

      let valueToLower = value.toLowerCase()
      const formattedSearch = valueToLower.replace(/\s+/g, '');

      const index =  nominationData.findIndex(item => {
        const formattedTarget = item['name'].toString().toLowerCase().replace(/\s+/g, '');
        if (formattedSearch == formattedTarget) {
          return true
        }
      })

  		if (index != -1) {
        let pricesData = nominationData[index].sizes
        const itemIndex = nominationData[index].index

        historyData.add(itemIndex)

  			return pricesData;
  		}

      return false;

  	}


    if (req.files.docFile !== undefined) {

      if (req.files.docFile.mimetype == 'application/zip' || req.files.docFile.mimetype == 'application/x-zip-compressed') {

        decompress(req.files.docFile.data).then(files => {
          if (files[0].type == 'file') {
            const path = files[0]['path'].split('.')

            if (path[1] != 'xlsx') {
              res.status(400)
              .json({
                message: "check in your zip file should be excel then correct data!!!"
              })
            }
          }else if (files[0].type == 'directory') {
            res.status(400)
            .json({
              message: "check in your zip file should be correct file not a dir"
            })
          }

      		workbook.xlsx.load(files[0].data)
      		    .then(async function () {
      		        const worksheet = workbook.getWorksheet('Sheet1');

      		        worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {

      				  if (pricesData = dataNomination(row.values[1])) {
                    if (row.values[11] == "Menunggu Konfirmasimu" && row.values[8] != 0) {
                      const splitData = row.values[3].split(',')

                      if (splitData.length > 1) {

                        if (splitData[0].toLowerCase().trim() == "s" || splitData[1].toLowerCase().trim() == "s") {
                          if (pricesData.S !== undefined) {

                            row.getCell(6).value = pricesData.S
                            row.getCell(7).value = pricesData.S
                            row.getCell(12).value = 'Ubah'
                          }
                        }

                        if (splitData[0].toLowerCase().trim() == "m" || splitData[1].toLowerCase().trim() == "m") {
                          if (pricesData.M !== undefined) {

                            row.getCell(6).value = pricesData.M
                            row.getCell(7).value = pricesData.M
                            row.getCell(12).value = 'Ubah'
                          }
                        }

                        if (splitData[0].toLowerCase().trim() == "l" || splitData[1].toLowerCase().trim() == "l") {
                          if (pricesData.L !== undefined) {

                            row.getCell(6).value = pricesData.L
                            row.getCell(7).value = pricesData.L
                            row.getCell(12).value = 'Ubah'
                          }
                        }

                        if (splitData[0].toLowerCase().trim() == "xl" || splitData[1].toLowerCase().trim() == "xl") {
                          if (pricesData.XL !== undefined) {

                            row.getCell(6).value = pricesData.XL
                            row.getCell(7).value = pricesData.XL
                            row.getCell(12).value = 'Ubah'
                          }
                        }

                        if (splitData[0].toLowerCase().trim() == "xxl" || splitData[1].toLowerCase().trim() == "xxl") {
                          if (pricesData.XXL !== undefined) {

                            row.getCell(6).value = pricesData.XXL
                            row.getCell(7).value = pricesData.XXL
                            row.getCell(12).value = 'Ubah'
                          }
                        }
                      }else {

                        if (splitData[0].toLowerCase().trim() == "s") {
                          if (pricesData.S !== undefined) {

                            row.getCell(6).value = pricesData.S
                            row.getCell(7).value = pricesData.S
                            row.getCell(12).value = 'Ubah'
                          }
                        }

                        if (splitData[0].toLowerCase().trim() == "m") {
                          if (pricesData.M !== undefined) {

                            row.getCell(6).value = pricesData.M
                            row.getCell(7).value = pricesData.M
                            row.getCell(12).value = 'Ubah'
                          }
                        }

                        if (splitData[0].toLowerCase().trim() == "l") {
                          if (pricesData.L !== undefined) {

                            row.getCell(6).value = pricesData.L
                            row.getCell(7).value = pricesData.L
                            row.getCell(12).value = 'Ubah'
                          }
                        }

                        if (splitData[0].toLowerCase().trim() == "xl") {
                          if (pricesData.XL !== undefined) {

                            row.getCell(6).value = pricesData.XL
                            row.getCell(7).value = pricesData.XL
                            row.getCell(12).value = 'Ubah'
                          }
                        }

                        if (splitData[0].toLowerCase().trim() == "xxl") {
                          if (pricesData.XXL !== undefined) {

                            row.getCell(6).value = pricesData.XXL
                            row.getCell(7).value = pricesData.XXL
                            row.getCell(12).value = 'Ubah'
                          }
                        }
                      }
                    }
      				  }

                if (row.values[8] == 0 && row.values[11] == "Menunggu Konfirmasimu") {
                  row.getCell(12).value = 'Tolak'
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
      }else if (req.files.docFile.mimetype == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {


                workbook.xlsx.load(req.files.docFile.data)
            		    .then(async function () {
            		        const worksheet = workbook.getWorksheet('Sheet1');

            		        worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {

            				  if (pricesData = dataNomination(row.values[1])) {
                          if (row.values[10] == "Menunggu Konfirmasimu" && row.values[7] != 0) {

                            if (row.values[3].toLowerCase().includes(",s") || row.values[3].toLowerCase().includes("s,")) {

                  						if (pricesData.S !== undefined) {

                                row.getCell(6).value = pricesData.S
                                row.getCell(11).value = 'Saran'
                              }
                  					} else if (row.values[3].toLowerCase().includes(",m") || row.values[3].toLowerCase().includes("m,")) {

                              if (pricesData.M !== undefined) {

                                row.getCell(6).value = pricesData.M
                                row.getCell(11).value = 'Saran'
                              }
                  					} else if (row.values[3].toLowerCase().includes(",l") || row.values[3].toLowerCase().includes("l,")) {

                              if (pricesData.L !== undefined) {

                                row.getCell(6).value = pricesData.L
                                row.getCell(11).value = 'Saran'
                              }
                  					}else if (row.values[3].toLowerCase().includes(",xl") || row.values[3].toLowerCase().includes("xl,")) {
                              if (pricesData.XL !== undefined) {

                                row.getCell(6).value = pricesData.XL
                                row.getCell(11).value = 'Saran'
                              }
                  					}else if (row.values[3].toLowerCase().includes(",xxl") || row.values[3].toLowerCase().includes("xxl,")) {
                              if (pricesData.XXL !== undefined) {

                                row.getCell(6).value = pricesData.XXL
                                row.getCell(11).value = 'Saran'
                              }
                  					}else {
                              if (row.values[3].toLowerCase().includes("s")) {
                                if (pricesData.S !== undefined) {

                                  row.getCell(6).value = pricesData.S
                                  row.getCell(11).value = 'Saran'
                                }
                              }

                              if (row.values[3].toLowerCase().includes("m")) {
                                if (pricesData.M !== undefined) {

                                  row.getCell(6).value = pricesData.M
                                  row.getCell(11).value = 'Saran'
                                }
                              }

                              if (row.values[3].toLowerCase().includes("l")) {
                                if (pricesData.L !== undefined) {

                                  row.getCell(6).value = pricesData.L
                                  row.getCell(11).value = 'Saran'
                                }
                              }

                              if (row.values[3].toLowerCase().includes("xl")) {
                                if (pricesData.XL !== undefined) {

                                  row.getCell(6).value = pricesData.XL
                                  row.getCell(11).value = 'Saran'
                                }
                              }

                              if (row.values[3].toLowerCase().includes("xxl")) {
                                if (pricesData.XXL !== undefined) {

                                  row.getCell(6).value = pricesData.XXL
                                  row.getCell(11).value = 'Saran'
                                }
                              }
                            }
                          }
            				  }

                      if (row.values[7] == 0 && row.values[10] == "Menunggu Konfirmasimu") {
                        row.getCell(11).value = 'Tolak'
                      }

                      if (cancelled(row.values[1])) {
                        if (row.values[10] == "Menunggu Konfirmasimu") {
                                row.getCell(11).value = 'Tolak'
                        }
                      }

            		        });

            		        const buffer = await workbook.xlsx.writeBuffer();

            		        res.status(200)
            		        res.send(buffer)
            		        });
      }else {
        res.status(400)
        .json({
          message: "File should be zip or excel file!!!"
        })
      }

    }else {
      res.status(400)
      .json({
        message: "No data File!!!"
      })
    }


})

const port = 3002;

app.listen(port, () => console.log(`Server started on port ${port}`));
