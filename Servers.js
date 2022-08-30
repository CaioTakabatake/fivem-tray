const Store = require('electron-store');

module.exports = {
    store: new Store(),

    getAllServers() {
        const servers = this.store.get('dataServers');
        if (!servers) return [];
        return servers;
    },

    update(servers) {
        this.store.set('dataServers', servers);
    },
};
