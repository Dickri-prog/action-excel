const btn = document.getElementById("btnUpload"),
    inpFile = document.getElementById("inpFile"),
    loading = document.getElementById("loading"),
    process = document.getElementById("process"),
    productsEditBtn = document.getElementById("productsEditBtn"),
    productDetailBody = document.getElementById("product-detail-body"),
    uploadFileDetailBody = document.getElementById("product-detail-body"),
    cancelledProductBtn = document.getElementById("cancelledProductBtn"),
    backToProductBtn = document.querySelectorAll(".backToProductBtn"),
    closeCancelBtn = document.querySelector('#cancelled-products button#backProduct')
    isEnabledBtn = document.getElementById("isEnabledBtn"),
    apiEndpoint = '/products'; // Replace with your API endpoint
let itemsPerPage = 5, // Number of items to display per page
    currentPage = 1, // Initial page number
    currentPageCancel = 1,
    currentPageHistory = 1,
    arrs = [];

let header = null

inpFile.addEventListener('click' , (e) => {
      e.target.parentElement.querySelector("#loading").classList.add("active")
      e.target.parentElement.querySelector("#process").classList.remove("active")
})

inpFile.addEventListener('change' , (e) => {
      e.target.parentElement.querySelector("#loading").classList.remove("active")
      e.target.parentElement.querySelector("#error").classList.remove("active")
})

btn.addEventListener('click', async () => {
  document.getElementById("error").classList.remove("active")
  document.getElementById("loading").classList.remove("active")
  process.classList.remove("active")
    if (inpFile.files.length === 0) {
      document.getElementById("error").classList.add("active")
      document.getElementById("error").textContent = "No file changes"
    }else {
        const formData = new FormData()

        formData.append("docFile", inpFile.files[0])

        process.classList.add("active")
        process.textContent = "Processing..."

        await fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => {
          if (!response.ok) {
            throw response.json()
          }

          return response.arrayBuffer()
        })
        .then(array => {
    		const blob = new Blob([array], {
    			type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    		}),
    			href = URL.createObjectURL(blob);

    			window.open(href)

          process.classList.add("active")
          process.textContent = "Success..."
    	   })
        .catch((error) => {
          if (!error.name) {
            error.then(result => {
              document.getElementById("error").classList.add("active")
              document.getElementById("error").textContent = result.message
            })
          }else {
            document.getElementById("error").classList.add("active")
            document.getElementById("error").textContent = "Failed..."
          }

          process.classList.remove('active')
        })
    }
})

productsEditBtn.addEventListener('click', () => {
  textProductBtn()
  productClassDefault()
  searchProductClearElement()

  clearPaginationProduct()

  if (productsEditBtn['fromOther'] === undefined || productsEditBtn['fromOther'] === false) {
    currentPage = 1
  }

  fetchDataProducts(currentPage)
})

cancelledProductBtn.addEventListener('click', () => {
  currentPageCancel = 1
  fetchDataCancelProducts(currentPageCancel)
})

closeCancelBtn.addEventListener('click', () => {
  productsEditBtn['fromOther'] = true
  productsEditBtn.click()
})

isEnabledBtn.addEventListener('click', (e) => {
  const id = e.target['id']
  const isEnabled = e.target['enabled']

  e.target.disabled = true;

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
    method: 'PUT',
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
    e.target.disabled = false;

    if (result.isEnabled !== undefined) {
      if (result.isEnabled) {
        isEnabledBtn.innerText = "Disable"
        isEnabledBtn.dataset.isEnabled = false
        isEnabledBtn.classList.remove('btn-primary')
        isEnabledBtn.classList.add('btn-danger')
      }else {
        isEnabledBtn.innerText = "Enable"
        isEnabledBtn.dataset.isEnabled = true
        isEnabledBtn.classList.remove('btn-danger')
        isEnabledBtn.classList.add('btn-primary')
      }

      alertProductEnable('success', result.message, '#product-detail .alert')
    }
  })
  .catch(error => {
    e.target.disabled = false;

    if (!error.name) {
      error.then(result => {
        alertProductEnable('danger', result.message, '#product-detail .alert')
      })
    }else {
      console.log(error);

      alertProductEnable('success', result.message, '#product-detail .alert')
    }
  })

})

document.querySelector("#addSizeBtn").addEventListener('click', createNewInputSizeElement)

document.querySelector('#products #addProduct').addEventListener('click', (e) => {
  if (e.target.dataset.type == 'add-product') {
    e.target.dataset.type = 'back-To-Product'
    e.target.innerText = 'back'
    addProductClass()
  }else {
    textProductBtn()
    productClassDefault()
  }
})

document.querySelector('#look-product #deleteBtn').addEventListener('click', deleteDataHistory)

document.querySelector('span.search > i.searchBtn').addEventListener('click', (e) => {
  const searchElement = e.target
  const inputElement = e.target.parentElement.querySelector('input')

  if (!inputElement.classList.contains('show')) {
    inputElement.classList.add('show')
    searchElement.classList.replace('fa-magnifying-glass', 'fa-xmark')
  }else {
    inputElement.classList.remove('show')
    searchElement.classList.replace('fa-xmark', 'fa-magnifying-glass')
  }
})

document.querySelector("span.search > input").addEventListener("keypress", function(event) {

      if (event.key === "Enter") {
        let value = event.target.value

        value = value.trim()

        if (value == '') {
          currentPage = 1
          fetchDataProducts(currentPage)
        }else {
          searchProduct(value)
        }
      }
    });

if (backToProductBtn.length > 0) {
  for (var i = 0; i < backToProductBtn.length; i++) {
    backToProductBtn[i].addEventListener('click', () => {
      productsEditBtn['fromOther'] = true
      productsEditBtn.click()
    })
  }
}

document.querySelector('#lookBtn').addEventListener('click', fetchDataHistory)


function productClassDefault() {
  const addProductEl = document.querySelector('#products .add-product-section')
  const containerProduct = document.querySelector('#products #data-container-product')

  if (addProductEl !== null && containerProduct !== null) {
    addProductEl.classList.remove('show')
    containerProduct.classList.add('show')
  }

  document.querySelector('#products .modal-footer .btns').classList.remove('show')
  document.querySelector('#products .modal-footer #pagination-container-product').classList.add('show')
}

function searchProductClearElement() {
  document.querySelector('#products span.search input').classList.remove('show')
  document.querySelector('#products span.search input').value = ''
  document.querySelector('#products span.search i').classList.replace('fa-xmark', 'fa-magnifying-glass')
}

function addProductClass() {
  document.querySelector('#products #data-container-product').classList.remove('show')
  document.querySelector('#products .modal-footer #pagination-container-product').classList.remove('show')
  document.querySelector('#products .add-product-section').classList.add('show')
  document.querySelector('#products .modal-footer .btns').classList.add('show')
}

function textProductBtn() {
  document.querySelector('#products #addProduct').dataset.type = 'add-product'
  document.querySelector('#products #addProduct').innerText = 'add'
}



function searchProduct(value) {
  const url = `${apiEndpoint}/search?q=${value}`;

  showLoadingProduct('#product-detail .modal-body');

  requestData(url)
  .then(result => {
    hideLoadingProduct('#product-detail .modal-body')

    if (!result.items) {
      throw new Error('No items!!!')
    }else {
      if (result.items.length > 0) {
        displayDataProducts(result.items);
        clearPaginationProduct()
      }else {
        throw new Error('No items!!!')
      }
    }
  })
  .catch(error => {
    console.error(error);
    hideLoadingProduct('#product-detail .modal-body')
  })
}

function requestData(url){
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        resolve(data)
      })
      .catch(error => {
        console.error('Error:', error);

        if (error.name == 'Error') {
          console.log(error.message)

          const dataContainer = document.getElementById('data-container-product');

          dataContainer.innerHTML = `
          <h2>No data item</h2>
          `
        }

        resolve('failed')
      });
  })
}

function fetchDataProducts(page) {
  const url = `${apiEndpoint}?page=${page}&limit=${itemsPerPage}`;

  showLoadingProduct('#products .modal-body');

  requestData(url)
  .then(result => {
    if (!result.items) {
      throw new Error('No items!!!')
    }else {
      hideLoadingProduct('#products .modal-body')

      createElementProduct()

      if (result.items.length > 0) {
        displayDataProducts(result.items);
        createPaginationProducts(result.totalPages);
      }else {
        if (currentPage > 1) {
          currentPage = currentPage - 1
          fetchDataProducts(currentPage)
        }
      }
    }
  })
  .catch(error => {
    console.error(error);
    hideLoadingProduct('#products .modal-body')
  })

  productsEditBtn['fromOther'] = false
}

function displayDataProducts(items) {
  const dataContainer = document.getElementById('data-container-product');
  const paginationContainer = document.getElementById('pagination-container-product')
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

    dataContainer.classList.add('show')
    paginationContainer.classList.add('show')
  });
}

function displayDetailProduct(item) {
    isEnabledFunc(item)
    isEnabledBtn['id'] = item.id
    isEnabledBtn['enabled'] = item.isEnabled ? false : true

    productDetailBody.innerHTML = createProductNameElement(item.name)

    const row = document.createElement('div')

    row.classList.add('row')

    row.innerHTML = createHeaderSizeElement()

    const obj = item.sizes

    Object.keys(obj).map(function(key, index) {
      row.innerHTML += createInputSizeElement(obj, key)
    });

    productDetailBody.appendChild(row)
    productDetailBody.innerHTML += '<button type="button" class="btn btn-primary float-end btn-sm submitBtn">Submit</button>'

    productDetailListener(item.id)
}

function productDetailListener(id = null) {
  const trashBtn = document.querySelectorAll('.trashBtn')
  const labelInput = document.querySelector('#product-detail input.form-label')
  let submitBtn = document.querySelector('#product-detail .submitBtn')

  trashBtn.forEach((item) => {
    if (!item['eventClick']) {
      item.addEventListener('click', clearInputSizeElement)
      item['eventClick'] = true
    }
  });


  if (labelInput !== null) {
    labelInput.addEventListener('keyup', (e) => {
      const element = e.target
      const input = element.parentElement.querySelector('input[type=number]')

      input.id = element.value

    })
  }

  if (id !== null) {
    submitBtn['id'] = id
  }

  submitBtn.addEventListener('click', uploadDataProduct)
}

function massAddProductListener() {
  document.querySelector('#products #add-product-input').addEventListener('click' , (e) => {
      e.target.parentElement.querySelector("#loading").classList.add("active")
      e.target.parentElement.querySelector("#process").classList.remove("active")
  })

  document.querySelector('#products #add-product-input').addEventListener('change' , (e) => {
      e.target.parentElement.querySelector("#loading").classList.remove("active")
      e.target.parentElement.querySelector("#error").classList.remove("active")
  })

  document.querySelector('#products #add-product-btn').addEventListener('click', async (e) => {
    e.target.parentElement.querySelector("#error").classList.remove("active")
    e.target.parentElement.querySelector("#loading").classList.remove("active")
    e.target.parentElement.querySelector("#process").classList.remove("active")
      if (e.target.parentElement.querySelector('#products #add-product-input').files.length === 0) {
        e.target.parentElement.querySelector("#error").classList.add("active")
        e.target.parentElement.querySelector("#error").textContent = "No file change"
        setTimeout(() => {
          e.target.parentElement.querySelector("#error").classList.remove("active")
        }, 3000)
      }else {
          const formData = new FormData()

          formData.append("docFile", e.target.parentElement.querySelector('#products #add-product-input').files[0])

          e.target.parentElement.querySelector("#process").classList.add("active")
          e.target.parentElement.querySelector("#process").textContent = "Processing..."

          await fetch('/mass-add-product', {
              method: 'POST',
              body: formData
          }).then(response => {
            if (!response.ok) {
              throw response.json()
            }

            return response.json()
          }).then(result => {
      	     console.log(result);
            e.target.parentElement.querySelector("#process").classList.add("active")
            e.target.parentElement.querySelector("#process").textContent = "Success..."

      	}).catch((error) => {
          console.log(error)
          if (!error.name) {
            error.then(result => {
              e.target.parentElement.querySelector("#error").textContent = result.message
            })
          }else {
            e.target.parentElement.querySelector("#error").textContent = "Failed..."
          }

          e.target.parentElement.querySelector("#error").classList.add("active")

          e.target.parentElement.querySelector("#process").classList.remove("active")

          setTimeout(() => {
            e.target.parentElement.querySelector("#error").classList.remove("active")
          }, 3000)
        })
      }
  })
}

function uploadDataProduct(e) {
  const element = e.target
  const parentElement = element.parentElement
  const inputElement = parentElement.querySelectorAll('input:not(.new)')

  const values = {}

  element.disabled = true

  inputElement.forEach((item) => {
    values[item.id] = item.value
    item.disabled =  true
  });

  let formBody = [];
  for (const property in values) {
    const encodedKey = encodeURIComponent(property);
    const encodedValue = encodeURIComponent(values[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");

  fetch(`${apiEndpoint}/${element['id']}`, {
    method: 'PUT',
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
    alertProductEdit('success', result.message)
    element.disabled = false
    inputElement.forEach((item) => {
      item.disabled =  false
    });
  })
  .catch(error => {
    if (!error.name) {
      error.then(function(obj) {
        alertProductEdit('danger', obj.message)
      });
    }
  })


}

function alertProductEdit(value, message) {
  const alert = document.querySelector('#product-detail .alert')

  alert.classList.add(`alert-${value}`)
  alert.classList.remove('op-0')

  alert.textContent = message

  setTimeout(() => {
    alert.classList.remove(`alert-${value}`)
    alert.classList.add('op-0')
    alert.textContent = ""
  }, 1500)
}

function isEnabledFunc(value) {
  isEnabledBtn['id'] = value.id
  isEnabledBtn['enabled'] = value.isEnabled

  if (isEnabledBtn['enabled']) {
    isEnabledBtn.textContent = 'Disable'
    isEnabledBtn.classList.replace('btn-primary', 'btn-danger')
  }else {
    isEnabledBtn.textContent = 'Enable'
    isEnabledBtn.classList.replace('btn-danger', 'btn-primary')
  }
}

function createElementProduct() {
  const body = document.querySelector('#products .modal-body')

  body.innerHTML = `
    <div id="data-container-product">

    </div>
    <div class="add-product-section">

      <section id="fileUploaderAddProduct">
          <h4>Add Product</h4>

          <div class="error">
            <h4 id="error" style="color: red"></h4>
          </div>

            <input type="file" id="add-product-input">
            <button type="submit" id="add-product-btn">Upload!</button>
            <p id="loading">Loading...</p>
            <p id="process"></p>
    </section>
    </div>
  `

  massAddProductListener()
}

function createHeaderSizeElement() {
  return `
  <div class="row d-flex">
  <div class="mb-3 col-6">
  <h6>Size</h6>
  </div>

  </div>
  `
}

function createProductNameElement(item) {
  return `
    <div class="mb-3">
      <label for="name" class="form-label"><h6> Name </h6> </label>
      <input class="form-control form-control-sm" id="name" type="text" placeholder="Name of product" value="${item}">
    </div>
  `

}

function createInputSizeElement(obj, key) {
  return `
  <div class="row mb-3 d-flex">
    <div class="col-7 d-flex align-items-start">
      <div>
        <label for="${key}" class="form-label">${key} </label>
        <input class="form-control form-control-sm" id="${key}" type="number"  value="${obj[key]}">
      </div>
      <span class="ms-3 mt-2 text-danger trashBtn">
        <i class="fa-solid fa-trash"></i>
      </span>
    </div>
  </div>
  `
}

function createNewInputSizeElement() {
  const container = document.querySelector('#product-detail-body > div.row')
  const row = document.createElement('div')

  row.classList.add('row', 'mb-3', 'd-flex')

  row.innerHTML = `
    <div class="col-7 d-flex align-items-start">
      <div>
        <input class="form-control form-control-sm form-label new" type="text" placeholder="Size...">
        <input class="form-control form-control-sm" type="number">
      </div>
      <span class="ms-3 mt-2 text-danger trashBtn">
        <i class="fa-solid fa-trash"></i>
      </span>
    </div>
  `

  container.appendChild(row)

  productDetailListener()
}

function clearInputSizeElement(e) {
  const element = e.target
  let parentElement = element.parentElement
  parentElement = parentElement.parentElement

  parentElement.remove()
}

function clearPaginationProduct() {
  const paginationContainer = document.getElementById('pagination-container-product');
  paginationContainer.innerHTML = '';
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

function showLoadingProduct(selector) {
  const body = document.querySelector(selector)

  body.innerHTML = ''

  const div = document.createElement('div')

  div.classList.add('loading')

  div.style.textAlign = 'center'

  div.innerHTML = `
    <div class="spinner-border text-success" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  `

  body.appendChild(div)
}

function hideLoadingProduct(selector) {
  const body = document.querySelector(selector)

  body.innerHTML = ''
}



// Product Cancelled



function fetchDataCancelProducts(page) {
  const url = `${apiEndpoint}/cancel/?page=${page}&limit=${itemsPerPage}`;

  showLoadingProduct('#cancelled-products .modal-body');

  fetch(url)
    .then(response => response.json())
    .then(data => {
      hideLoadingProduct('#cancelled-products .modal-body');
      if (!data.items) {
        throw new Error('No items!!!')
      }else {
        if (data.items.length > 0) {
          displayDataCancelProducts(data.items);
          createPaginationCancelProducts(data.totalPages);
        }else {
          if (currentPageCancel > 1) {
            currentPageCancel = currentPageCancel - 1
            fetchDataCancelProducts(currentPageCancel)
          }
        }
      }
    })
    .catch(error => {
      console.error('Error:', error);
      if (error.name == 'Error') {
        console.log(error.message)

        const dataContainer = document.getElementById('data-container-product');

        dataContainer.innerHTML = `
            <h2>No data item</h2>
        `
      }
      hideLoadingProduct('#cancelled-products .modal-body');
    });
}

function displayDataCancelProducts(items) {
  const dataContainer = document.getElementById('data-container-cancelled-product');
  const ul = document.createElement('ul')
  dataContainer.innerHTML = '';


  items.forEach((item) => {
      const li = createLiElementCancel(item)
      ul.appendChild(li)
  });
  dataContainer.appendChild(ul)

}

function createLiElementCancel(item) {
  const li = document.createElement('li')
  const button = document.createElement('button')
  const p = document.createElement('p')

  button.type = 'button'
  button.classList.add('btn', 'btn-primary')
  button.textContent = "Enable";

  p.textContent = item.name;
  button['id'] = item.id
  button['isEnabled'] = true

  button.addEventListener('click', cancelBtnFunc)

  li.appendChild(p)
  li.appendChild(button)

  return li
}

function cancelBtnFunc(e) {
  e.target.disabled = true

  try {
    const isEnabled = e.target['isEnabled']
    const id = e.target['id']

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
      method: 'PUT',
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

        fetchDataCancelProducts(currentPageCancel)
        alertProductEnable('success', result.message, '#pagination-container-cancelled-product .alert')
    })
    .catch(error => {
      e.target.disabled = false
      console.error(error);
      if (!error.name) {
        error.then(result => {
            alertProductEnable('danger', result.message, '#pagination-container-cancelled-product .alert')
        })
      }else {
            alertProductEnable('danger', 'Something wrong!!!', '#pagination-container-cancelled-product .alert')
      }
    })
  } catch (e) {
    console.error(e)
  }
}

function alertProductEnable(status, message, element) {
  const alert = document.querySelector(element)

  alert.classList.add(`alert-${status}`)
  alert.classList.remove('op-0')

  alert.textContent = message

  setTimeout(() => {
    alert.classList.remove(`alert-${status}`)
    alert.classList.add('op-0')
    alert.textContent = ""
  }, 1500)
}

function createPaginationCancelProducts(totalPages) {
  const paginationContainer = document.getElementById('pagination-container-cancelled-product');
  paginationContainer.innerHTML = '';

  paginationContainer.innerHTML = `
  <div class="alert op-0" role="alert">
  </div>
  `

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
    if (currentPageCancel <= halfVisiblePages) {
      startPage = 1;
      endPage = maxVisiblePages;
    } else if (currentPageCancel + halfVisiblePages >= totalPages) {
      startPage = totalPages - maxVisiblePages + 1;
      endPage = totalPages;
    } else {
      startPage = currentPageCancel - halfVisiblePages;
      endPage = currentPageCancel + halfVisiblePages;
    }
  }

  const nav = document.createElement('nav')
  const ul = document.createElement('ul')

  ul.classList.add('pagination')

  nav.appendChild(ul)

  // Add previous button if not on the first page
  if (currentPageCancel !== 1) {
    addButton('Previous', currentPageCancel - 1);
  }

  // Add dots if startPage is greater than 1
  if (startPage > 1) {
    addButton('...', startPage - 1);
  }

  // Add pagination buttons for the range of pages
  for (let i = startPage; i <= endPage; i++) {
    addButton(i, i, i === currentPageCancel);
  }

  // Add dots if endPage is less than totalPages
  if (endPage < totalPages) {
    addButton('...', endPage + 1);
  }

  // Add next button if not on the last page
  if (currentPageCancel !== totalPages) {
    addButton('Next', currentPageCancel + 1);
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
        const previousActiveButton = document.querySelector('#pagination-container-cancelled-product .active');
        if (previousActiveButton) {
          previousActiveButton.classList.remove('active');
        }
        currentPageCancel = page;
        fetchDataCancelProducts(currentPageCancel);
      });
      ul.appendChild(li);


  }

  paginationContainer.appendChild(ul)


}


// History


function fetchDataHistory() {

  const url = '/products/history'

  showLoadingHistory()

  fetch(url)
  .then(response => response.json())
  .then(result => {
    hideLoadingHistory()

    if (result['items'].length > 0) {
      displayDataHistory(result.items)
    }else {
      displayNoDataHistory()
    }


  })
  .catch(error => {
    const message = error.message

    console.error(message);

    hideLoadingHistory()

    displayErrorDataHistory()

  })
}

function deleteDataHistory() {
  const url = 'products/history'
  const option = {
    method: 'DELETE'
  }

  showLoadingProduct()


  fetch(url, option)
  .then((response) => response.json())
  .then(result => {
    hideLoadingHistory()
    if (result.code === 200) {
      displayNoDataHistory()
    }else {
      fetchDataHistory()
    }
  })
  .catch(error => {
    console.log(error);
    hideLoadingHistory()
    displayErrorDataHistory()
  })
}

function displayDataHistory(items) {
  const body = document.querySelector('#look-product #look-product-detail')

  items.forEach((item, i) => {
    const divItem = document.createElement('div')
    const textItem = document.createTextNode(item.title)
    const divItemActive = document.createElement('div')
    const textItemActive = document.createTextNode(item.isEnabled ? 'Product : Active ' : 'Product : InActive ')

    divItem.classList.add('item')

    divItem.appendChild(textItem)
    divItemActive.appendChild(textItemActive)

      if (item.isEnabled) {
        const sizes = `${item['sizes'].S ? ', S : ' + item['sizes'].S : ''}, ${item['sizes'].M ? 'M : ' + item['sizes'].M : ''}, ${item['sizes'].L ? 'L : ' + item['sizes'].L : ''}, ${item['sizes'].XL ? 'XL : ' + item['sizes'].XL : ''}, ${item['sizes'].XXL ? 'XXL : ' + item['sizes'].XXL : ''}`
        const textItemChild = document.createTextNode(sizes)
        divItemActive.appendChild(textItemChild)
      }
      divItem.appendChild(divItemActive)
    body.appendChild(divItem)

  });

  const itemsElement = body.querySelectorAll('.item')

  itemsElement.forEach(item => {
    item.addEventListener('click', () => {

        const div = item.querySelector('div')
        if (!div.classList.contains('show')) {
            div.classList.add('show')
            item.classList.add('show')
        }else {
            div.classList.remove('show')
            item.classList.remove('show')
        }

    })})

}

function displayNoDataHistory() {
  const body = document.querySelector('#look-product #look-product-detail')

  const div = document.createElement('div')
  const h2 = document.createElement('h2')
  const text = document.createTextNode('No Data')

  div.style.textAlign = 'center'

  h2.appendChild(text)
  div.appendChild(h2)
  body.appendChild(div)
}

function displayErrorDataHistory() {
  const body = document.querySelector('#look-product #look-product-detail')


  const div = document.createElement('div')
  const h2 = document.createElement('h2')
  const text = document.createTextNode('Something wrong!!!')

  div.style.textAlign = 'center'

  h2.appendChild(text)
  div.appendChild(h2)
  body.appendChild(div)
}

function showLoadingHistory() {
  const body = document.querySelector('#look-product #look-product-detail')

  const div = document.createElement('div')

  div.classList.add('loading')

  div.style.textAlign = 'center'

  div.innerHTML = `
    <div class="spinner-border text-success" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  `

  body.appendChild(div)
}

function hideLoadingHistory() {
  const body = document.querySelector('#look-product #look-product-detail')

  body.innerHTML = ''
}
