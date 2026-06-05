document.addEventListener("click", function (event) {
    const trigger = event.target.closest("[data-toggle]");
    if (trigger) {
        const selector = trigger.dataset.toggle;
        const isClosest = selector.startsWith("closest:");

        const target = isClosest
            ? trigger.closest(selector.slice("closest:".length))
            : document.querySelector(selector);
        if (!target) return;

        const isOpen = target.classList.toggle("is-open");

        if (isClosest) {
            syncAriaExpanded(trigger, isOpen);
        } else {
            document.querySelectorAll('[data-toggle="' + selector + '"]').forEach(function (t) {
                syncAriaExpanded(t, isOpen);
            });
        }
        return;
    }

    const action = event.target.closest("[data-action]");
    if (action && action.dataset.action === "print") {
        window.print();
    }
});

function syncAriaExpanded(el, isOpen) {
    if (el.hasAttribute("aria-expanded")) {
        el.setAttribute("aria-expanded", String(isOpen));
    }
}
