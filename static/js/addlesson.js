var addformer=document.querySelector(".addformer")
var lessonform=document.querySelector(".lessonform")
var lessoncancel=document.querySelector(".lessoncancel")

function formactive(params) {
    lessonform.classList.toggle("activeform") 
}

addformer.addEventListener("click",()=>{
    formactive()
})
lessoncancel.addEventListener("click",()=>{
    formactive()
})

