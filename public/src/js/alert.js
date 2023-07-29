let swal = null

function showLoadingAlert(title) {
  if(swal) {
    swal.close()
  }

  swal = Swal.fire({
    position: 'center',
    title: title,
    showConfirmButton: false,
    background: '#121212',
    didOpen: () => {
      Swal.showLoading()
    },
  })
}

function showSuccessAlert(title) {
  if(swal) {
    swal.close()
  }

  swal = Swal.fire({
    position: 'center',
    icon: 'success',
    background: '#121212',
    title: title,
    timer: 1500,
    showConfirmButton: false,
    didOpen: () => {
      Swal.hideLoading()
    },
  })
}