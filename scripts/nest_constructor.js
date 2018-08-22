'use strict';

window.onhashchange = switchToStateFromURLHash;

function switchToStateFromURLHash() {

    let URLHash = window.location.hash;

    let hash = decodeURIComponent(URLHash.substr(1));

    let pageHTML;
    let SPAState;

    if ( hash!="" )
      SPAState=JSON.parse(hash); 
    else
      SPAState={pagename:'Main'};

    switch (SPAState.pagename) {
        case 'Main':
            pageHTML = "<h3>Главная страница</h3>";
            break;
        case 'About':
            pageHTML = "";
            break;
        case 'Constructor':
            pageHTML = "<h3>Это новый конструктор</h3>";
            pageHTML +=`<div class="display"></div>
                <div class="instruments">
              <input type="button" class="elem" value="line">
              <input type="button" class="elem" value="rectangle">
              <input type="button" class="elem" value="square">
              <input type="button" class="elem" value="circle">
            </div>`
            break;
        case 'Contacts':
            pageHTML = "";
            break;
    }

    $('#Page').html(pageHTML);
}

function switchToState(newState) {
    location.hash = encodeURIComponent(JSON.stringify(newState));

}

function switchToMainPage() {
    switchToState({ pagename: 'Main' });
}

function switchToAboutPage() {
    switchToState({ pagename: 'About' });
}

function switchToConstructorPage() {
    switchToState({ pagename: 'Constructor' });
}

function switchToContactsPage() {
    switchToState({ pagename: 'Contacts' });
}

$('#myLink').click(function() {
    switchToMainPage(); return false;
});
$('#constLink').click(function() {
    switchToConstructorPage(); return false;
});

switchToStateFromURLHash();
