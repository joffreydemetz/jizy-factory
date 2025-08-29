(function () {
    if (!document.createElement('canvas').getContext) {
        var shiv = document.createElement('script');
        shiv.setAttribute('type', 'text/javascript');
        shiv.src = 'https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv.min.js';
        shiv.async = true;
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(shiv, s);

        var respond = document.createElement('script');
        respond.setAttribute('type', 'text/javascript');
        respond.src = 'https://cdnjs.cloudflare.com/ajax/libs/respond.js/1.4.2/respond.min.js';
        respond.async = true;
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(respond, s);
    }
})();