const form = document.querySelector('form');
let name = document.getElementById('name');
let ip = document.getElementById('ip');
const { ipcRenderer } = require('electron');
const servers = require('../../servers');

form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    name = name.value;
    ip = ip.value;
    const allServers = servers.getAllServers();
    allServers.push({ name, ip });
    servers.update(allServers);
    setTimeout(() => {
        ipcRenderer.send('update-add-server', name);
        window.close();
    }, 100);
});
