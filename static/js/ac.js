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
					alert(data.message || "Class created successfully!");
					aremove();
					window.location.reload();
				} else {
					alert(data.error || "Failed to create class.");
				}
			})
			.catch(error => {
				console.error("Error creating class:", error);
				alert("Unexpected error while creating class.");
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
}

if (acbtn) {
	acbtn.addEventListener("click", () => {
		acactive();
	});
}

if (acfs) {
	acfs.addEventListener("click", () => {
		acactive();
	});
}

if (accancel) {
	accancel.addEventListener("click", () => {
		acactive();
	});
}