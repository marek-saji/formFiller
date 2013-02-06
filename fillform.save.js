function ___saveForms () {
    var $;
        
    if (typeof jQuery === "undefined") {
        alert("Me no works with no jQuery.");
        return;
    } else {
        $ = jQuery;
    }
    
    $('form').each(function () {
        var $form = $(this),
            values = {},
            storageKey = '___savedForm:'
                       + $form.attr('id') + ':'
                       + $form.attr('name') + ':'
                       + $form.attr('action');
        $(':input:visible, [id=$=-element]:visible .pencil-element')
            .not('[type=submit], [type=file]')
                .each(function () {
                    var $this = $(this);
                    values[$this.attr('name')] = $this.val();
                });
        localStorage.setItem(storageKey, JSON.stringify(values));
    });
};

___saveForms();