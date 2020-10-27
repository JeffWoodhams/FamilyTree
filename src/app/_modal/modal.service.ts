import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ModalService {
    private modals: any[] = [];
    public required: string[] = [];

    add(modal: any) {
        // add modal to array of active modals
        this.modals.push(modal);
    }
    addRequired (id: string) {
        if (!this.required.find(x => x == id)){
        this.required.push(id);
        }
    }

    remove(id: string) {
        // remove modal from array of active modals
        this.modals = this.modals.filter(x => x.id !== id);
    }

    open(id: string) {
        // open modal specified by id
        const modal = this.modals.find(x => x.id === id);
        modal.open();
    }

    close(id: string) {
        // close modal specified by id
        const modal = this.modals.find(x => x.id === id);
        modal.close();
    }
}