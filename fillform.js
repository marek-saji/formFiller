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
      .not('[type=checkbox], [type=submit]')
          .each(function () {
              var $this = $(this),
                  $label;
              if ($this.is('select')) {
                  $this.val($this.children().eq(1).val());
              } else if ($this.is('[type=email]')) {
                  $this.val('test' + i + '@example.com');
              } else {
                  $label = $('[for=' + $this.attr('name') + ']');
                  $this.val('test ☆ ' + $label.text());
              }
              i++;
          })
    .trigger('change')
    .trigger('blur.formPencil')
};

___fillForms();