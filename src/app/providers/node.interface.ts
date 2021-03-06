export interface NodeTree {
    label: string;
    labelInfo: string;
    ParentID: number;
    ID: number;
    Type: number;
    SubType: number;
    EU: string;
    Min: number;
    Max: number;
    Mul: number;
    Exp: boolean;
    Program: string;
    TagName: string;
    UID: number;
    iStartD: number;
    updateRate: number;
    updateRateSeconds : number;
    isMulp: boolean;
    InternalIndex: number;
    children: NodeTree[];
    rung: number;
    routine: string;
    sProgramParent: string;
    sParentTagName: string;
    updateRadio: string;
    isAoi: boolean;
    nameAoi: string;
    lInfoAtt: InfoAttributesModel[];
    isInjected: boolean;
    hasTrigger: boolean;
    hasChange: boolean;
    hasBuffer: boolean;
    Del: number;
    isControllerScope: boolean;
    valueType: string;
}

export interface InfoAttributesModel {
    name: string;
    value: string;
}

