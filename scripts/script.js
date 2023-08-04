const btn = document.getElementById("btnUpload"),
    inpFile = document.getElementById("inpFile"),
    loading = document.getElementById("loading"),
    process = document.getElementById("process"),
    productsEditBtn = document.getElementById("productsEditBtn"),
    productDetailBody = document.getElementById("product-detail-body"),
    uploadFileDetailBody = document.getElementById("product-detail-body"),
    cancelledProductBtn = document.getElementById("cancelledProductBtn"),
    backToProductBtn = document.querySelectorAll(".backToProductBtn"),
    isEnabledBtn = document.getElementById("isEnabledBtn"),
    apiEndpoint = '/products'; // Replace with your API endpoint
let itemsPerPage = 5, // Number of items to display per page
    currentPage = 1, // Initial page number
    currentPageCancelled = 1,
    arrs = [];

let header = null

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

isEnabledBtn.addEventListener('click', (e) => {
  const id = e.target.dataset.id
  const isEnabled = e.target.dataset.isEnabled
  const alert = document.querySelector('#product-detail .alert')


  let values = {
    isEnabled
  }

  let formBody = [];
  for (let property in values) {
    let encodedKey = encodeURIComponent(property);
    let encodedValue = encodeURIComponent(values[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");

  fetch(`${apiEndpoint}/${id}/is-enabled`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: formBody
  })
  .then(response => {
    if (!response.ok) {
      throw response.json()
    }

    return response.json()
  })
  .then(result => {

    if (result.isEnabled !== undefined) {
      if (result.isEnabled) {
        isEnabledBtn.innerText = "Disable"
        isEnabledBtn.dataset.isEnabled = result.isEnabled
        isEnabledBtn.classList.add('btn-primary')
        isEnabledBtn.classList.remove('btn-danger')
      }else {
        isEnabledBtn.innerText = "Enable"
        isEnabledBtn.dataset.isEnabled = result.isEnabled
        isEnabledBtn.classList.add('btn-primary')
        isEnabledBtn.classList.remove('btn-danger')
      }

      if (alert.classList.contains('alert-warning')) {
          alert.classList.remove('alert-warning')
      }

      if (alert.classList.contains('alert-danger')) {
          alert.classList.remove('alert-danger')
      }

      if (alert.classList.contains('alert-success')) {
          alert.classList.remove('alert-success')
      }


      alert.classList.add('alert-success')
      alert.classList.remove('op-0')

      alert.textContent = result.message

      setTimeout(() => {
        alert.classList.remove('alert-success')
        alert.classList.add('op-0')
        alert.textContent = ""
      }, 1500)
    }
  })
  .catch(error => {
    if (!error.name) {
      error.then(result => {
        if (alert.classList.contains('alert-warning')) {
            alert.classList.remove('alert-warning')
        }

        if (alert.classList.contains('alert-danger')) {
            alert.classList.remove('alert-danger')
        }

        if (alert.classList.contains('alert-success')) {
            alert.classList.remove('alert-success')
        }


        alert.classList.add('alert-danger')
        alert.classList.remove('op-0')

        alert.textContent = result.message

        setTimeout(() => {
          alert.classList.remove('alert-danger')
          alert.classList.add('op-0')
          alert.textContent = ""
        }, 1500)
      })
    }
  })

})

if (backToProductBtn.length > 0) {
  for (var i = 0; i < backToProductBtn.length; i++) {
    backToProductBtn[i].addEventListener('click', () => {
      productsEditBtn.click()
    })
  }
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

  if (item.isEnabled) {
    isEnabledBtn.innerText = "Disable"
    isEnabledBtn.dataset.isEnabled = false
    isEnabledBtn.dataset.id = item.id
    isEnabledBtn.classList.remove('btn-primary')
    isEnabledBtn.classList.add('btn-danger')
  }else {
    isEnabledBtn.innerText = "Enable"
    isEnabledBtn.dataset.isEnabled = false
    isEnabledBtn.dataset.id = item.id
    isEnabledBtn.classList.add('btn-primary')
    isEnabledBtn.classList.remove('btn-danger')
  }



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
