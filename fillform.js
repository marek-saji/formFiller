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
        .not('[type=submit]')
            .each(function () {
                var $this = $(this),
                    $label;
                if ($this.is('select')) {
                    // select 2nd value as first may be something like "Choose"
                    $this.val($this.children().eq(1).val());
                } else if ($this.is('[type=radio]')) {
                    if (0 === $this.closest('form').find('[type=radio][name='+$this.attr('name')+']:checked').length) {
                        $this.prop('checked', true);
                    }
                } else if ($this.is('[type=checkbox]')) {
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
            })
    .trigger('change')
    .trigger('blur.formPencil')
};

___fillForms();