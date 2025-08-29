/**
 * getComputedStyle shouldn't freak out when called
 * without a valid element as argument 
 */
(function () {

    try {
        getComputedStyle(undefined);
    } catch (e) {
        var nativeGetComputedStyle = getComputedStyle;
        window.getComputedStyle = function (element, pseudoElement) {
            try {
                return nativeGetComputedStyle(element, pseudoElement);
            } catch (e) {
                return null;
            }
        };
    }

})();