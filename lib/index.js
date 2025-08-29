/**
 * JiZy 
 * https://jizy-platform.com/js/
 * ========================================================================
 * Copyright 2013-2021 Joffrey Demetz
 * Licensed under MIT 
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 * ======================================================================== 
 */

// import './js/polyfills/support-passive-events.js';
// import './js/polyfills/string.trim.js';
// import './js/polyfills/array.find.js';
// import './js/polyfills/array.isarray.js';
// import './js/polyfills/object.entries.js';
// import './js/polyfills/htmlshiv.js';
// import './js/polyfills/events.js';
// import './js/polyfills/dateinput.js';
// import './js/polyfills/event.custom.js';
// import './js/polyfills/event.touch.js';
// import './js/polyfills/matchmedia.js';
// import './js/polyfills/computed.freakout.js';

import { jFetch } from 'jizy-api';
import jUtils from './js/plugins/utils.js';
import Factory from './js/Factory.js';
export default Factory;
/**
 * FRAMEWORK
 */
(function () {

    const JiZy = new JizyFactory();
    JiZy.init(
        false,
        '/',
        'fr',
        { xs: 480, sm: 768, md: 992, lg: 1200 },
        '[data-jizy-messaging]'
    );
    window.JiZy = JiZy;

    Object.keys(jUtils).forEach((key) => {
        JiZy[key] = jUtils[key];
    });

    JiZy.interval.fromMinutes('token', 15);
    JiZy.interval.fromMinutes('user', 20);

    JiZy.CheckUp.onBadBrowser((browser) => {
        document.body.classList.add("incompatible-browser");
        document.querySelector("#browser > div").style.display = "block";
        if (browser.error) {
            document.querySelector("#browser .browser-error").textContent = " " + browser.error;
        }
    });

    JiZy.CheckUp.noIE();
    JiZy.CheckUp.noOperaMini();

    JiZy.User.setInterval(JiZy.interval.get('user'));
    JiZy.User.setCaller(() => {
        (new jFetch())
            .get('/json/user/infos/')
            .setMessenger(JiZy.Messaging)
            .setCallback((response) => {
                if (response.lifetime) {
                    JiZy.interval.fromSeconds('user', response.lifetime);
                }
                JiZy.User.updateUser(response.uid);
            })
            .call();
    });
    JiZy.User.init();

    JiZy.Tokenizer.setInterval(JiZy.interval.get('token'));
    JiZy.Tokenizer.setCaller(() => {
        (new jFetch())
            .get('/json/user/tokenize')
            .setMessenger(JiZy.Messaging)
            .setCallback((response) => JiZy.Tokenizer.updateToken(response.token))
            .call();
    });
    JiZy.Tokenizer.init();

    /* JiZy.confirm = function(message, onConfirm, onCancel){
        var html = '';
        html += '<div><p class="confirm-message">'+$el.data("confirm")+'</p></div>';
        html += ' <div class="confirm-buttons">';
        html += ' <button type="button" class="btn btn-default modalizer-close">'+JiZy.translate('CANCEL')+'</button>';
        html += ' <button class="btn btn-success confirm-button">'+JiZy.translate('CONFIRM')+'</button>';
        html += '</div>';
    	
        var layer = Modalizer.addLayer('confirm', { 
            title: 'Confirmation', 
            content: html, 
            theme: 'confirm', 
            size: 'sm', 
            nofooter: true,
            noheader: true,
            closeIcon: false,
            onHide: function(layer){
                // $el.data("confirmed", null);
                if ( JiZy.isFunction(onCancel) ){
                    onCancel(layer);
                }
            },
            onShow: function(layer){
                layer.getElement().find(".confirm-button").on("click", function(e){
                    onConfirm(layer);
                    // layer.hide();
                    // layer.destroy();
                    // Modalizer.hide();
                });
            }
        });
    	
        layer.modal.setIgnoreBackdropClick(true);
    }; */

    JiZy.ready(() => {
        JiZy.Messaging.ready();
        JiZy.Tooltip.ready();
    });

})();

import './js/proxies/jquery.js';
