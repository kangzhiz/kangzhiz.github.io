/*
 * Returns true if display is set to none.
 */
function isHidden(el) {
    return window.getComputedStyle(el).display === 'none';
}

/*
 * Toggle visibility of command box.
 *
 * TODO: smooth animations
 */
function toggleCmd() {
    let cmdbox = document.getElementById('cmdbox');
    let txtfield = cmdbox.getElementsByTagName('input')[0];

    if (isHidden(cmdbox)) {
        cmdbox.style.display = 'block';
        txtfield.focus();
    } else {
        cmdbox.style.display = 'none';
    }
}
