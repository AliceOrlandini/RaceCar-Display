const element = document.getElementById("error_bar");
var error = false;
var timesRun = 0;

const intervalID = setInterval(() => {
    if(error) {
        element.classList.remove("bg-orange-500");
    } else {
        element.classList.add("bg-orange-500");
    }
    error = !error;
    timesRun++;
    if(timesRun === 60) {
        element.classList.remove("bg-orange-500");
        error = false;
        clearInterval(intervalID);
    }
    
}, 500)