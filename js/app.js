
document.addEventListener("DOMContentLoaded", function () {

    document.querySelectorAll("[data-modal-close]").forEach(function (button) {
        button.addEventListener("click", function () {
            const modal = this.closest(".modal-overlay");
            if (modal) {
                modal.classList.remove("show");
                document.body.style.overflow = "";
            }
        });
    });

    document.querySelectorAll(".modal-overlay").forEach(function (modal) {
        modal.addEventListener("click", function (event) {
            if (event.target === modal) {
                modal.classList.remove("show");
                document.body.style.overflow = "";
            }
        });
    });

    document.querySelectorAll(".check-button").forEach(function (button) {
        button.addEventListener("click", function () {
            this.classList.toggle("checked");
            this.textContent = this.classList.contains("checked") ? "✓" : "";
        });
    });

    const regionSelect = document.getElementById("region-select");
    const regionModal = document.getElementById("region-modal");
    const selectedRegion = document.getElementById("selected-region");

    if (regionSelect && regionModal) {
        regionSelect.addEventListener("click", function () {
            regionModal.classList.add("show");
            document.body.style.overflow = "hidden";
        });
    }

    document.querySelectorAll(".region-option").forEach(function (option) {
        option.addEventListener("click", function () {
            if (selectedRegion) {
                selectedRegion.textContent = this.dataset.region;
            }

            if (regionModal) {
                regionModal.classList.remove("show");
            }

            document.body.style.overflow = "";
            updateConditionProgress();
        });
    });

    document.querySelectorAll(".chip-group").forEach(function (group) {
        const chips = group.querySelectorAll(".chip");

        chips.forEach(function (chip) {
            chip.addEventListener("click", function () {
                chips.forEach(item => item.classList.remove("active"));
                this.classList.add("active");
                updateConditionProgress();
            });
        });
    });

    const incomeToggle = document.getElementById("income-toggle");

    if (incomeToggle) {
        incomeToggle.addEventListener("click", function () {
            this.classList.toggle("active");
            this.setAttribute("aria-pressed", this.classList.contains("active") ? "true" : "false");
            updateConditionProgress();
        });
    }

    function updateConditionProgress() {
        const fill = document.getElementById("condition-progress-fill");
        const number = document.getElementById("progress-number");
        const description = document.getElementById("progress-description");

        if (!fill || !number || !description) return;

        let count = 0;

        if (selectedRegion && selectedRegion.textContent.trim() !== "지역을 선택해 주세요") count++;
        if (document.querySelector("#rent-type-group .chip.active")) count++;
        if (document.querySelector("#household-group .chip.active")) count++;
        if (incomeToggle && incomeToggle.classList.contains("active")) count++;

        fill.style.width = (count / 4) * 100 + "%";
        number.textContent = count + " / 4";
        description.textContent = "조건 4개 중 " + count + "개 설정";
    }

    const resetButton = document.getElementById("reset-button");

    if (resetButton) {
        resetButton.addEventListener("click", function () {
            if (selectedRegion) selectedRegion.textContent = "지역을 선택해 주세요";
            document.querySelectorAll(".chip").forEach(chip => chip.classList.remove("active"));

            if (incomeToggle) {
                incomeToggle.classList.remove("active");
                incomeToggle.setAttribute("aria-pressed", "false");
            }

            updateConditionProgress();
        });
    }

    document.querySelectorAll(".bookmark-button").forEach(function (button) {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();
            this.classList.toggle("active");
            this.setAttribute("aria-pressed", this.classList.contains("active") ? "true" : "false");
        });
    });

    const documentChecks = document.querySelectorAll(".document-check-button");
    const documentProgressFill = document.getElementById("document-progress-fill");
    const documentProgressText = document.getElementById("document-progress-text");

    function updateDocumentProgress() {
        if (!documentProgressFill || !documentProgressText || documentChecks.length === 0) return;

        const checkedCount = document.querySelectorAll(".document-check-button.checked").length;
        const total = documentChecks.length;

        documentProgressFill.style.width = (checkedCount / total) * 100 + "%";
        documentProgressText.textContent = checkedCount + " / " + total;
    }

    documentChecks.forEach(function (button) {
        button.addEventListener("click", updateDocumentProgress);
    });

    const shareOpen = document.getElementById("share-open");
    const shareModal = document.getElementById("share-modal");

    if (shareOpen && shareModal) {
        shareOpen.addEventListener("click", function () {
            shareModal.classList.add("show");
            document.body.style.overflow = "hidden";
        });
    }

    const signaturePad = document.getElementById("signature-pad");

    if (signaturePad) {
        const canvas = document.createElement("canvas");
        signaturePad.appendChild(canvas);
        const context = canvas.getContext("2d");

        let drawing = false;

        function resizeCanvas() {
            const rect = signaturePad.getBoundingClientRect();
            const ratio = window.devicePixelRatio || 1;

            canvas.width = rect.width * ratio;
            canvas.height = rect.height * ratio;
            canvas.style.width = rect.width + "px";
            canvas.style.height = rect.height + "px";

            context.setTransform(ratio, 0, 0, ratio, 0, 0);
            context.lineWidth = 2;
            context.lineCap = "round";
            context.lineJoin = "round";
            context.strokeStyle = "#171717";
        }

        resizeCanvas();

        function getPoint(event) {
            const rect = canvas.getBoundingClientRect();
            const point = event.touches ? event.touches[0] : event;

            return {
                x: point.clientX - rect.left,
                y: point.clientY - rect.top
            };
        }

        function startDrawing(event) {
            drawing = true;
            const point = getPoint(event);
            context.beginPath();
            context.moveTo(point.x, point.y);
            event.preventDefault();
        }

        function draw(event) {
            if (!drawing) return;
            const point = getPoint(event);
            context.lineTo(point.x, point.y);
            context.stroke();
            event.preventDefault();
        }

        function stopDrawing() {
            drawing = false;
        }

        canvas.addEventListener("mousedown", startDrawing);
        canvas.addEventListener("mousemove", draw);
        window.addEventListener("mouseup", stopDrawing);

        canvas.addEventListener("touchstart", startDrawing, { passive: false });
        canvas.addEventListener("touchmove", draw, { passive: false });
        canvas.addEventListener("touchend", stopDrawing);
    }
});
