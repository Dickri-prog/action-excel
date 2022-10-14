const btn = document.getElementById("btnUpload"),
    inpFile = document.getElementById("inpFile"),
    ExcelJS = require('exceljs'),
    workbook = new ExcelJS.Workbook(),
    loading = document.getElementById("loading"),
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

btn.addEventListener('click', async () => {
    const formData = new FormData()

    formData.append("ExcelFile", inpFile.files[0])

    const excel = await fetch('/upload', {
        method: 'POST',
        body: formData
    }).then(response => response.arrayBuffer()).then(array => {
		const blob = new Blob([array], {
			type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		}),
			href = URL.createObjectURL(blob);
	
			window.open(href)
	})
})