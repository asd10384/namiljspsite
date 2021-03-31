
document.addEventListener('DOMContentLoaded', function() {
    gettemplate();
});
function gettemplate(file = ``) {
    $('body').ready(function() {
        $.ajax({
            url: `/html/template.html`
        }).done(function(response) {
            $('body').html(response);
        }); //then
    });
}
