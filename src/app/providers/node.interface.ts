export interface NodeTree  { 
    label: string;
    iParent: number;
    iD: number;
    iType: number;
    iSubType: number;
    iFunction: number;
    sEU: string;
    dMin: number;
    dMax: number;
    dMul: number;
    sExp: boolean;
    sProgram: string;
    TagName: string;
    UID: number;
    iStartD: number;
    bHasTrigger: boolean;
    updateRate: number;
    isMulp: boolean;
    InternalIndex: number;
    children: NodeTree[];
    oTreeNode: string;
    rung: number;
    routine: string;
    sProgramParent: string;
    sParentTagName: string;
    updateRadio: string;
    isAoi: boolean;
    nameAoi: string;
    lInfoAtt: InfoAttributesModel[];
    isInjected: boolean;
}

export interface RealStateDintNode extends NodeTree {
    valueType: string;
}
export interface InfoAttributesModel {
    name: string;
    value: string;
}

