const btn = document.getElementById("btnUpload"),
    inpFile = document.getElementById("inpFile"),
    // ExcelJS = require('exceljs'),
    // workbook = new ExcelJS.Workbook(),
    loading = document.getElementById("loading"),
    process = document.getElementById("process"),
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

        const excel = await fetch('/upload', {
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
