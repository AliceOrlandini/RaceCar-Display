let radial_chart_options = {
  type: 'doughnut',
  animation: false,
  data: {
    labels: {
      display: true
    },
    datasets: [{
        data: [50, 50],
        backgroundColor: ['#00E728', '#000000'],
        borderColor: ['#00E728', '#000000']
    }]
  },
  options: {
    responsive: true,
    cutout: 80
  }
}