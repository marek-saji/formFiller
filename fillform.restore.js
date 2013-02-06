function ___restoreForms () {
    var $;
        
    if (typeof jQuery === "undefined") {
        alert("Me no works with no jQuery.");
        return;
    } else {
        $ = jQuery;
    }
    
    $('form').each(function () {
        var $form = $(this),
            storageKey = '___savedForm:'
                       + $form.attr('id') + ':'
                       + $form.attr('name') + ':'
                       + $form.attr('action'),
            values = localStorage.getItem(storageKey);
        if (values) {
            values = JSON.parse(values);
            $(':input:visible, [id=$=-element]:visible .pencil-element')
                .not('[type=submit], [type=file]')
                    .each(function () {
                        var $this = $(this);
                        $this.val(values[$this.attr('name')]);
                        $this.trigger('change').trigger('blur');
                    });
        }
    });
};

___restoreForms();