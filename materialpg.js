/**
 *
 * File: materialpg.js
 * @description This file contains functions and methods which ensure the functionality of the MaterialPG framework
 * Author: @PaletaGalleta
 * Date: 04-08-2023
 */

document.addEventListener("DOMContentLoaded", initialize);

/**
 * Inicializa los funcionamientos principales de cualquier pagina del sitio
 * - Carga el Panel de Navegacion
 * - Listener para cambiar el tema
 * - Establece el icono correcto
 * - Crea el area de notificacion
 */
function initialize() {
    loadComponents();
    detectColorScheme();

    // Listener para cambiar tema
    const themeSwitches = document.querySelectorAll("#themeswitch");
    themeSwitches.forEach(themeSwitch => themeSwitch.addEventListener("click", switchTheme));

    // Si el tema ya esta en Modo Oscuro, establecer el icono correctamente
    if (document.documentElement.getAttribute("data-theme") == "dark") {
        document.getElementById("themeswitch").querySelector(".item").innerHTML = `dark_mode<span class="desc">Modo Claro</span>`;
    }

    // Crear el area de notificacion
    const notification = document.createElement("div");
    notification.classList.add("notification");
    // Agregar al body
    document.body.prepend(notification);

    const topBar = document.querySelector(".top-bar");
    const mainContainer = document.body;

    if (topBar && mainContainer) {
        if (!topBar.classList.contains("scrolled")) {
            mainContainer.addEventListener("scroll", () => {
                console.log("yes");
                setClass(mainContainer.scrollTop > 0, topBar, "scrolled");
            });
        }
    }

    // Create an Intersection Observer
    const observer = new IntersectionObserver(handleIntersection, {
        threshold: 0.4, // Adjust this threshold as needed
    });

    // Target the elements with "anim-intersect" class
    const forwardAnimElements = document.querySelectorAll(".anim-intersect");

    forwardAnimElements.forEach(elem => {
        elem.classList.add("anim-none");
        elem.style.opacity = 0;

        // Start observing the element
        observer.observe(elem);
    });

    document.dispatchEvent(new Event("MaterialPGInitialized"));
}

/**
 * Cambia el tema y establece una variable en localStorage para ver el mismo tema entre páginas
 */
function switchTheme() {
    // Seleccionar el switch de modo oscuro
    const switchDarkMode = document.getElementById("themeswitch").querySelector(".item");
    if (document.documentElement.getAttribute("data-theme") != "dark") {
        localStorage.setItem("theme", "dark");
        document.documentElement.setAttribute("data-theme", "dark");
        switchDarkMode.innerHTML = `dark_mode<span class="desc">Modo Claro</span>`;
        switchDarkMode.title = "Habilitar Modo Claro";
    } else {
        localStorage.setItem("theme", "light");
        document.documentElement.setAttribute("data-theme", "light");
        switchDarkMode.innerHTML = `light_mode<span class="desc">Modo Oscuro</span>`;
        switchDarkMode.title = "Habilitar Modo Oscuro";
    }
}

/**
 * Verificar si el usuario tiene activo el modo oscuro
 */
function detectColorScheme() {
    let theme = "light"; // Modo Claro por defecto

    // Se utiliza localStorage para sobreescribir los ajustes del SO
    if (localStorage.getItem("theme")) {
        if (localStorage.getItem("theme") == "dark") {
            theme = "dark";
        }
    } else if (!window.matchMedia) {
        // Metodo matchMedia no soportado
        return false;
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        // El tema del SO es oscuro
        theme = "dark";
    }

    // Se prefiere el tema oscuro, establecer el documento con [data-theme=dark]
    if (theme == "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
    }
}

/**
 * Carga las funcionalidades de todos los componentes de Material
 *
 * - Ripple en clickables
 * - Abrir y cerrar acordeones
 * - Activar-desactivar filter chips
 * - Funciones de la barra de busqueda
 */
function loadComponents() {
    // Handler para Clicks
    document.addEventListener(
        "click",
        event => {
            // Guardar el elemento objetivo
            const trg = event.target;

            // Elemento Accordion
            if (trg.closest(".accordion-title")) {
                let accordion = trg.closest(".accordion");
                if (!accordion) accordion = trg.closest(".cardaccordion");

                accordion.classList.toggle("open");
            }

            // Elemento Search Bar
            if (trg.closest(".searcharea")) {
                // Capturar Area de Texto
                const searchArea = trg.closest(".searcharea");

                // Boton para limpiar
                if (trg.closest("#cleartext")) {
                    // Borrar texto del cuadro de busqueda
                    const searchField = searchArea.querySelector(".searchfield");
                    if (searchField) searchField.value = "";

                    // Ocultar el boton
                    trg.closest("#cleartext").classList.add("hidden");

                    const searchSug = searchArea.querySelector(".searchsuggestions");
                    if (searchSug) {
                        // Eliminar Sugerencias
                        searchSug.innerHTML = "";
                        // Ocultar las sugerencias
                        searchSug.classList.remove("show");
                    }
                }
            }

            // Visibilidad de contraseñas
            if (trg.closest("#showpassword")) {
                // Obtener el input
                const passBtn = trg.closest("#showpassword");
                const inputField = passBtn.parentElement.querySelector("input");

                // Si es password, poner text y cambiar el icono
                if (inputField.type == "password") {
                    inputField.type = "text";
                    passBtn.title = "Ocultar Contraseña";
                    passBtn.innerHTML = "visibility_off";
                } else {
                    inputField.type = "password";
                    passBtn.title = "Mostrar Contraseña";
                    passBtn.innerHTML = "visibility";
                }
                // Si es text, pones password y cambiar el icono
            }

            // Visibilidad de contraseñas
            if (trg.closest("#shareButton")) {
                // URL to share
                var urlToShare = window.location.href;

                // Check if the browser supports the Web Share API
                if (navigator.share) {
                    navigator
                        .share({
                            title: document.title,
                            text: "Mira lo que encontré:",
                            url: urlToShare,
                        })
                        .then(() => {
                            console.log("Shared successfully");
                        })
                        .catch(error => {
                            console.error("Error sharing:", error);
                        });
                } else {
                    // Fallback for browsers that do not support Web Share API

                    // Create a temporary element to hold the text
                    const textArea = document.createElement("textarea");
                    textArea.value = urlToShare;

                    // Append the element to the document
                    document.body.appendChild(textArea);

                    // Select and copy the text
                    textArea.select();
                    document.execCommand("copy");

                    // Remove the temporary element
                    document.body.removeChild(textArea);

                    alert(
                        `La opción de compartir no está admitida por el explorador. Se ha copiado el enlace ${urlToShare} al portapapeles`
                    );
                }
            }

            if (trg.closest('[data-mdpg-dismiss="modal"]')) {
                const button = trg.closest('[data-mdpg-dismiss="modal"]');
                const modalDialog = button.closest(".modal-dialog");

                if (!modalDialog) return;

                const modalContainer = modalDialog.closest(".modal");

                modalDialog.classList.remove("show");
                if (modalContainer) modalContainer.classList.remove("show");
            }

            if (trg.closest("[data-mdpg-toggle]")) {
                const toggler = trg.closest("[data-mdpg-toggle]");
                const toggleClass = toggler.dataset.mdpgToggle;

                if (!toggler.dataset.mdpgTarget) return;

                const target = document.querySelector(toggler.dataset.mdpgTarget);

                target.classList.toggle(toggleClass);
            }
        },
        true
    );

    // Mousedown
    document.addEventListener(
        "mousedown",
        event => {
            const trg = event.target;
            if (trg.closest('[class*="button-"], .listitem, .toolbar .button, .Chip, .accordion-title')) {
                const w = trg.offsetWidth;
                const ripple = document.createElement("span");
                ripple.className = "ripple";
                ripple.style.left = event.layerX + "px";
                ripple.style.top = event.layerY + "px";
                ripple.style.setProperty("--scale", w);

                trg.appendChild(ripple);

                setTimeout(() => {
                    if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
                }, 500);
            }
        },
        true
    );

    document.addEventListener("focusin", event => {
        const trg = event.target;
        if (trg.matches("input.searchfield")) {
            const searchArea = event.target.closest(".searcharea");
            // Mostrar las sugerencias
            if (searchArea) {
                const searchSug = searchArea.querySelector(".searchsuggestions");
                if (searchSug && searchSug.childElementCount > 0) {
                    searchSug.classList.add("show");
                }
            }
        } else if (trg.matches(`[class*="textfield-"] input, [class*="textfield-"] textarea, [class*="textfield-"] select`)) {
            verifyValidity(trg);
        }
    });

    document.addEventListener("focusout", event => {
        // Guardar el elemento objetivo
        const trg = event.target;

        if (trg.matches(`[class*="textfield-"] input, [class*="textfield-"] textarea, [class*="textfield-"] select`)) {
            const parent = trg.closest(`[class*="textfield-"]`);
            if (trg.value.length > 0) {
                // Trim
                trg.value = trg.value.trim();

                if (trg.dataset.mdpgInput) {
                    const inputType = trg.dataset.mdpgInput;

                    // If its MONEY, format the 2 decimals
                    if (inputType == "money") {
                        // The current value
                        const number = +trg.value;

                        // Convert the number to a formatted currency string
                        const formattedCurrency = number.toFixed(2);

                        // Set the value inside the input field
                        trg.value = formattedCurrency;
                    }
                }

                if (!trg.validity.valid) {
                    if (parent) parent.classList.add("open");
                    verifyValidity(trg);
                }
            } else {
                if (parent && !parent.classList.contains("openlock")) parent.classList.remove("open");
            }
        } else if (trg.matches(".searchfield")) {
            const searchArea = trg.closest(".searcharea");
            // Ocultar las sugerencias
            if (searchArea) {
                const searchSug = searchArea.querySelector(".searchsuggestions.show");
                if (searchSug) {
                    setTimeout(() => {
                        searchSug.classList.remove("show");
                    }, 200);
                }
            }
        }
    });

    // Handler para inputs
    document.addEventListener("input", event => {
        if (event.target.matches(`[class*="textfield-"] input, [class*="textfield-"] textarea, [class*="textfield-"] select`)) {
            const field = event.target;
            const parent = field.closest(`[class*="textfield-"]`);

            // if (field.value.length > 0) field.value = field.value.replace(/^\s+|\s{2,}/g, "");

            verifyValidity(field);
            if (parent) parent.classList.add("open");

            // Verificar maxlength en input type="number"
            if (field.type == "number" && !field.dataset.mdpgInput) {
                let maxLength = field.getAttribute("maxlength");

                if (maxLength) {
                    maxLength = +maxLength;
                    event.preventDefault();
                    field.value = field.value.slice(0, maxLength);
                }
            }

            if (field.matches(`[class*="textfield-"] input, [class*="textfield-"] textarea`)) {
                // Check if field has a counter
                const counter = parent.querySelector(".counter");

                if (counter) {
                    // Counter exists

                    // Get maxlength
                    const maxLength = field.maxLength;

                    // Get input length
                    const inputLength = field.value.length;

                    counter.innerHTML = `${inputLength}/${maxLength}`;
                }
                verifyValidity(field);
                if (parent) parent.classList.add("open");

                // Verificar maxlength en input type="number"
                if (field.type == "number" && !field.dataset.mdpgInput) {
                    let maxLength = field.getAttribute("maxlength");

                    if (maxLength) {
                        maxLength = +maxLength;
                        event.preventDefault();
                        field.value = field.value.slice(0, maxLength);
                    }
                }
            }
        } else if (event.target.matches(`.searchfield`)) {
            const field = event.target;

            const clearBtn = field.parentElement.querySelector("#cleartext");
            if (clearBtn) setClass(field.value.length == 0, clearBtn, "hidden");
        }
    });

    //* Carousels
    // Get all carousels
    const carousels = document.querySelectorAll(".carousel");
    // Carousel loop
    carousels.forEach(car => {
        new materialpg.Carousel(car);
    });

    //* Slideshows
    // Get all slideshows
    const slideshows = document.querySelectorAll(".slideshow");
    // Slideshow loop
    slideshows.forEach(slide => {
        new materialpg.Slideshow(slide);
    });

    //* ProductViews
    // Get all thumbnails
    const thumbnails = document.querySelectorAll(".thumbnail-container[data-mdpg-prodview]");
    // Thumbnail loop
    thumbnails.forEach(thumbnail => {
        // Get Target ID
        const targetID = thumbnail.dataset.mdpgProdview;

        // If doesn't exist, create new object
        materialpg.productViews[targetID] = new materialpg.ProductView(thumbnail);
    });
}

/**
 *
 * @param {HTMLInputElement} textInput
 */
function verifyValidity(textInput) {
    const textField = textInput.closest(`[class*="textfield-"]`);
    let isValid = textInput.validity.valid;

    // Establecer Error
    if (textInput.value.length == 0) {
        setTextFieldError(textInput, null);
        return;
    }

    // Verificación de Contraseñas
    if (textInput.name == "password-confirm") {
        const passForm = textField.closest("form");
        if (passForm) {
            const pass2Match = passForm.querySelector('input[name="new-password"]');
            if (pass2Match) {
                isValid = pass2Match.value == textInput.value;
                textInput.setCustomValidity(isValid ? "" : "Las contraseñas no coinciden");
            }
        }
    }

    // Select placeholder
    const placeholder = textField.querySelector(".placeholder");
    const err = placeholder && placeholder.hasAttribute("data-error") ? placeholder.dataset.error : null;
    setTextFieldError(textInput, isValid ? null : err);
}

/**
 * Sets the error of a textfield
 *
 * @param {HTMLInputElement} textInput The desired text input
 * @param {string | null} errorMsg The error to display, if its `undefined`, it clears the error
 */
function setTextFieldError(textInput, errorMsg = null) {
    const isValid = errorMsg == null;
    const textField = textInput.closest(`[class*="textfield-"]`);

    setClass(!isValid, textField, "error");

    // Select placeholder
    const placeholder = textField.querySelector(".placeholder");

    if (placeholder) {
        if (isValid || textInput.value.length == 0) {
            if (placeholder.hasAttribute("data-normal")) {
                // Poner texto normal en el placeholder
                placeholder.innerHTML = placeholder.dataset.normal;
            } else if (placeholder.hasAttribute("data-error") == placeholder.innerHTML) {
                // No poner nada (no habia texto antes del error)
                placeholder.innerHTML = "";
            }
        } else {
            // Existe mensaje de error
            if (!placeholder.dataset.normal && errorMsg != placeholder.innerHTML) {
                // Tiene texto, guardar en data-normal
                placeholder.dataset.normal = placeholder.innerHTML;
            }
            // Poner texto de error en el placeholder
            placeholder.innerHTML = errorMsg;
        }
    }
}

// Define a callback function to handle the intersection
function handleIntersection(entries, observer) {
    entries.forEach(entry => {
        // Get the value of the data-anim attribute
        if (entry.isIntersecting) {
            entry.target.classList.remove("anim-none");
            entry.target.style.opacity = 1;

            const customClass = entry.target.dataset.mdpgAnim;
            if (customClass) {
                // When the element becomes visible, add the specified class
                entry.target.classList.add(customClass);
                // Unobserve the element to stop further callbacks
            }
            observer.unobserve(entry.target);
        }
    });
}

/**
 * Adds or removes a class (or class array) to a specific element, depending on a specific condition
 *
 * @param {boolean} condition - The condition which defines if the class ir added or removed
 * @param {Element} element - The element affected by the class
 * @param {(string|string[])} class2add - The class, or class array to be added or removed to the element
 */
function setClass(condition, element, class2add) {
    // Check if element exists
    if (element) {
        // Check if the condition is true or false
        if (condition) {
            if (typeof class2add === "string") {
                element.classList.add(class2add);
            } else if (Array.isArray(class2add)) {
                class2add.forEach(oneClass => {
                    element.classList.add(oneClass);
                });
            }
        } else {
            if (typeof class2add === "string") {
                element.classList.remove(class2add);
            } else if (Array.isArray(class2add)) {
                class2add.forEach(oneClass => {
                    element.classList.remove(oneClass);
                });
            }
        }
    }
}

function isPath(str) {
    // Define a regular expression for a simple file path (adjust as needed)
    var pathRegex = /^(\/?[a-zA-Z0-9_-]+)+\/?$/;

    // Test the string against the regular expression
    return pathRegex.test(str);
}

/**
 * Shows a snackbar with personalized content
 *
 * @param {string} content - The snackbar Message
 * @param {number} timeout - The timeout for the snackbar to disappear. Default is `5000`
 */
function showSnackbar(content, timeout = 5000) {
    // Create container reference
    let notification = document.querySelector(".notification");

    // If there is no container, create one
    if (!notification) {
        const notifContainer = document.createElement("div");
        notifContainer.classList.add("notification");
        document.body.append(notifContainer);
        notification = notifContainer;
    }

    // Create the snackbar
    const snackbar = document.createElement("div");
    snackbar.classList.add("snackbar");
    // Create the content
    const snackContent = document.createElement("div");
    // Create the text
    const snackText = document.createElement("span");
    snackText.innerHTML = content;
    // Create the button
    const snackButton = document.createElement("div");
    snackButton.classList.add("button-text");
    snackButton.innerHTML = "Cerrar";
    snackButton.addEventListener("click", e => {
        snackbar.classList.add("fade");
        setTimeout(() => {
            snackbar.remove();
        }, 500);
    });
    // Append text and button
    snackContent.append(snackText);
    snackContent.append(snackButton);
    // Add content to snackbar
    snackbar.append(snackContent);

    // Add the snackbar to notification area
    notification.append(snackbar);

    if (timeout > 0) {
        setTimeout(() => {
            snackbar.classList.add("fade");
            setTimeout(() => {
                snackbar.remove();
            }, 2000);
        }, timeout);
    }
}

var materialpg = {};

materialpg.Carousel = class {
    constructor(element, timer = 5000) {
        this.domElement = element;
        this.children = element.querySelectorAll(".carouselimg");
        this.currentItem = 0;
        this.timer = this.domElement.dataset.mdpgTime ? this.domElement.dataset.mdpgTime : timer;
        this.showItem(0);
    }

    showItem(num) {
        if (num >= this.children.length) num = 0;
        if (num < 0) num = this.children.length - 1;
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].classList.remove("large");
            this.children[i].classList.remove("medium");
            this.children[i].classList.remove("small");
        }

        this.children[num].classList.add("large");
        if (this.children[num - 1]) this.children[num - 1].classList.add("medium");
        if (this.children[num + 1]) this.children[num + 1].classList.add("medium");
        if (this.children[num - 2]) this.children[num - 2].classList.add("small");
        if (this.children[num + 2]) this.children[num + 2].classList.add("small");

        this.currentItem = num;
        setTimeout(() => this.nextItem(), this.timer);
    }

    nextItem() {
        this.showItem(this.currentItem + 1);
    }
};

materialpg.Slideshow = class {
    constructor(element, timer = 5000) {
        this.domElement = element;
        this.children = this.domElement.querySelectorAll(".slide");
        this.currentItem = 0;
        this.timer = this.domElement.dataset.mdpgTime ? this.domElement.dataset.mdpgTime : timer;
        this.showSlide(0);
    }

    showSlide(num) {
        if (num >= this.children.length) num = 0;
        if (num < 0) num = this.children.length - 1;
        this.children.forEach(child => child.classList.remove("active"));

        this.children[num].classList.add("active");

        this.currentItem = num;
        setTimeout(() => this.nextSlide(), this.timer);
    }

    nextSlide() {
        this.showSlide(this.currentItem + 1);
    }
};

/**
 * The list of Product Views
 * @type {materialpg.ProductView[]}
 */
materialpg.productViews = {};

materialpg.ProductView = class {
    /**
     *
     * @param {HTMLElement} domElement The element to construct the object with
     */
    constructor(domElement) {
        /** @type {string} The ID of the target img */
        this.targetID = domElement.dataset.mdpgProdview;
        /** @type {HTMLElement} The Element of the thumbnail containers */
        this.thumbnailContainer = domElement;
        /** @type {HTMLElement[]} The list of thumbnail elements */
        this.thumbnails = [];

        const initialThumbs = domElement.querySelectorAll(".thumbnail");
        // Add first thumbnails
        initialThumbs.forEach(thumbnail => {
            this.addThumbnail(thumbnail);
        });
    }

    /**
     * Adds a listener to the thumbnail, so it activates it on click
     *
     * @param {HTMLElement} thumbnail The thumbnail to add the listener to
     */
    addClick(thumbnail) {
        thumbnail.addEventListener("click", this.activateThumb.bind(this, thumbnail));
    }

    /**
     * Compares two containers that contain images, and verifies if the image sources are the same
     *
     * @param {HTMLElement} obj1 The first container to compare
     * @param {HTMLElement} obj2 The second container to compare
     *
     * @returns `true` if the sources are the same, `false` otherwise
     */
    static areImagesEqual(obj1, obj2) {
        return obj1.querySelector("img").src == obj2.querySelector("img").src;
    }

    /**
     * Activates the thumbnail, setting the target image source the same as the thumbnail
     *
     * @param {HTMLElement} element The thumbnail container to activate
     */
    activateThumb(element) {
        // Get target element
        const targetElement = document.querySelector(this.targetID);

        // Get thumbnails path
        const newPath = element.querySelector("img").src;

        // Assign new path of target
        targetElement.src = newPath;

        // Show visual cue
        this.thumbnails.forEach(thumb => {
            setClass(materialpg.ProductView.areImagesEqual(element, thumb), thumb, "bg-primary");
        });
    }

    /**
     * Gets the selected element from the thumbnail list
     *
     * @returns The `element` which is selected, `undefined` if nothing is selected or there are no thumbnails
     */
    getSelectedElement() {
        let element;

        const elementFound = this.thumbnails.some(thumb => {
            // Check the item which is selected
            if (thumb.classList.contains("bg-primary")) {
                // Save element
                element = thumb;
                // Break the cycle
                return true;
            }
        });

        return elementFound ? element : undefined;
    }

    /**
     * Adds a container to the thumbnail list
     *
     * @param {HTMLElement} domElement The element to add to the thumbnail list
     *
     * @returns {boolean} `true` if the thumbnail was added, `false` otherwise
     */
    addThumbnail(domElement) {
        if (!this.thumbnails.some(obj => materialpg.ProductView.areImagesEqual(obj, domElement))) {
            // Add thumbnail to array
            this.thumbnails.push(domElement);
            // Add the click listener
            this.addClick(domElement);
            if (this.thumbnails.length == 1) {
                // The newly added thumbnail is the only one, activate it
                this.activateThumb(domElement);
            }
            return true;
        }
        return false;
    }

    /**
     * Removes the thumbnail from the list, and removes the container from the DOM
     *
     * @param {HTMLElement} domElement The element to remove from the view
     *
     * @returns {boolean | string} `true` if the thumbnail was removed, `false` otherwise
     */
    removeThumbnail(domElement) {
        // Create the target element variable
        const parent = domElement.parentElement;
        if (!parent) return false;
        let targetElement = Array.prototype.indexOf.call(parent.children, domElement);

        if (targetElement != -1) {
            if (this.thumbnails.length > 1) {
                // Check if the removed thumbnail is selected
                if (domElement.classList.contains("bg-primary")) {
                    // Activate previous thumbnail
                    if (targetElement == 0) this.activateThumb(this.thumbnails[1]);
                    else this.activateThumb(this.thumbnails[targetElement - 1]);
                }
            }
            // Element was found. Remove it
            this.thumbnails.splice(targetElement, 1);

            const imgPath = domElement.querySelector("img").src;
            const imgAlt = domElement.querySelector("img").alt;

            // Remove from DOM
            domElement.parentElement.removeChild(domElement);

            return [imgPath, imgAlt];
        }
        return false;
    }
};

materialpg.Modal = class {
    constructor(querySel, options = {}) {
        this.domElement = document.querySelector(querySel);
        if (!this.domElement) throw new Error("Modal element not found");

        this.domDialog = this.domElement.querySelector(".modal-dialog");
        if (!this.domDialog) throw new Error("Modal dialog not found");

        this.evtOptions = {
            bubbles: false, // Whether the event bubbles up through the DOM tree
            cancelable: false, // Whether the event can be canceled
        };
        // Includes a modal-backdrop element. Alternatively, specify static for a backdrop which doesn’t close the modal when clicked.
        this.backdrop = options.backdrop || true;
        // Puts the focus on the modal when initialized.
        this.focus = options.focus || true;
        // Closes the modal when escape key is pressed.
        this.keyboard = options.keyboard || true;

        this.isShown = this.domElement.classList.contains("show");

        if (this.backdrop) {
            this.domElement.classList.add("modal-backdrop");
        }

        this.domElement.addEventListener("click", event => {
            if (this.backdrop !== "static") this.hide();
        });
    }

    dispose() {
        this.domElement.remove();
    }

    getInstance() {
        return this.domElement;
    }

    show() {
        this.domElement.addEventListener(
            "animationend",
            event => {
                this.domElement.dispatchEvent(new Event("shown.mdpg.modal", this.evtOptions));
            },
            {once: true}
        );
        this.domElement.dispatchEvent(new Event("show.mdpg.modal", this.evtOptions));
        this.domElement.classList.add("show");
        this.domDialog.classList.add("show");
        this.isShown = true;

        document.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                if (this.keyboard) {
                    this.hide();
                }
            }
        });
    }

    hide() {
        this.domElement.addEventListener(
            "animationend",
            () => {
                this.domElement.dispatchEvent(new Event("hidden.mdpg.modal", this.evtOptions));
            },
            {once: true}
        );
        this.domElement.dispatchEvent(new Event("hide.mdpg.modal", this.evtOptions));
        this.domDialog.classList.remove("show");
        this.domElement.classList.remove("show");
        this.isShown = false;
    }

    toggle() {
        this.isShown ? this.hide() : this.show();
    }
};

materialpg.DataTable = class {
    /**
     * Main constructor
     *
     * @param {Element} domElement The DOM element of the <div> where the <table> and the pagination are
     * @param {string} page The page the object belongs to
     * @param {string} destination The URL to fetch the data from
     * @param {JSON} data The object for retrieving and displaying the columns, as follows:
     * {
     *      column: [htmlBefore, htmlAfter],
     * }
     */
    constructor(domElement, page, destination, data) {
        // Save DOM element
        this.domElement = domElement;
        // Save table tamplate data
        this.tableData = data;
        // Save API destination
        this.destination = destination;
        // Start total pages at 0
        this.totalPages = 0;
        // Create an empty array for data
        this.data = [];
        // Set the type of page for the API
        this.page = page;
        // Create an empty skeleton for options
        this.options = {
            search: {
                term: "",
                column: [],
            },
            sort: {
                column: "",
                direction: "",
            },
            limit: 0,
            page: 1,
        };

        // Create helpers object
        this.helpers = {};

        // Generate the helpers
        this.createHelpers();

        // Initialize the column sorters
        this.initSorters();

        // Get initial data
        this.getData();
    }

    createHelpers() {
        // Get table card
        this.tableDiv = this.domElement.querySelector(".table-card");

        //* Create loading div
        this.helpers.loading = document.createElement("div");
        this.helpers.loading.classList.add("card-elevated", "table-loading", "d-none");
        this.helpers.loading.innerHTML = `<div class="card-empty"><div class="spinner mb-4"></div><span>Cargando</span></div>`;

        //* Create error div
        this.helpers.error = document.createElement("div");
        this.helpers.error.classList.add("card-elevated", "table-error", "d-none");
        const errorContent = document.createElement("div");
        errorContent.classList.add("card-empty");
        errorContent.innerHTML = `<div class="icon">assignment_late</div><span>Oops! Ocurrió un error</span>`;
        // Create try again button
        const tryAgain = document.createElement("div");
        tryAgain.classList.add("button-outlined", "mt-4");
        tryAgain.innerHTML = "Intentar de nuevo";
        tryAgain.addEventListener("click", this.getData.bind(this));
        errorContent.append(tryAgain);
        this.helpers.error.append(errorContent);

        //* Create "No records found" div
        this.helpers.empty = document.createElement("div");
        this.helpers.empty.classList.add("card-elevated", "table-empty", "d-none");
        this.helpers.empty.innerHTML = `<div class="card-empty"><div class="icon">assignment_late</div><span>Oops! Ocurrió un error</span></div>`;

        this.domElement.append(this.helpers.loading);
        this.domElement.append(this.helpers.error);
        this.domElement.append(this.helpers.empty);
    }

    initSorters() {
        // Get the table sorters (if any)
        this.sorters = this.domElement.querySelectorAll(".table-sort[data-mdpg-column-sort]");

        // Assign click listeners to sorters
        this.sorters.forEach(sorter => {
            const clickables = sorter.querySelectorAll(".clickable");
            clickables.forEach(clickable => {
                if (clickable) clickable.addEventListener("click", this.tableSort.bind(this, clickable, sorter));
            });
        });
    }

    tableSort(clickable, sortColumn) {
        // Direction constants
        const direction = ["ASC", "DESC"];
        const directionIcon = ["arrow_upward", "arrow_downward"];

        // Get sorter column name
        const colSort = sortColumn.dataset.mdpgColumnSort;

        // Clear all column status
        this.sorters.forEach(sorter => {
            const clickables = sorter.querySelectorAll(".clickable");
            clickables.forEach(click => {
                const sortMarker = click.querySelector("[data-mdpg-sort-direction]");
                if (sortMarker && sorter != sortColumn) click.removeChild(sortMarker);
            });
        });

        // Get marker (if any)
        const sortMarker = clickable.querySelector("[data-mdpg-sort-direction]");

        // If column has no icon, create a 0 icon
        if (!sortMarker) {
            clickable.innerHTML += `<span class="icon" data-mdpg-sort-direction="0">${directionIcon[0]}</span>`;
            this.setSort(colSort, direction[0]);
        } else {
            // Direction variable
            let currentDirection = +sortMarker.dataset.mdpgSortDirection;
            // If column has a 0 icon, create a 1 icon
            if (currentDirection == 0) {
                sortMarker.dataset.mdpgSortDirection = 1;
                sortMarker.innerHTML = directionIcon[1];
                this.setSort(colSort, direction[1]);
            }
            // If column has a 1 icon, remove it
            else {
                clickable.removeChild(sortMarker);
                this.setSort("");
            }
        }
    }

    displayTable() {
        // Get element
        const tableElement = this.domElement.querySelector("tbody");
        // Clean element
        tableElement.innerHTML = "";

        // Check if the data is present
        if (this.response && this.response.data && this.response.data.records) {
            // Row Iteration
            this.response.data.records.forEach(row => {
                // Create Row element
                const newRow = document.createElement("tr");
                newRow.id = row["id"] || "";

                // Add columns for row
                for (const key in this.tableData) {
                    //* Generate row
                    // Get HTML before
                    let rowData = this.tableData[key][0];
                    // Get data
                    rowData += row[key] || this.tableData[key][2] || ``;
                    // Get HTML after
                    rowData += this.tableData[key][1];
                    // Add column to container
                    newRow.innerHTML += rowData;
                }

                // Add event listener (if not empty)
                if (this.rowCallback) {
                    newRow.addEventListener("click", () => {
                        this.rowCallback(newRow);
                    });
                }

                // Add Row to table body
                tableElement.append(newRow);

                // Check images on row load
                const images = tableElement.querySelectorAll("img");

                images.forEach(image => {
                    image.addEventListener("error", function () {
                        this.src = "/img/product/noimage.png";
                    });
                });
            });
        }

        this.genPagination();
    }

    /**
     * Sets the page to a specific number, and fetches the data
     *
     * @param {number} page The page to set
     */
    setPage(page) {
        // Only change the page if its valid
        if (this.options.page != page && page > 0 && page <= this.totalPages) {
            this.options.page = page;
            this.getData();
        }
    }

    /**
     * Sends to next page (if available), and fetches the data
     */
    nextPage() {
        if (this.options.page < this.totalPages) this.setPage(this.options.page + 1);
    }

    /**
     * Sends to previous page (if available), and fetches the data
     */
    previousPage() {
        if (this.options.page > 1) this.setPage(this.options.page - 1);
    }

    /**
     * Sets the sorting by column and direction, and fetches the data
     *
     * @param {string} column The name of the column to sort
     * @param {"ASC" | "DESC" | ""} direction The sorting direction
     */
    setSort(column, direction = "") {
        this.options.sort.column = column;
        this.options.sort.direction = direction;
        this.options.page = 1;

        this.getData();
    }

    /**
     * Saves the search
     *
     * @param {string} term The search term
     * @param {array} column The array of columns to search from
     */
    setSearch(term = "", column = []) {
        this.options.search.term = term;
        this.options.search.column = column;
        this.options.page = 1;

        this.getData();
    }

    genPagination(pageDisplayAmt = 5) {
        // Set total Pages
        this.totalPages = Math.ceil(+this.response.data.count / 25);

        // Search for the container
        let paginationContainer = this.domElement.querySelector(".pagination");

        // If no container was found, create one
        if (!paginationContainer) {
            paginationContainer = document.createElement("ul");
            paginationContainer.classList.add("pagination");
        }
        // The container was found, empty the div
        else {
            paginationContainer.innerHTML = "";
        }

        // Create the back button
        const prevButton = document.createElement("li");
        prevButton.classList.add("page-item");
        prevButton.innerHTML = `<span class="icon">chevron_left</span>`;
        if (this.options.page === 1) {
            prevButton.classList.add("disabled");
            prevButton.style.cursor = "default";
        } else {
            prevButton.addEventListener("click", this.previousPage.bind(this));
        }
        paginationContainer.append(prevButton);

        // Create the page numbers
        let pageStart = this.options.page;
        let pageEnd = this.totalPages;

        if (this.totalPages <= pageDisplayAmt) {
            pageStart = 1;
            if (pageEnd < pageStart) pageEnd = pageStart;
        } else {
            let halfDisp = pageDisplayAmt / 2;
            for (let k = 0; k < halfDisp; k++) {
                if (this.options.page - k > 0) pageStart--;
            }
            pageEnd = pageStart + pageDisplayAmt;
            if (pageEnd > this.totalPages) {
                pageEnd = this.totalPages;
                pageStart = pageEnd - pageDisplayAmt;
            }
            pageStart++;
        }

        for (let i = pageStart; i <= pageEnd; i++) {
            const button = document.createElement("li");
            button.classList.add("page-item");
            button.textContent = i;
            if (i === this.options.page) {
                button.classList.add("active");
                button.style.cursor = "default";
            } else {
                button.addEventListener("click", this.setPage.bind(this, i));
            }
            paginationContainer.append(button);
        }

        // Create the next page button
        const nextButton = document.createElement("li");
        nextButton.classList.add("page-item");
        nextButton.innerHTML = `<span class="icon">chevron_right</span>`;
        if (this.options.page === pageEnd) {
            nextButton.classList.add("disabled");
            nextButton.style.cursor = "default";
        } else {
            prevButton.addEventListener("click", this.nextPage.bind(this));
        }
        paginationContainer.append(nextButton);

        // Add the pagination to the container
        if (!this.domElement.querySelector(".pagination")) this.domElement.append(paginationContainer);
    }

    /**
     * Function to set the row click callback
     *
     * @param {function} callback The callback function that will be executed when the user clicks on each row
     */
    rowClick(callback) {
        // Get rows
        const rows = this.tableDiv.querySelectorAll("tbody tr");

        // Save callback
        this.rowCallback = callback;

        // Add callback to existing rows
        rows.forEach(row => {
            row.addEventListener("click", () => {
                this.rowCallback(row);
            });
        });
    }

    getData() {
        // Clean Table contents
        const contents = this.tableDiv.querySelector("tbody");
        const currentRows = contents.querySelectorAll("tr");
        currentRows.forEach(row => {
            contents.removeChild(row);
        });

        // Clean Pagination
        if (this.paginationDiv) {
            const paginationChild = this.paginationDiv.querySelector("ul");
            this.paginationDiv.removeChild(paginationChild);
        }

        // Show loading spinner
        this.helpers.error.classList.add("d-none");
        this.tableDiv.classList.add("d-none");
        this.helpers.loading.classList.remove("d-none");
        this.helpers.empty.classList.add("d-none");

        // Create Form Data
        const formData = new FormData();
        formData.append("page", this.page);
        formData.append("instruction", "read");
        formData.append("options", JSON.stringify(this.options));

        const fetchOptions = {
            method: "POST",
            body: formData,
        };

        // Get Data from DB
        fetch(this.destination, fetchOptions)
            .then(response => response.json())
            .then(json => {
                console.log(json);
                // Check if there's an error
                if (json.response === 3) {
                    this.helpers.error.classList.remove("d-none");
                    console.log(json.message);
                } else {
                    // Display Information
                    this.response = json;
                    this.data = this.response.data;
                    if (this.data.length == 0) {
                        // No records found
                        this.helpers.empty.classList.remove("d-none");
                    } else {
                        // Records were found
                        this.displayTable();
                        this.tableDiv.classList.remove("d-none");
                    }
                }
            })
            .catch(e => {
                console.log(e);
                this.helpers.error.classList.remove("d-none");
            })
            .finally(() => {
                this.helpers.loading.classList.add("d-none");
            });
    }
};

materialpg.PanelView = class {
    /**
     * Main constructor
     *
     * @param {Element} domElement The DOM element of the <div> where the panels are
     */
    constructor(domElement, circular = false) {
        // Save DOM element
        this.domElement = domElement;

        // Set circular property
        this.circular = circular;

        this.panels = this.domElement.querySelectorAll(".panel");

        if (this.panels.length == 0) return;

        if (!this.domElement.querySelector(".panel.show")) this.panels[0].classList.add("show");

        const shownPanel = Array.from(this.panels).indexOf(this.domElement.querySelector(".panel.show"));

        this.setPanel(shownPanel);
    }

    setPanel(idx) {
        if (idx < 0) {
            this.setPanel(0);
            return;
        }
        if (idx >= this.panels.length) {
            this.setPanel(this.panels.length);
            return;
        }

        this.currentPanel = idx;

        this.panels.forEach((panel, idx) => {
            panel.classList.remove("show");
            panel.classList.remove("before");
            panel.classList.remove("after");
            if (idx < this.currentPanel) panel.classList.add("before");
            if (idx > this.currentPanel) panel.classList.add("after");
        });

        this.panels[idx].classList.add("show");

        // Update container height
        this.updateContainerHeight();
    }

    nextPanel() {
        if (this.currentPanel < this.panels.length - 1) this.setPanel(this.currentPanel + 1);
        else if (this.circular) this.setPanel(0);
    }

    previousPanel() {
        if (this.currentPanel > 0) this.setPanel(this.currentPanel - 1);
        else if (this.circular) this.setPanel(this.panels.length - 1);
    }

    // Function to recalculate maximum height and update container
    updateContainerHeight() {
        const panelElement = this.panels[this.currentPanel];
        this.domElement.style.height = `${panelElement.offsetHeight + 4}px`;
    }

    // Function to recalculate maximum height and update container
    updateContainerMaxHeight() {
        const maxHeight = Math.max(...Array.from(this.panels).map(child => child.offsetHeight));
        this.domElement.style.height = `${maxHeight + 4}px`;
    }
};
