function ___fillForms () {
    var $,
        i = 0;
        
    if (typeof jQuery === "undefined") {
        alert("Me no works with no jQuery.");
        return;
    } else {
        $ = jQuery;
    }
    
    $(':input:visible, [id=$=-element]:visible .pencil-element')
        .not('[type=submit], [type=file]')
            .each(function () {
                var $this = $(this),
                    prevValue = $this.val(),
                    $label;
                if ($this.is('select')) {
                    // select 2nd value as first may be something like "Choose"
                    if (1 < $this.children().length && 0 === $this.children(':selected').index()) {
                        $this.val($this.children().eq(1).val());
                    }
                } else if ($this.is('[type=radio]')) {
                    // select only if first radio of that name in it's form
                    if (0 === $this.closest('form').find('[type=radio][name='+$this.attr('name')+']:checked').length) {
                        $this.prop('checked', true);
                    }
                } else if ($this.is('[type=checkbox]')) {
                    // check ALL THE checkboxes
                    $this.prop('checked', true);
                } else if ("" === $this.val()) {
                    if ($this.is('[type=email]')) {
                        $this.val('test' + i + '@example.com');
                    } else if ($this.is('[type=number]')) {
                        $this.val(i);
                    } else if ($this.is('.type_Float, .type_Price, .type_PriceWithGross')) {
                        // warning: polish number notation
                        $this.val("42," + i);
                    } else {
                        $label = $('[for=' + $this.attr('name') + ']');
                        $this.val('test ☆ ' + $label.text());
                    }
                }
                i++;
                
                if ($this.val() !== prevValue) {
                    $this.trigger('change').trigger('blur');
                }
            })
};

___fillForms();