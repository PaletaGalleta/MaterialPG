/**
 *
 * File: materialpg.js
 * @description This file contains functions and methods which ensure the functionality of the MaterialPG framework
 * Author: @PaletaGalleta
 * Date: 04-08-2023
 */

document.addEventListener("DOMContentLoaded", initialize);

/**
 * Initializes the framework by loading components, detecting color scheme, and setting up event listeners.
 */
function initialize() {
    // Load Components
    loadComponents();

    // Detect Color Scheme
    detectColorScheme();

    // Listener for theme switch
    const themeSwitches = document.querySelectorAll("#themeswitch");
    themeSwitches.forEach(themeSwitch => themeSwitch.addEventListener("click", switchTheme));

    // Set theme switch icon if already in Dark Mode
    if (document.documentElement.getAttribute("data-theme") == "dark") {
        document.getElementById("themeswitch").querySelector(".item").innerHTML = `dark_mode<span class="desc">Light Mode</span>`;
    }

    // Create notification area
    const notification = document.createElement("div");
    notification.classList.add("notification");
    // Append to body
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

    // Dispatch event to signify MaterialPG initialization
    document.dispatchEvent(new Event("MaterialPGInitialized"));
}

/**
 * Switches between light and dark themes.
 */
function switchTheme() {
    // Select the dark mode switch
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
 * Detects the preferred color scheme and sets it accordingly.
 */
function detectColorScheme() {
    let theme = "light"; // Default to Light Mode

    // Use localStorage to override OS settings
    if (localStorage.getItem("theme")) {
        if (localStorage.getItem("theme") == "dark") {
            theme = "dark";
        }
    } else if (!window.matchMedia) {
        // matchMedia method not supported
        return false;
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        // OS theme is dark
        theme = "dark";
    }

    // Prefer dark theme, set document with [data-theme=dark]
    if (theme == "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
    }
}

/**
 * Initializes event listeners and sets up interactive components.
 */
function loadComponents() {
    // Handler for Clicks
    document.addEventListener(
        "click",
        /**
         * Event listener function for click events.
         * @param {MouseEvent} event - The click event object.
         */
        event => {
            // Save the target element
            const trg = event.target;

            // Accordion Element
            if (trg.closest(".accordion-title")) {
                let accordion = trg.closest(".accordion");
                if (!accordion) accordion = trg.closest(".cardaccordion");

                accordion.classList.toggle("open");
            }

            // Search Bar Element
            if (trg.closest(".searcharea")) {
                // Capture Text Area
                const searchArea = trg.closest(".searcharea");

                // Clear Button
                if (trg.closest("#cleartext")) {
                    // Clear search field
                    const searchField = searchArea.querySelector(".searchfield");
                    if (searchField) searchField.value = "";

                    // Hide the clear button
                    trg.closest("#cleartext").classList.add("hidden");

                    const searchSug = searchArea.querySelector(".searchsuggestions");
                    if (searchSug) {
                        // Clear Suggestions
                        searchSug.innerHTML = "";
                        // Hide Suggestions
                        searchSug.classList.remove("show");
                    }
                }
            }

            // Password Visibility
            if (trg.closest("#showpassword")) {
                // Get the input
                const passBtn = trg.closest("#showpassword");
                const inputField = passBtn.parentElement.querySelector("input");

                // Toggle visibility
                if (inputField.type == "password") {
                    inputField.type = "text";
                    passBtn.title = "Hide Password";
                    passBtn.innerHTML = "visibility_off";
                } else {
                    inputField.type = "password";
                    passBtn.title = "Show Password";
                    passBtn.innerHTML = "visibility";
                }
            }

            // Share Button
            if (trg.closest("#shareButton")) {
                // URL to share
                const urlToShare = window.location.href;

                // Check if the browser supports the Web Share API
                if (navigator.share) {
                    navigator
                        .share({
                            title: document.title,
                            text: "Check this out:",
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

                    alert(`Sharing is not supported by the browser. The link ${urlToShare} has been copied to the clipboard`);
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

    // Handler for Mousedown
    document.addEventListener(
        "mousedown",
        /**
         * Event listener function for mousedown events.
         * @param {MouseEvent} event - The mousedown event object.
         */
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

    // Handler for FocusIn
    document.addEventListener(
        "focusin",
        /**
         * Event listener function for focusin events.
         * @param {FocusEvent} event - The focusin event object.
         */
        event => {
            const trg = event.target;
            if (trg.matches("input.searchfield")) {
                const searchArea = event.target.closest(".searcharea");
                // Show suggestions
                if (searchArea) {
                    const searchSug = searchArea.querySelector(".searchsuggestions");
                    if (searchSug && searchSug.childElementCount > 0) {
                        searchSug.classList.add("show");
                    }
                }
            } else if (trg.matches(`[class*="textfield-"] input, [class*="textfield-"] textarea, [class*="textfield-"] select`)) {
                verifyValidity(trg);
            }
        }
    );

    // Handler for FocusOut
    document.addEventListener(
        "focusout",
        /**
         * Event listener function for focusout events.
         * @param {FocusEvent} event - The focusout event object.
         */
        event => {
            // Save the target element
            const trg = event.target;

            if (trg.matches(`[class*="textfield-"] input, [class*="textfield-"] textarea, [class*="textfield-"] select`)) {
                const parent = trg.closest(`[class*="textfield-"]`);
                if (trg.value.length > 0) {
                    // Trim
                    trg.value = trg.value.trim();

                    if (trg.dataset.mdpgInput) {
                        const inputType = trg.dataset.mdpgInput;

                        // If it's MONEY, format to 2 decimals
                        if (inputType == "money") {
                            // The current value
                            const number = +trg.value;

                            // Convert to a formatted currency string
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
                // Hide suggestions
                if (searchArea) {
                    const searchSug = searchArea.querySelector(".searchsuggestions.show");
                    if (searchSug) {
                        setTimeout(() => {
                            searchSug.classList.remove("show");
                        }, 200);
                    }
                }
            }
        }
    );

    // Handler for Inputs
    document.addEventListener(
        "input",
        /**
         * Event listener function for input events.
         * @param {InputEvent} event - The input event object.
         */
        event => {
            if (
                event.target.matches(`[class*="textfield-"] input, [class*="textfield-"] textarea, [class*="textfield-"] select`)
            ) {
                const field = event.target;
                const parent = field.closest(`[class*="textfield-"]`);

                verifyValidity(field);
                if (parent) parent.classList.add("open");

                // Check maxlength for input type="number"
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

                    // Check maxlength for input type="number"
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
        }
    );

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
 * Verifies the validity of a text input element and sets its error state if necessary.
 * @param {HTMLInputElement} textInput - The text input element to verify.
 */
function verifyValidity(textInput) {
    const textField = textInput.closest(`[class*="textfield-"]`);
    let isValid = textInput.validity.valid;

    // Set Error
    if (textInput.value.length == 0) {
        setTextFieldError(textInput, null);
        return;
    }

    // Password Verification
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
 * Sets the error state and message for a text field.
 * @param {HTMLInputElement} textInput - The text input element.
 * @param {string|null} [errorMsg=null] - The error message to display. If null, clears the error state.
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
                // Set normal text in the placeholder
                placeholder.innerHTML = placeholder.dataset.normal;
            } else if (placeholder.hasAttribute("data-error") == placeholder.innerHTML) {
                // Clear placeholder (no text before error)
                placeholder.innerHTML = "";
            }
        } else {
            // Error message exists
            if (!placeholder.dataset.normal && errorMsg != placeholder.innerHTML) {
                // Text exists, store it in data-normal
                placeholder.dataset.normal = placeholder.innerHTML;
            }
            // Set error message text in the placeholder
            placeholder.innerHTML = errorMsg;
        }
    }
}

/**
 * Handles intersection observer entries and applies animations to the intersecting elements.
 * @param {IntersectionObserverEntry[]} entries - An array of intersection observer entries.
 * @param {IntersectionObserver} observer - The intersection observer instance.
 */
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
                observer.unobserve(entry.target);
            }
        }
    });
}

/**
 * Sets or removes a CSS class from an HTML element based on a condition.
 * @param {boolean} condition - The condition to determine whether to add or remove the class.
 * @param {HTMLElement} element - The HTML element to which the class will be added or removed.
 * @param {string|string[]} class2add - The CSS class(es) to add or remove.
 */
function setClass(condition, element, class2add) {
    // Check if element exists
    if (element) {
        // Check if the condition is true or false
        if (condition) {
            // Check if class2add is a string or an array
            if (typeof class2add === "string") {
                element.classList.add(class2add);
            } else if (Array.isArray(class2add)) {
                class2add.forEach(oneClass => {
                    element.classList.add(oneClass);
                });
            }
        } else {
            // Check if class2add is a string or an array
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

/**
 * Checks if the provided string represents a valid file path.
 * @param {string} str - The string to be tested.
 * @returns {boolean} Returns true if the string represents a valid file path, otherwise false.
 */
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

function capitalize(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

var materialpg = {};

/**
 * Class representing a carousel.
 */
materialpg.Carousel = class {
    /**
     * Creates a carousel instance.
     * @param {HTMLElement} element - The HTML element representing the container of the carousel.
     * @param {number} [timer=5000] - The duration of each item transition in milliseconds. Defaults to 5000ms (5 seconds).
     */
    constructor(element, timer = 5000) {
        /**
         * The DOM element representing the container of the carousel.
         * @type {HTMLElement}
         */
        this.domElement = element;

        /**
         * The collection of child elements representing individual items in the carousel.
         * @type {NodeList}
         */
        this.children = element.querySelectorAll(".carouselimg");

        /**
         * The index of the currently displayed item.
         * @type {number}
         */
        this.currentItem = 0;

        /**
         * The duration of each item transition in milliseconds.
         * @type {number}
         */
        this.timer = this.domElement.dataset.mdpgTime ? this.domElement.dataset.mdpgTime : timer;

        // Initialize the carousel by displaying the first item
        this.showItem(0);
    }

    /**
     * Displays the item with the specified index.
     * @param {number} num - The index of the item to display.
     */
    showItem(num) {
        // Ensure the index is within the valid range
        if (num >= this.children.length) num = 0;
        if (num < 0) num = this.children.length - 1;

        // Remove all size-related classes from all items
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].classList.remove("large");
            this.children[i].classList.remove("medium");
            this.children[i].classList.remove("small");
        }

        // Add size-related classes to the current, previous, and next items
        this.children[num].classList.add("large");
        if (this.children[num - 1]) this.children[num - 1].classList.add("medium");
        if (this.children[num + 1]) this.children[num + 1].classList.add("medium");
        if (this.children[num - 2]) this.children[num - 2].classList.add("small");
        if (this.children[num + 2]) this.children[num + 2].classList.add("small");

        // Update the index of the current item
        this.currentItem = num;

        // Set a timeout to transition to the next item after the specified duration
        setTimeout(() => this.nextItem(), this.timer);
    }

    /**
     * Displays the next item in the carousel.
     */
    nextItem() {
        // Display the next item by calling showItem() with the index of the next item
        this.showItem(this.currentItem + 1);
    }
};

/**
 * Class representing a slideshow.
 */
materialpg.Slideshow = class {
    /**
     * Creates a slideshow instance.
     * @param {HTMLElement} element - The HTML element representing the container of the slideshow.
     * @param {number} [timer=5000] - The duration of each slide transition in milliseconds. Defaults to 5000ms (5 seconds).
     */
    constructor(element, timer = 5000) {
        /**
         * The DOM element representing the container of the slideshow.
         * @type {HTMLElement}
         */
        this.domElement = element;

        /**
         * The collection of child elements representing individual slides.
         * @type {NodeList}
         */
        this.children = this.domElement.querySelectorAll(".slide");

        /**
         * The index of the currently displayed slide.
         * @type {number}
         */
        this.currentItem = 0;

        /**
         * The duration of each slide transition in milliseconds.
         * @type {number}
         */
        this.timer = this.domElement.dataset.mdpgTime ? this.domElement.dataset.mdpgTime : timer;

        // Initialize the slideshow by displaying the first slide
        this.showSlide(0);
    }

    /**
     * Displays the slide with the specified index.
     * @param {number} num - The index of the slide to display.
     */
    showSlide(num) {
        // Ensure the index is within the valid range
        if (num >= this.children.length) num = 0;
        if (num < 0) num = this.children.length - 1;

        // Remove the "active" class from all slides
        this.children.forEach(child => child.classList.remove("active"));

        // Add the "active" class to the slide at the specified index
        this.children[num].classList.add("active");

        // Update the index of the current slide
        this.currentItem = num;

        // Set a timeout to transition to the next slide after the specified duration
        setTimeout(() => this.nextSlide(), this.timer);
    }

    /**
     * Displays the next slide in the slideshow.
     */
    nextSlide() {
        // Display the next slide by calling showSlide() with the index of the next slide
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

/**
 * Represents a modal dialog.
 * @class
 */
materialpg.Modal = class {
    /**
     * Creates an instance of Modal.
     * @constructor
     * @param {string} querySel - The CSS selector to find the modal element.
     * @param {Object} [options={}] - Optional configuration options.
     * @param {boolean} [options.backdrop=true] - Includes a modal-backdrop element. Alternatively, specify static for a backdrop which doesn’t close the modal when clicked.
     * @param {boolean} [options.focus=true] - Puts the focus on the modal when initialized.
     * @param {boolean} [options.keyboard=true] - Closes the modal when escape key is pressed.
     * @throws {Error} Throws an error if the modal element or dialog is not found.
     */
    constructor(querySel, options = {}) {
        this.domElement = document.querySelector(querySel);
        if (!this.domElement) throw new Error("Modal element not found");

        this.domDialog = this.domElement.querySelector(".modal-dialog");
        if (!this.domDialog) throw new Error("Modal dialog not found");

        /**
         * Event options for dispatching events.
         * @type {Object}
         * @property {boolean} bubbles - Whether the event bubbles up through the DOM tree.
         * @property {boolean} cancelable - Whether the event can be canceled.
         */
        this.evtOptions = {
            bubbles: false,
            cancelable: false,
        };

        this.backdrop = options.backdrop || true;
        this.focus = options.focus || true;
        this.keyboard = options.keyboard || true;

        this.isShown = this.domElement.classList.contains("show");

        if (this.backdrop) {
            this.domElement.classList.add("modal-backdrop");
        }

        this.domElement.addEventListener("click", event => {
            if (this.backdrop !== "static") this.hide();
        });
    }

    /**
     * Removes the modal element from the DOM.
     */
    dispose() {
        this.domElement.remove();
    }

    /**
     * Gets the DOM element of the modal.
     * @returns {HTMLElement} The modal DOM element.
     */
    getInstance() {
        return this.domElement;
    }

    /**
     * Shows the modal.
     */
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

    /**
     * Hides the modal.
     */
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

    /**
     * Toggles the visibility of the modal.
     */
    toggle() {
        this.isShown ? this.hide() : this.show();
    }
};

/**
 * Represents a data table with pagination functionality.
 * @class
 */
/**
 * DataTable class for handling table data and pagination.
 */
materialpg.DataTable = class {
    /**
     * Main constructor
     *
     * @param {Element} domElement The DOM element of the <div> where the <table> and the pagination are
     * @param {string} page The page the object belongs to
     * @param {string} destination The URL to fetch the data from
     * @param {function} displayCallback The callback function to display table rows
     */
    constructor(domElement, page, destination, displayCallback) {
        // Save DOM element
        this.domElement = domElement;
        // Save table template data
        this.displayCallback = displayCallback;
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

    /**
     * Creates helper elements for loading, error, and empty table.
     */
    createHelpers() {
        // Get table card
        this.tableDiv = this.domElement.querySelector(".table-card");

        //* Loading div
        let helperElement = this.domElement.querySelector(".table-loading");
        if (helperElement) this.helpers.loading = helperElement;
        else {
            this.helpers.loading = document.createElement("div");
            this.helpers.loading.classList.add("card-elevated", "table-loading", "d-none");
            this.helpers.loading.innerHTML = `<div class="card-empty"><div class="spinner mb-4"></div><span>Loading</span></div>`;

            this.domElement.append(this.helpers.loading);
        }

        //* Error div
        helperElement = this.domElement.querySelector(".table-error");
        if (helperElement) this.helpers.error = helperElement;
        else {
            this.helpers.error = document.createElement("div");
            this.helpers.error.classList.add("card-elevated", "table-error", "d-none");
            const errorContent = document.createElement("div");
            errorContent.classList.add("card-empty");
            errorContent.innerHTML = `<div class="icon">assignment_late</div><span>Oops! An error occurred</span>`;
            // Create try again button
            const tryAgain = document.createElement("div");
            tryAgain.classList.add("button-outlined", "mt-4");
            tryAgain.innerHTML = "Try again";
            tryAgain.addEventListener("click", this.getData.bind(this));
            errorContent.append(tryAgain);
            this.helpers.error.append(errorContent);

            this.domElement.append(this.helpers.error);
        }

        //* Create "No records found" div
        helperElement = this.domElement.querySelector(".table-empty");
        if (helperElement) this.helpers.empty = helperElement;
        else {
            this.helpers.empty = document.createElement("div");
            this.helpers.empty.classList.add("card-elevated", "table-empty", "d-none");
            this.helpers.empty.innerHTML = `<div class="card-empty"><div class="icon">assignment</div><span>No Records</span></div>`;

            this.domElement.append(this.helpers.empty);
        }
    }

    /**
     * Initializes column sorters and adds click listeners.
     */
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

    /**
     * Handles table column sorting.
     *
     * @param {Element} clickable The clickable element triggering the sort
     * @param {Element} sortColumn The column to be sorted
     */
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

    /**
     * Displays table rows and handles pagination.
     */
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

                //* Generate row
                const rowData = this.displayCallback(row);
                newRow.innerHTML += rowData;

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
     * Sets the current page number and fetches data.
     *
     * @param {number} page The page number to set
     */
    setPage(page) {
        // Only change the page if it's valid
        if (this.options.page != page && page > 0 && page <= this.totalPages) {
            this.options.page = page;
            this.getData();
        }
    }

    /**
     * Moves to the next page and fetches data.
     */
    nextPage() {
        if (this.options.page < this.totalPages) this.setPage(this.options.page + 1);
    }

    /**
     * Moves to the previous page and fetches data.
     */
    previousPage() {
        if (this.options.page > 1) this.setPage(this.options.page - 1);
    }

    /**
     * Sets the sorting column and direction, then fetches data.
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
     * Sets the search term and columns to search from, then fetches data.
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

    /**
     * Generates pagination UI.
     *
     * @param {number} pageDisplayAmt The amount of pages to display
     */
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
     * Sets the row click callback function.
     *
     * @param {function} callback The callback function to execute when a row is clicked
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

    /**
     * Sets the callback function for displaying table rows.
     *
     * @param {function} callback The callback function to display table rows
     */
    onDisplayTable(callback) {
        // Save callback
        this.displayCallback = callback;
    }

    /**
     * Fetches data from the server and updates the table accordingly.
     *
     * @param {function} callback The callback function after getting the data
     */
    getData(callback) {
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
                    if (this.data.count == 0) {
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
                if (callback) {
                    this.fetchCallback = callback;
                    this.fetchCallback();
                }
            });
    }
};

/**
 * Represents a panel view with navigation functionality.
 * @class
 */
materialpg.PanelView = class {
    /**
     * Creates an instance of PanelView.
     * @constructor
     * @param {Element} domElement - The DOM element of the <div> where the panels are.
     * @param {Object} [config={}] - Optional configuration settings.
     * @param {boolean} [config.circular=false] - Indicates whether the panel navigation is circular.
     * @param {boolean} [config.navigation=false] - Indicates whether navigation controls are enabled.
     */
    constructor(domElement, config = {}) {
        // Save DOM element
        this.domElement = domElement;

        // Set circular property
        this.isCircular = config.circular || false;
        this.hasNavigation = config.navigation || false;

        this.panels = this.domElement.querySelectorAll(".panel");
        this.prevPanelStack = [];
        this.nextPanelStack = [];

        if (this.panels.length == 0) return;

        this.currentPanelIdx = -1;
        this.setPanel(0);

        // Bind this object to event handlers
        this.handlePopState = this.handlePopState.bind(this);

        // Listen for the popstate event
        window.addEventListener("popstate", this.handlePopState);
    }

    /**
     * Handles the popstate event.
     * @param {Event} event - The popstate event object.
     */
    handlePopState(event) {
        // Check if state exists and it has the panel index
        if (event.state && typeof event.state.panelIndex === "number") {
            // Set the panel to the previous state's panel index
            this.showPanel(event.state.panelIndex);
            console.log(`Retrieving ${event.state.panelIndex}`);
        }
    }

    /**
     * Sets the current panel index.
     * @param {number} idx - The index of the panel to set.
     */
    setPanel(idx) {
        // Check if it's more or less than the current index
        if (idx < this.currentPanelIdx) {
            // Previous panel
            if (!this.hasNavigation) {
                if (idx >= 0) this.showPanel(idx);
                else if (this.isCircular) this.showPanel(this.panels.length - 1);
            } else {
                if (idx >= 0) {
                    // Pop current state from the stack before changing panel
                    history.back();
                }
            }
        } else if (idx > this.currentPanelIdx) {
            // Next panel
            if (!this.hasNavigation) {
                if (idx < this.panels.length) this.showPanel(idx);
                else if (this.isCircular) this.showPanel(0);
            } else {
                if (idx < this.panels.length) {
                    // Add current panel to the stack
                    this.prevPanelStack.push(this.currentPanelIdx);

                    // Save current state before changing panel, if nav is enabled
                    history.pushState({panelIndex: idx}, "", window.location.href);

                    console.log(`Adding ${this.currentPanelIdx}`);

                    this.showPanel(idx);
                }
            }
        }
    }

    /**
     * Shows the panel at the specified index.
     * @param {number} idx - The index of the panel to show.
     */
    showPanel(idx) {
        if (idx < 0) {
            this.showPanel(0);
            return;
        }
        if (idx >= this.panels.length) {
            this.showPanel(this.panels.length - 1);
            return;
        }

        this.currentPanelIdx = idx;

        this.panels.forEach((panel, idx) => {
            panel.classList.remove("show");
            panel.classList.remove("before");
            panel.classList.remove("after");
            if (idx < this.currentPanelIdx) panel.classList.add("before");
            if (idx > this.currentPanelIdx) panel.classList.add("after");
        });

        this.panels[idx].classList.add("show");

        // Update container height
        this.updateContainerHeight();
    }

    /**
     * Switches to the next panel.
     */
    nextPanel() {
        this.setPanel(this.currentPanelIdx + 1);
    }

    /**
     * Switches to the previous panel.
     */
    previousPanel() {
        this.setPanel(this.currentPanelIdx - 1);
    }

    /**
     * Recalculates the maximum height and updates the container.
     */
    updateContainerHeight() {
        const panelElement = this.panels[this.currentPanelIdx];
        this.domElement.style.height = `${panelElement.offsetHeight + 4}px`;
    }

    /**
     * Recalculates the maximum height and updates the container.
     */
    updateContainerMaxHeight() {
        const maxHeight = Math.max(...Array.from(this.panels).map(child => child.offsetHeight));
        this.domElement.style.height = `${maxHeight + 4}px`;
    }

    /**
     * Cleans up event listeners when the object is destroyed.
     */
    destroy() {
        window.removeEventListener("popstate", this.handlePopState);
    }
};
