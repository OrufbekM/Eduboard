const submitBtn = document.getElementById("submitBtn");
const form = document.getElementById("classForm");

// Forma to'liq to'ldirilganini tekshirish
function isFormValid() {
	return form && form.checkValidity();
}

// Formani AJAX orqali faqat form mavjud bo'lsa yuboramiz
if (form && submitBtn) {
	form.addEventListener("submit", function (e) {
		e.preventDefault();

		if (!isFormValid()) {
			form.reportValidity();
			return;
		}

		submitBtn.disabled = true;

		const formData = new FormData(form);

		fetch(form.action, {
			method: "POST",
			body: formData,
			headers: {
				"X-Requested-With": "XMLHttpRequest",
			},
		})
			.then(response => response.json())
			.then(data => {
				if (data.success) {
					// Close modal and silently refresh list
					aremove();
					window.location.reload();
				} else {
					// You can later show inline error instead of alert if needed
					console.error("Create class error:", data.error);
				}
			})
			.catch(error => {
				console.error("Error creating class:", error);
			})
			.finally(() => {
				submitBtn.disabled = false;
			});
	});
}

var acbtn = document.querySelector(".addClass");
var acfs = document.querySelector(".acfullscreen");
var acform = document.querySelector(".acform");
var accancel = document.querySelector("#cancelBtn");

function acactive() {
	if (!acfs || !acform) return;
	acfs.classList.toggle("acfsa");
	acform.classList.toggle("acforma");
}

function aremove() {
	if (!acfs || !acform) return;
	acfs.classList.remove("acfsa");
	acform.classList.remove("acforma");
	
	// Form yopilganda reset qilish
	const categorySelect = document.getElementById("category");
	const typeSelect = document.getElementById("type_id");
	const typeSelectContainer = document.getElementById("typeSelectContainer");
	
	if (categorySelect && typeSelect && typeSelectContainer) {
		typeSelectContainer.style.display = "none";
		typeSelect.value = "";
		categorySelect.value = "";
		// Formani ham reset qilish
		if (form) {
			form.reset();
		}
	}
}

if (acbtn) {
	acbtn.addEventListener("click", () => {
		acactive();
	});
}

if (acfs) {
	acfs.addEventListener("click", () => {
		aremove(); // Formani yopish va reset qilish
	});
}

if (accancel) {
	accancel.addEventListener("click", () => {
		aremove(); // Formani yopish va reset qilish
	});
}

// Category va lesson type dropdownlarni boshqarish
const categorySelect = document.getElementById("category");
const typeSelect = document.getElementById("type_id");
const typeSelectContainer = document.getElementById("typeSelectContainer");

if (categorySelect && typeSelect && typeSelectContainer) {
	// Category tanlanganda
	categorySelect.addEventListener("change", function() {
		const selectedCategoryId = this.value;
		
		if (selectedCategoryId) {
			// Lesson type dropdownni ko'rsatish
			typeSelectContainer.style.display = "block";
			
			// Faqat tanlangan categoryga tegishli lesson typelarni ko'rsatish
			const options = typeSelect.querySelectorAll("option");
			options.forEach(option => {
				if (option.value === "") {
					// Placeholder optionni har doim ko'rsatish
					option.style.display = "block";
				} else {
					const optionCategoryId = option.getAttribute("data-category");
					if (optionCategoryId === selectedCategoryId) {
						option.style.display = "block";
					} else {
						option.style.display = "none";
					}
				}
			});
			
			// Type selectni reset qilish
			typeSelect.value = "";
		} else {
			// Category tanlanmagan bo'lsa, lesson type dropdownni yashirish
			typeSelectContainer.style.display = "none";
			typeSelect.value = "";
		}
	});
	
}