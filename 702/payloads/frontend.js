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
    var fields = [];
    for(var i = 0; i < 16; i++)
    {
        var tr = document.createElement('tr');
        tbl.appendChild(tr);
        var username = document.createElement('td');
        tr.appendChild(username);
        var tdId = document.createElement('td');
        tr.appendChild(tdId);
        var id = document.createElement('input');
        tdId.appendChild(id);
        var tdButton = document.createElement('td');
        tr.appendChild(tdButton);
        var button = document.createElement('button');
        tdButton.appendChild(button);
        button.appendChild(document.createTextNode('Set & Activate'));
        fields.push({username: username, id: id, button: button});
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
        ui[i].button.disabled = true;
        return;
    }
    var string_id = '';
    for(var j = 7; j >= 0; j--)
    {
        var digit = mailbox.account_id[j];
        string_id += "0123456789ABCDEF"[digit >> 4];
        string_id += "0123456789ABCDEF"[digit & 15];
    }
    ui[i].username.appendChild(document.createTextNode(mailbox.account_name));
    ui[i].id.value = string_id;
    ui[i].id.readOnly = false;
    ui[i].button.disabled = false;
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
    ui[i].username.onclick = setRandomID.bind(window, i);
    ui[i].button.onclick = activateAccount.bind(window, i);
}
