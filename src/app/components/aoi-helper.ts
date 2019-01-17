import { SharedService } from "../providers/shared.service";

export class AoiHelper {

    constructor(private service: SharedService, private treeModelPost) {

    }
    saveAoi() {
        let tree = this.parseTreeToServer(this.treeModelPost[0]);
        this.service.saveAOI(tree).subscribe((value) => {
            this.responseOnAdd(value);
        },
            err => {
                // this.disableBtnAdd = false;
                this.onFailed('Addition');
            });
    }
    parseTreeToServer(tree) {
        let stringifyData = JSON.stringify(tree);
        stringifyData = stringifyData.replace(/label/g, 'nameInModel');
        stringifyData = stringifyData.replace(/children/g, 'lChildrens');
        const object = JSON.parse(stringifyData);
        return object;
    }

    responseOnAdd(value) {
        //this.showSpinner = false;
        if (value) {
            this.service.sendNotification('Node has been added!', 'success');
            //this.disableAllBtn();
        } else {
            // this.disableBtnAdd = false;
            this.onFailed('Addition');
        }
    }

    onFailed(op) {
        //this.showSpinner = false;
        this.service.sendNotification(op + ' failed!', 'fail');
    }
}