const { app, Tray, Menu, Notification, BrowserWindow, ipcMain } = require('electron');
const { resolve } = require('path');
const { PowerShell } = require('node-powershell');
const servers = require('./servers.js');
let tray;
let addServer;

const render = async (tray) => {
    const serverList = [];
    const allServers = servers.getAllServers();

    allServers.map((server, id) => {
        console.log(server);
        serverList.push({
            label: server.name,
            type: 'submenu',
            submenu: [
                {
                    label: 'Conect',
                    type: 'normal',
                    click: () => {
                        PowerShell.$`start fivem://connect/${server.ip}`;
                    },
                },
                {
                    label: 'Remove',
                    type: 'normal',
                    click: () => {
                        allServers.splice(id, 1);
                        servers.update(allServers);
                        new Notification({
                            title: 'SERVIDOR REMOVIDO',
                            body: `O SERVIDOR ${server.name} FOI REMOVIDO!`,
                            icon: resolve(__dirname, 'assets', 'notification.png'),
                        }).show();
                        setTimeout(() => {
                            render(tray);
                        }, 100);
                    },
                },
            ],
        });
    });

    const contextMenu = new Menu.buildFromTemplate([
        {
            label: 'Add Server',
            type: 'normal',
            click: async () => {
                if (!addServer) {
                    addServer = new BrowserWindow({ width: 400, height: 500, frame: false, resizable: false, webPreferences: { nodeIntegration: true, contextIsolation: false } });
                    addServer.loadFile('window/add-server/index.html');
                    addServer.on('closed', () => {
                        addServer = '';
                    });
                }
            },
        },
        {
            label: 'Open Menu',
            type: 'normal',
            click: async () => {
                console.log('OPEN MENU');
            },
        },
        {
            type: 'separator',
        },
        ...serverList,
        {
            type: 'separator',
        },
        {
            label: 'Quit',
            type: 'normal',
            click: async () => {
                app.quit();
            },
        },
    ]);

    tray.setContextMenu(contextMenu);
};

app.on('ready', () => {
    tray = new Tray(resolve(__dirname, 'assets', 'logo.png'));
    render(tray);
});

app.on('window-all-closed', () => {});

ipcMain.on('update-add-server', (evt, server) => {
    new Notification({ title: 'SERVIDOR ADICIONADO', body: `O SERVIDOR ${server} FOI CRIADO!`, icon: resolve(__dirname, 'assets', 'notification.png') }).show();

    render(tray);
});
