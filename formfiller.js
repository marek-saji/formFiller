window.___formFiller = (function (document, undefined) {
    
    // public methods
    var show,
        hide,
        ready,
        fillForm,
        storeForm,
        restoreForm;
        
    // private methods
    var _getFormIdent,
        _afterChange;
    
    // helpers
    var _forEach = Array.prototype.forEach;
    
    // private properties
    var _i = 0;
        
        
    /**
     * Show the UI
     */
     show = function () {
        var forms = {},
            el,
            wrapper,
            context;
            
        ___formFiller.hide();
        
        context = document.createElement('ol');
        context.id = "___formFillerUI";
        context.setAttribute("style",  "text-align: left; font-size: 1rem; position: fixed; top:1em; left: 1em; right: 1em; padding: 1em; background-color: white;");
        document.body.appendChild(context);
            
        _forEach.call(document.querySelectorAll("form"), function (form) {
            var ident = _getFormIdent(form);
            
            wrapper = document.createElement('li');
            context.appendChild(wrapper);
            
            ["fill", "store", "restore"].forEach(function (action) {
                el = document.createElement('button');
                el.innerText = action;
                if ("restore" === action && !localStorage.getItem(_getFormStorageKey(form))) {
                    el.disabled = true;
                }
                wrapper.appendChild(el);
                el.addEventListener("click", function () {
                    ___formFiller[action + "Form"](form);
                    ___formFiller.hide();
                }, true);
            });
            
            wrapper.appendChild(document.createTextNode(ident));
        });
        
     };
     
     
     /**
      * Hide the UI
      */
    hide = function () {
        var context;
        context = document.getElementById("___formFillerUI");
        context && context.remove();
    };
    
    
    /**
     * Ready callback.
     */
    ready = function () {
        if (typeof window.___formFillerReadyCallback === "function") {
            window.___formFillerReadyCallback();
        }
    };
    
    
    /**
     * Fill form with garbage data
     * @param {HTMLFormElement} form
     */
    fillForm = function (form) {
        // text inputs
        _forEach.call(form.querySelectorAll("input:not([type=submit]):not([type=file]):not([type=checkbox]):not([type=radio]), textarea"), function (element) {
            var previousValue = element.value,
                newValue,
                is = element.classList.contains.bind(element.classList),
                label;
            _i++;
            // TODO massive if-else sucks.
            if ("" === previousValue) {
                if ("date" === element.type) {
                    // TODO
                } else if ("number" === element.type) {
                    newValue = _i; // TODO what about decimal part?
                } else if (is("type_Float") || is("type_Price") || is("type_PriceWithGross")) { // TODO don't use classes
                    newValue = _i + 0.42;
                } else if ("email" === element.type) {
                    newValue = "test" + _i + "@example.com";
                } else {
                    label = form.querySelector("label[for=" + element.name + "]");
                    newValue = "test ☆ " + (label ? label.textContent : _i);
                }
                
                if (newValue !== previousValue) {
                    element.value = newValue;
                    _afterChange(element);
                }
            }
        });

        // checkboxes
        _forEach.call(form.querySelectorAll("input[type=checkbox]"), function (element) {
            // check ALL THE checkboxes
            element.checked = true;
            _afterChange(element);
        });

        // radio
        _forEach.call(form.querySelectorAll("input[type=radio]"), function (element) {
            // select only if first radio of that name in it's form
            if (element === form.querySelector("[type=radio][name=" + element.name + "]")) {
                element.checked = true;
                _afterChange(element);
            }
        });

        // <select>
        _forEach.call(form.querySelectorAll("select"), function (element) {
            var options = element.children;
            // select 2nd value as first may be something like "Choose"
            if (1 < options.length && options[0].selected) {
                options[1].selected = true;
                _afterChange(element);
            }
        });
    };
    
    
    /**
     * Save form values for future
     * @param {HTMLFormElement} form
     */
    storeForm = function (form) {
        var storageKey = _getFormStorageKey(form),
            values = {};
        _forEach.call(form.querySelectorAll("select, input:not([type=submit]):not([type=file]):not([type=checkbox]):not([type=radio]), textarea"), function (element) {
            values[element.name] = element.value;
        });
        _forEach.call(form.querySelectorAll("input[type=checkbox]"), function (element) {
            values[element.name] = element.checked;
        });
        _forEach.call(form.querySelectorAll("input[type=radio]"), function (element) {
            if (element.checked) {
                values[element.name] = element.value;
            }
        });
        localStorage.setItem(storageKey, JSON.stringify(values));
    };
    
    
    /**
     * Restore previously saved form values
     * @param {HTMLFormElement} form
     */
    restoreForm = function (form) {
        var storageKey = _getFormStorageKey(form),
            values = localStorage.getItem(storageKey);
        if (!values) {
            return;
        }
        values = JSON.parse(values);
        _forEach.call(form.querySelectorAll("select, input:not([type=submit]):not([type=file]):not([type=checkbox]):not([type=radio]), textarea"), function (element) {
            element.value = values[element.name];
        });
        _forEach.call(form.querySelectorAll("input[type=checkbox]"), function (element) {
            element.checked = !!values[element.name];
        });
        _forEach.call(form.querySelectorAll("input[type=radio]"), function (element) {
            if (values[element.name] === element.value) {
                element.checked = true;;
            }
        });
    };
    
    
    /**
     * Get form identifier
     * 
     * @param {String} form
     * @returns {String} Looks like CSS selector format
     */
    _getFormIdent = function (form) {
        var ident = "";
        if (form.name) {
            ident += "[name=" + form.name + "]";
        }
        if (form.id) {
            ident += "#" + form.id;
        }
        if (form.className) {
            ident += "." + form.className.trim().replace(/\s+/g, ".");
        }
        if (form.action) {
            ident += "[action=" + form.action + "]";
        }
        return ident;
    };
    
    
    /**
     * Get storage key used to store forms' values
     * @param {HTMLFormElement} form
     * @returns {String}
     */
    _getFormStorageKey = function (form) {
        return "___formFiller:form:values:" + _getFormIdent(form);
    };
    
    
    /**
     * After element's value change callback
     * 
     * Trigger `blur` and `change` events. If jQuery is available, it will be used.
     * @param {HTMLElement} element
     */
    _afterChange = function (element) {
        if (typeof window.jQuery !== "undefined") {
            window.jQuery(element)
                .trigger("blur")
                .trigger("change");
        } else {
            element.onblur   && element.onblur();
            element.onchange && element.onchange();  
        }
    };
    
    
    // export
    return {
        show : show,
        hide : hide,
        ready : ready,
        fillForm : fillForm,
        storeForm : storeForm,
        restoreForm : restoreForm
    };
    
}(document));

window.___formFiller.ready();