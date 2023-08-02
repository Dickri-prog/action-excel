(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const btn = document.getElementById("btnUpload"),
    inpFile = document.getElementById("inpFile"),
    // ExcelJS = require('exceljs'),
    // workbook = new ExcelJS.Workbook(),
    loading = document.getElementById("loading"),
    process = document.getElementById("process"),
    productsEditBtn = document.getElementById("productsEditBtn"),
    exportJsonBtn = document.getElementById("exportJson"),
    productDetailBody = document.getElementById("product-detail-body"),
    uploadFileDetailBody = document.getElementById("product-detail-body"),
    cancelledProductBtn = document.getElementById("cancelledProductBtn"),
    backToProductBtn = document.querySelectorAll(".backToProductBtn"),
    apiEndpoint = '/products'; // Replace with your API endpoint
let itemsPerPage = 5, // Number of items to display per page
    currentPage = 1, // Initial page number
    currentPageCancelled = 1,
    arrs = [];

let header = null

// inpFile.addEventListener('change', function (e) {
    // const file = e.target.files[0];
    // const reader = new FileReader();

    // loading.innerText = "complete!!!"

    // reader.readAsArrayBuffer(file)

    // reader.onload = () => {
        // const buffer = reader.result;
        // workbook.xlsx.load(buffer).then(workbook => {
            // workbook.eachSheet((sheet, id) => {

                // if (sheet.findRow(1)) {
                    // header = sheet.getRow(1).values
                    // sheet.getRow(1).destroy()
                // }
                // sheet.eachRow((row, rowIndex) => {
                    // row.values.forEach(value => arrs.push(value))
                // })
            // })
        // })
    // }


// })

inpFile.addEventListener('click' , () => {
    document.getElementById("loading").classList.add("active")
    process.classList.remove("active")
})

inpFile.addEventListener('change' , () => {
    document.getElementById("loading").classList.remove("active")
    document.getElementById("error").classList.remove("active")
})

btn.addEventListener('click', async () => {
  document.getElementById("error").classList.remove("active")
  document.getElementById("loading").classList.remove("active")
  process.classList.remove("active")
    if (inpFile.files.length === 0) {
      document.getElementById("error").classList.add("active")
      document.getElementById("error").textContent = "No file change"
    }else {
        const formData = new FormData()

        formData.append("ZipFile", inpFile.files[0])

        process.classList.add("active")
        process.textContent = "Processing..."

        await fetch('/upload', {
            method: 'POST',
            body: formData
        }).then(response => response.arrayBuffer()).then(array => {
    		const blob = new Blob([array], {
    			type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    		}),
    			href = URL.createObjectURL(blob);

    			window.open(href)

          process.classList.add("active")
          process.textContent = "Success..."
    	}).catch((error) => {
        process.classList.remove("active")
        process.textContent = "Failed..."
      })
    }
})


productsEditBtn.addEventListener('click', () => {
  fetchDataProducts(currentPage)
})

cancelledProductBtn.addEventListener('click', () => {
  fetchDataCancelledProducts(currentPageCancelled)
})


uploadFileBtn.addEventListener('click', fetchDataUpload)

exportJsonBtn.addEventListener('click', exportJsonData)




if (backToProductBtn.length > 0) {
  for (var i = 0; i < backToProductBtn.length; i++) {
    backToProductBtn[i].addEventListener('click', () => {
      productsEditBtn.click()
    })
  }
}



function exportJsonData() {
fetch('/export',)
.then(res => res.json())
.then(data => {

  let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
let dlAnchorElem = document.createElement('a');
dlAnchorElem.href = dataStr;
dlAnchorElem.setAttribute("download", "products.json");
dlAnchorElem.click();
})
}


function fetchDataUpload() {
  const url = `migrate`;
  const dataContainer = document.getElementById('data-container-upload');
  const alert = document.querySelector('#pagination-container-upload .alert')

  if (alert.classList.contains('alert-danger')) {
    alert.classList.remove('alert-danger')
  }

  if (alert.classList.contains('alert-success')) {
    alert.classList.remove('alert-success')
  }


  showLoadingImportExport();

  fetch(url)
    .then(res => {
      if (res.ok) {
        return res.json()
      }else {
      throw res.json();
      }
    })
    .then(result => {
      hideLoadingImportExport()

        const textareaElement = dataContainer.querySelector('.form-group > textarea#jsonTextarea')

        // if (result.data.length > 0) {
        //   textareaElement.disabled = true
        // }else {
        //   textareaElement.disabled = false
        // }

        displayDataImportExport(result.data)
    })
    .catch(error => {
      displayDataImportExport()

      error.then(function(json) {
        hideLoadingImportExport();
        if (json.status === 404) {
          alert.classList.add('alert-warning')
        }else {
          alert.classList.add('alert-danger')
        }
        alert.classList.remove('op-0')

        alert.textContent = json.message

        setTimeout(() => {
          if (json.status === 404) {
            alert.classList.remove('alert-warning')
          }else {
            alert.classList.remove('alert-danger')
          }
          alert.classList.add('op-0')
          alert.textContent = ""
        }, 1500)


       });


    });

}



function fetchDataProducts(page) {
  const url = `${apiEndpoint}?page=${page}&limit=${itemsPerPage}`;

  showLoadingProduct();

  fetch(url)
    .then(response => response.json())
    .then(data => {
      hideLoadingProduct();
      if (data.items.length > 0) {
        displayDataProducts(data.items); // Assume the API response contains an 'items' array
        createPaginationProducts(data.totalPages); // Assume the API response contains a 'totalPages' field
      }else {
        const dataContainer = document.getElementById('data-container-product');

        dataContainer.innerHTML = `
            <h2>No data item</h2>
        `
      }
    })
    .catch(error => {
      console.error('Error:', error);
      hideLoadingProduct();
    });
}
function fetchDataCancelledProducts(page) {
  const url = `${apiEndpoint}/cancelled/?page=${page}&limit=${itemsPerPage}`;

  showLoadingProduct();

  fetch(url)
    .then(response => response.json())
    .then(data => {
      hideLoadingProduct();
      if (data.items.length > 0) {
        displayDataCancelledProducts(data.items); // Assume the API response contains an 'items' array
        // createPaginationProducts(data.totalPages); // Assume the API response contains a 'totalPages' field
      }else {
        const dataContainer = document.getElementById('data-container-product');

        dataContainer.innerHTML = `
            <h2>No data item</h2>
        `
      }
    })
    .catch(error => {
      console.error('Error:', error);
      hideLoadingProduct();
    });
}



function displayDataProducts(items) {
  const dataContainer = document.getElementById('data-container-product');
  dataContainer.innerHTML = '';

  items.forEach((item, index) => {
    const button = document.createElement('button');

    button.setAttribute('data-bs-toggle', 'modal')

    button.setAttribute('data-bs-target', '#product-detail')

    button.type = 'button'

    button.textContent = item.name; // Display the item property you want
    button.addEventListener('click', () => {

      displayDetailProduct(items[index])
    })
    dataContainer.appendChild(button);
  });
}

function displayDataCancelledProducts(items) {
  const dataContainer = document.getElementById('data-container-cancelled-product');
  const ul = document.createElement('ul')
  dataContainer.innerHTML = '';

  items.forEach((item, index) => {
    const li = document.createElement('li')
    const button = document.createElement('button')
    const p = document.createElement('p')

    button.type = 'button'
    button.classList.add('btn')
    button.classList.add('btn-primary')
    p.textContent = item; // Display the item property you want
    button.textContent = "Enable"; // Display the item property you want
    button.addEventListener('click', () => {

      console.log('clicked!!!');

    })
    li.appendChild(p)
    li.appendChild(button)
    ul.appendChild(li);
  });
  dataContainer.appendChild(ul)
}

function displayDetailProduct(item) {
  productDetailBody.innerHTML = ''
  const productnameDiv = document.createElement('div')
  const productnameForm = document.createElement('form')
  const productnameInput = document.createElement('input')
  const productnameEditBtn = document.createElement('img')
  const productnameCloseBtn = document.createElement('img')
  const productnameForwardBtn = document.createElement('img')
  const productnameP = document.createElement('p')



  productnameDiv.id = 'product-name'

  productnameInput.type = 'text'
  productnameInput.name = 'nameProduct'
  productnameInput.value = item.name
  productnameInput.disabled = true

  productnameEditBtn.classList.add('active')
  productnameEditBtn.src =  '../public/img/pencil-square.svg'
  productnameEditBtn.width = 20
  productnameEditBtn.alt = "Edit button"

  productnameForwardBtn.src =  '../public/img/forward-fill.svg'
  productnameForwardBtn.width = 25
  productnameForwardBtn.alt = "Forward button"

  productnameCloseBtn.src =  '../public/img/x-circle.svg'
  productnameCloseBtn.width = 20
  productnameCloseBtn.alt = "close button"

  productnameP.textContent = "Sizes :"
  productnameP.style = `margin-top: 10px;`



  productnameForm.appendChild(productnameInput)
  productnameDiv.appendChild(productnameForm)
  productnameDiv.appendChild(productnameEditBtn)
  productnameDiv.appendChild(productnameForwardBtn)
  productnameDiv.appendChild(productnameCloseBtn)


  productDetailBody.appendChild(productnameDiv)
  productDetailBody.appendChild(productnameP)



  productnameEditBtn.addEventListener('click', (e) => {
    e.target.classList.remove('active')
    productnameForwardBtn.classList.add('active')
    productnameCloseBtn.classList.add('active')
    productnameInput.disabled = false
  })

  productnameCloseBtn.addEventListener('click', (e) => {
    e.target.classList.remove('active')
    productnameForwardBtn.classList.remove('active')
    productnameEditBtn.classList.add('active')
    productnameInput.disabled = true
  })

  productnameForwardBtn.addEventListener('click', () => {
    productnameInput.disabled = true

    const values = {}

    const alert = document.querySelector('#product-detail .alert')

    const label = "nameProduct"

    values[label] = productnameInput.value

    var formBody = [];
    for (var property in values) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(values[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    if (alert.classList.contains('alert-warning')) {
        alert.classList.remove('alert-warning')
    }

    if (alert.classList.contains('alert-danger')) {
        alert.classList.remove('alert-danger')
    }

    if (alert.classList.contains('alert-success')) {
        alert.classList.remove('alert-success')
    }

    fetch(`${apiEndpoint}/${item['id']}/edit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: formBody
    }).then(res => {
      if (res.ok) {
        return res.json()
      }else {
        throw res.json()
      }
    }).then(result => {
      productnameEditBtn.classList.add('active')
      productnameForwardBtn.classList.remove('active')
      productnameCloseBtn.classList.remove('active')


        alert.classList.add('alert-success')
        alert.classList.remove('op-0')

        alert.textContent = result.message

        setTimeout(() => {
          alert.classList.remove('alert-success')
          alert.classList.add('op-0')
          alert.textContent = ""
        }, 1500)

    }).catch(error => {
      error.then(function(json) {
        if (json.status === 404) {
          alert.classList.add('alert-warning')
        }else {
          alert.classList.add('alert-danger')
        }
        alert.classList.remove('op-0')

        alert.textContent = json.message

        setTimeout(() => {
          if (json.status === 404) {
            alert.classList.remove('alert-warning')
          }else {
            alert.classList.remove('alert-danger')
          }
          alert.classList.add('op-0')
          alert.textContent = ""
        }, 1500)


       });
    })
  })




  const divContainer = document.createElement('div')

  divContainer.id = 'product-sizes'

  const sizes = ['S', 'M', 'L', 'XL']

  for (var i = 0; i < sizes.length; i++) {
    if (item['sizes'][sizes[i]] !== undefined) {
      addInputSize(i)

    }
  }

  function addInputSize(i) {
    const productPricesDiv = document.createElement('div')
    const productPricesForm = document.createElement('form')
    const productPricesInput = document.createElement('input')
    const productPricesEditBtn = document.createElement('img')
    const productPricesForwardBtn = document.createElement('img')
    const productPricesCloseBtn = document.createElement('img')
    const productPricesLabel = document.createElement('label')


    productPricesInput.type = 'number'
    productPricesInput.name = 'priceProductSize' + sizes[i]
    productPricesInput.value = item['sizes'][sizes[i]]
    productPricesInput.disabled = true

    productPricesEditBtn.classList.add('active')
    productPricesEditBtn.src =  '../public/img/pencil-square.svg'
    productPricesEditBtn.width = 20
    productPricesEditBtn.alt = "Edit button"

    productPricesForwardBtn.src =  '../public/img/forward-fill.svg'
    productPricesForwardBtn.width = 25
    productPricesForwardBtn.alt = "Forward button"

    productPricesCloseBtn.src =  '../public/img/x-circle.svg'
    productPricesCloseBtn.width = 20
    productPricesCloseBtn.alt = "close button"

    productPricesLabel.textContent = sizes[i] + "  :"

    productPricesForm.appendChild(productPricesLabel)
    productPricesForm.appendChild(productPricesInput)
    productPricesDiv.appendChild(productPricesForm)
    productPricesDiv.appendChild(productPricesEditBtn)
    productPricesDiv.appendChild(productPricesForwardBtn)
    productPricesDiv.appendChild(productPricesCloseBtn)

    divContainer.appendChild(productPricesDiv)

    if (i == sizes.length - 1) {
      productDetailBody.appendChild(divContainer)
    }

    productPricesEditBtn.addEventListener('click', (e) => {
      e.target.classList.remove('active')
      productPricesCloseBtn.classList.add('active')
      productPricesForwardBtn.classList.add('active')
      productPricesInput.disabled = false
    })

    productPricesCloseBtn.addEventListener('click', (e) => {
      e.target.classList.remove('active')
      productPricesForwardBtn.classList.remove('active')
      productPricesEditBtn.classList.add('active')
      productPricesInput.disabled = true
    })

    productPricesForwardBtn.addEventListener('click', () => {
      productPricesInput.disabled = true


      const values = {}

      const label = productPricesInput.parentElement.querySelector('label')
      const alert = document.querySelector('#product-detail .alert')

      let labelSplit = label.textContent.split(' ')

      labelSplit = "priceProductSize" + labelSplit[0]

      values[labelSplit] = productPricesInput.value

      var formBody = [];
      for (var property in values) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(values[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");

      fetch(`${apiEndpoint}/${item['id']}/edit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formBody
      })
        .then(res => {
          if (res.ok) {
            return res.json()
          }else {
            throw res.json()
          }
        })
        .then(result => {
        productPricesEditBtn.classList.add('active')
        productPricesForwardBtn.classList.remove('active')
        productPricesCloseBtn.classList.remove('active')

          alert.classList.add('alert-success')
          alert.classList.remove('op-0')

          alert.textContent = result.message

          setTimeout(() => {
            alert.classList.remove('alert-success')
            alert.classList.add('op-0')
            alert.textContent = ""
          }, 1500)
        })
        .catch(error => {
          error.then(function(json) {
            if (json.status === 404) {
              alert.classList.add('alert-warning')
            }else {
              alert.classList.add('alert-danger')
            }
            alert.classList.remove('op-0')

            alert.textContent = json.message

            setTimeout(() => {
              if (json.status === 404) {
                alert.classList.remove('alert-warning')
              }else {
                alert.classList.remove('alert-danger')
              }
              alert.classList.add('op-0')
              alert.textContent = ""
            }, 1500)


           });
      })
    })
  }

}

function createPaginationProducts(totalPages) {
  const paginationContainer = document.getElementById('pagination-container-product');
  paginationContainer.innerHTML = '';

  const maxVisiblePages = 5; // Maximum number of visible pagination buttons
  const halfVisiblePages = Math.floor(maxVisiblePages / 2);
  let startPage;
  let endPage;

  if (totalPages <= maxVisiblePages) {
    // Show all pages if the total number of pages is less than or equal to maxVisiblePages
    startPage = 1;
    endPage = totalPages;
  } else {
    // Determine startPage and endPage based on the current page position
    if (currentPage <= halfVisiblePages) {
      startPage = 1;
      endPage = maxVisiblePages;
    } else if (currentPage + halfVisiblePages >= totalPages) {
      startPage = totalPages - maxVisiblePages + 1;
      endPage = totalPages;
    } else {
      startPage = currentPage - halfVisiblePages;
      endPage = currentPage + halfVisiblePages;
    }
  }

  const nav = document.createElement('nav')
  const ul = document.createElement('ul')

  ul.classList.add('pagination')

  nav.appendChild(ul)

  // Add previous button if not on the first page
  if (currentPage !== 1) {
    addButton('Previous', currentPage - 1);
  }

  // Add dots if startPage is greater than 1
  if (startPage > 1) {
    addButton('...', startPage - 1);
  }

  // Add pagination buttons for the range of pages
  for (let i = startPage; i <= endPage; i++) {
    addButton(i, i, i === currentPage);
  }

  // Add dots if endPage is less than totalPages
  if (endPage < totalPages) {
    addButton('...', endPage + 1);
  }

  // Add next button if not on the last page
  if (currentPage !== totalPages) {
    addButton('Next', currentPage + 1);
  }


  function addButton(text, page, isActive) {


      const li = document.createElement('li');
      const a = document.createElement('a');
      li.classList.add('page-item')
      a.classList.add('page-link')
      a.href = '#'
      a.textContent = text;

      if (isActive) {
        li.classList.add('active')
      }

      li.appendChild(a)

      li.addEventListener('click', () => {
        const previousActiveButton = document.querySelector('#pagination-container-product .active');
        if (previousActiveButton) {
          previousActiveButton.classList.remove('active');
        }
        currentPage = page;
        fetchDataProducts(currentPage);
      });
      ul.appendChild(li);


  }

  paginationContainer.appendChild(ul)

}

function showLoadingProduct() {
  const loadingElement = document.querySelectorAll('.loading-product');
  if (loadingElement.length > 0) {
    for (var i = 0; i < loadingElement.length; i++) {
      loadingElement[i].style.display = 'block';
    }
  }
}

function hideLoadingProduct() {
  const loadingElement = document.querySelectorAll('.loading-product');
  if (loadingElement.length > 0) {
    for (var i = 0; i < loadingElement.length; i++) {
      loadingElement[i].style.display = 'none';
    }
  }
}

function displayDataImportExport(items = "") {
  const dataContainer = document.getElementById('data-container-upload'),
        textareaElement = dataContainer.querySelector('.form-group textarea#jsonTextarea'),
        divBtns = dataContainer.querySelector('.form-group > .btns')


    if (items != "") {
      const stringVariable = items.map(obj => JSON.stringify(obj)).join(', \n');

      textareaElement.value = `[${stringVariable}]`
    }


  const textareaEditBtn = document.createElement('img')
  const textareaCloseBtn = document.createElement('img')
  const textareaForwardBtn = document.createElement('img')

  textareaEditBtn.classList.add('active')
  textareaEditBtn.src =  '../public/img/pencil-square.svg'
  textareaEditBtn.width = 20
  textareaEditBtn.alt = "Edit button"

  textareaForwardBtn.src =  '../public/img/forward-fill.svg'
  textareaForwardBtn.width = 25
  textareaForwardBtn.alt = "Forward button"

  textareaCloseBtn.src =  '../public/img/x-circle.svg'
  textareaCloseBtn.width = 20
  textareaCloseBtn.alt = "close button"

  if (divBtns.querySelectorAll('img').length === 0) {
    divBtns.appendChild(textareaEditBtn)
    divBtns.appendChild(textareaForwardBtn)
    divBtns.appendChild(textareaCloseBtn)
  }

  textareaEditBtn.addEventListener('click', (e) => {
    e.target.disabled = true
    e.target.classList.remove('active')
    textareaCloseBtn.classList.add('active')
    textareaForwardBtn.classList.add('active')
    textareaCloseBtn.disabled = false
    textareaForwardBtn.disabled = false
    textareaElement.disabled = false
  })

  textareaCloseBtn.addEventListener('click', (e) => {
    e.target.classList.remove('active')
    e.target.disabled = true
    textareaForwardBtn.disabled = true
    textareaEditBtn.disabled = false
    textareaForwardBtn.classList.remove('active')
    textareaEditBtn.classList.add('active')
    textareaElement.disabled = true
  })

  textareaForwardBtn.addEventListener('click', () => {
    textareaElement.disabled = true

    const alert = document.querySelector('#pagination-container-upload .alert')

    if (textareaElement.value == "" && textareaElement.value == " ") {
      alert.classList.add('alert-danger')
      alert.classList.remove('op-0')

      alert.textContent = "No json!!!"

      textareaElement.disabled = false;

      setTimeout(() => {
        alert.classList.remove('alert-danger')
        alert.classList.add('op-0')
        alert.textContent = ""
      }, 1500)

      return;
    }

    // const jsonData = JSON.stringify(textareaElement.value)

    const data = textareaElement.value

    // console.log(jsonData)
    console.log(typeof data)

    // fetch(`migrate`, {
    //   method: 'POST',
    //   header: {
    //     'Accept': 'application/json',
    //     'Content-Type' : 'application/json'
    //   },
    //   body: data
    // })
    //   .then(res => res.json())
    //   .then(result => {
    //   textareaEditBtn.classList.add('active')
    //   textareaForwardBtn.classList.remove('active')
    //   textareaCloseBtn.classList.remove('active')
    //   textareaForwardBtn.disabled = true
    //   textareaCloseBtn.disabled = true
    //   textareaEditBtn.disabled = false
    //
    //   if (result.status === 200) {
    //     alert.classList.add('alert-success')
    //     alert.classList.remove('op-0')
    //
    //     alert.textContent = result.message
    //
    //     setTimeout(() => {
    //       alert.classList.remove('alert-success')
    //       alert.classList.add('op-0')
    //       alert.textContent = ""
    //     }, 1500)
    //   }else {
    //     alert.classList.add('alert-danger')
    //     alert.classList.remove('op-0')
    //
    //     alert.textContent = result.message
    //
    //     setTimeout(() => {
    //       alert.classList.remove('alert-danger')
    //       alert.classList.add('op-0')
    //       alert.textContent = ""
    //     }, 1500)
    //
    //   }
    //
    // })
    //   .catch(error => {
    //     console.log(error)
    //   alert.classList.add('alert-danger')
    //   alert.classList.remove('op-0')
    //
    //   alert.textContent = error.message
    //
    //   setTimeout(() => {
    //     alert.classList.remove('alert-danger')
    //     alert.classList.add('op-0')
    //     alert.textContent = ""
    //   }, 1500)
    // })


      let xhr = new XMLHttpRequest();
      xhr.open("POST", "migrate");
      xhr.setRequestHeader("Accept", "application/json");
      xhr.setRequestHeader("Content-Type", "application/json");

      xhr.responseType = 'json';

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          // console.log(xhr.status);
          // console.log(xhr.responseText);


          textareaEditBtn.classList.add('active')
          textareaForwardBtn.classList.remove('active')
          textareaCloseBtn.classList.remove('active')
          textareaForwardBtn.disabled = true
          textareaCloseBtn.disabled = true
          textareaEditBtn.disabled = false

          let jsonResponse = xhr.response
          //
          // console.log(jsonResponse)



          if (xhr.status === 200) {
            alert.classList.add('alert-success')
            alert.classList.remove('op-0')
            alert.textContent = jsonResponse.message

            setTimeout(() => {
              alert.classList.remove('alert-success')
              alert.classList.add('op-0')
              alert.textContent = ""
            }, 1500)
          }else {
            alert.classList.add('alert-danger')
            alert.classList.remove('op-0')

            alert.textContent = jsonResponse.message

            setTimeout(() => {
              alert.classList.remove('alert-danger')
              alert.classList.add('op-0')
              alert.textContent = ""
            }, 1500)

          }
        }};

      xhr.send(data);
  })
}

function showLoadingImportExport() {
  const loadingElement = document.getElementById('loading-upload');
  loadingElement.style.display = 'block';
}

function hideLoadingImportExport() {
  const loadingElement = document.getElementById('loading-upload');
  loadingElement.style.display = 'none';
}

},{}]},{},[1]);
