





const categorySelect = document.getElementById("category");
const typeSelect = document.getElementById("type");
const typeContainer = document.getElementById("typeSelectContainer");
const submitBtn = document.getElementById("submitBtn");
const form = document.getElementById("classForm");
const inputs = form.querySelectorAll("input, select");

const linguisticTypes = [
    "Uzbek-English",
    "Russian-English",
    "Uzbek-Russian",
    "Ielts",
    "Other"
];

const subjectTypes = [
    "SAT",
    "Other"
];

categorySelect.addEventListener("change", () => {
    typeSelect.innerHTML = `<option value="" disabled selected>Select type</option>`;
    if (categorySelect.value === "linguistic") {
        linguisticTypes.forEach(t => {
            typeSelect.innerHTML += `<option value="${t}">${t}</option>`;
        });
    } else if (categorySelect.value === "subject") {
        subjectTypes.forEach(t => {
            typeSelect.innerHTML += `<option value="${t}">${t}</option>`;
        });
    }
    typeContainer.style.display = "block";
    checkFormValidity();
});

inputs.forEach(el => el.addEventListener("input", checkFormValidity));
function checkFormValidity() {
    const valid = form.checkValidity();
    submitBtn.disabled = !valid;
}

var acbtn = document.querySelector(".addClass")
var acfs = document.querySelector(".acfullscreen")
var acform = document.querySelector(".acform")
var accancel = document.querySelector("#cancelBtn")

function acactive() {
    acfs.classList.toggle("acfsa")
    acform.classList.toggle("acforma")
}

function aremove() {
    acfs.classList.remove("acfsa")
    acform.classList.remove("acforma")
}

acbtn.addEventListener("click",()=>{
    acactive();
})

acfs.addEventListener("click",()=>{
    acactive();
})

accancel.addEventListener("click",()=>{
    acactive();
})