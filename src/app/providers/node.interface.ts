export interface NodeTree  { 
    label: string;
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

