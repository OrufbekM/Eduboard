// fullscreen
function fullscreen(){
  if (!document.fullscreenElement) {
    // If the document is not in fullscreen mode, request it for the HTML element
    document.documentElement.requestFullscreen().catch(err => {
      console.error(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
    });
  } else {
    // Otherwise, exit fullscreen mode
    document.exitFullscreen();
  }
}
// MENU TOGGLE

var leftmenu = document.querySelector(".leftmenu");
var menubtn = document.querySelector(".menubtn");

function menutoggle() {
    if (!leftmenu || !menubtn) return;
    leftmenu.classList.toggle("menuactive");
    menubtn.classList.toggle("menubtnctive");
}

// ADD LESSON FORM TOGGLE

var addformer = document.querySelector(".addformer");
var lessonform = document.querySelector(".lessonform");
var lessoncancel = document.querySelector(".lessoncancel");
var lessonInput = document.querySelector(".lessoninp");
var roadmap = document.querySelector(".roadmap");

function lessonFormToggle() {
    if (!lessonform) return;
    lessonform.classList.toggle("activeform");
    if (lessonform.classList.contains("activeform") && lessonInput) {
        lessonInput.focus();
    }
}

if (addformer) {
    addformer.addEventListener("click", lessonFormToggle);
}

if (lessoncancel) {
    lessoncancel.addEventListener("click", lessonFormToggle);
}

// AJAX submit for lesson form (no full page refresh)
if (lessonform && lessonInput && roadmap) {
    lessonform.addEventListener("submit", function (e) {
        e.preventDefault();
        const name = lessonInput.value.trim();
        if (!name) return;

        const csrfInput = lessonform.querySelector("input[name=csrfmiddlewaretoken]");
        const csrfToken = csrfInput ? csrfInput.value : null;

        const formData = new FormData(lessonform);

        fetch(window.location.href, {
            method: "POST",
            body: formData,
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                ...(csrfToken ? { "X-CSRFToken": csrfToken } : {}),
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (!data.success) {
                    console.error("Lesson create error:", data.error);
                    return;
                }

                // Create new lesson link before the form (oxirgi lesson oldida)
                const link = document.createElement("a");
                link.href = "#";
                link.className = "ls";
                link.textContent = data.lesson_name || name;

                roadmap.insertBefore(link, lessonform);

                // clear and hide form, menu open qoladi
                lessonInput.value = "";
                lessonform.classList.remove("activeform");
            })
            .catch((err) => {
                console.error("Network error while creating lesson:", err);
            });
    });
}

