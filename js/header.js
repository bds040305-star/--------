
document.addEventListener("DOMContentLoaded", function () {
    const headerTarget = document.getElementById("header");
    if (!headerTarget) return;

    fetch("./header.html")
        .then(response => response.text())
        .then(html => {
            headerTarget.innerHTML = html;

            const openButton = document.getElementById("quick-menu-open");
            const quickMenu = document.getElementById("quick-menu");

            if (openButton && quickMenu) {
                openButton.addEventListener("click", function () {
                    quickMenu.classList.add("show");
                    document.body.style.overflow = "hidden";
                });
            }
        })
        .catch(console.error);
});
