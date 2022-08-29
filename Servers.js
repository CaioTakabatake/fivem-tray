import Store from 'electron-store';

export default class Servers {
    store = new Store();

    getAllServers() {
        const servers = this.store.get('dataServers');
    }

    update(servers) {
        this.store.set('dataServers', servers);
    }
}
