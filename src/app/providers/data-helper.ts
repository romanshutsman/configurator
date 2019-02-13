export class DataHelper {
    node = {
        label: '',
        labelInfo: '',
        ParentID: null,
        ID: null,
        Type: null,
        SubType: null,
        EU: '',
        Min: 0,
        Max: 0,
        Mul: 0,
        Exp: false,
        Program: '',
        TagName: '',
        UID: null,
        iStartD: null,
        hasTrigger: false,
        updateRate: 0,
        updateRateSeconds: null,
        isMulp: false,
        InternalIndex: null,
        children: [],
        rung: 0,
        routine: '',
        sProgramParent: '',
        sParentTagName: '',
        updateRadio: 'Parent',
        isAoi: false,
        nameAoi: null,
        lInfoAtt: [],
        isInjected: false,
        hasChange: false,
        hasBuffer: true,
        Del: 0,
        isCreation: false,
        valueType: '',
    }
    
    ControllerModeEnum = {
        rsModeRemProgram : 0,
        rsModeRemRun : 1,
        rsModeRemTest : 2,
        rsModeRun : 3,
        rsModeProgram : 4,
        rsModeFaulted : 5,
        rsModeOffline : 6
    }


    Tree =  JSON.parse("{\"nameInModel\":\"Information Model\",\"updateRadio\":\"Rate\",\"lChildrens\":[{\"nameInModel\":\"My First Node\",\"lChildrens\":[{\"nameInModel\":\"R01\",\"lChildrens\":[],\"ParentID\":1,\"ID\":4,\"Type\":1,\"SubType\":0,\"EU\":\"R01\",\"Min\":0.0,\"Max\":0.0,\"Mul\":0.0,\"Del\":0.0,\"Exp\":true,\"Program\":\"MainProgram\",\"TagName\":\"R01\",\"UID\":357773032,\"iStartD\":5,\"hasTrigger\":false,\"hasChange\":true,\"hasBuffer\":false,\"hasAttributes\":false,\"updateRate\":0.0,\"isMulp\":false,\"InternalIndex\":4,\"isAoi\":false,\"aoiName\":null,\"isInjected\":false,\"lInfoAtt\":[]},{\"nameInModel\":\"D01\",\"lChildrens\":[],\"ParentID\":1,\"ID\":2,\"Type\":2,\"SubType\":0,\"EU\":\"\",\"Min\":0.0,\"Max\":0.0,\"Mul\":1.0,\"Del\":0.0,\"Exp\":true,\"Program\":\"MainProgram\",\"TagName\":\"D01\",\"UID\":1805350266,\"iStartD\":1,\"hasTrigger\":false,\"hasChange\":true,\"hasBuffer\":false,\"hasAttributes\":false,\"updateRate\":0.0,\"isMulp\":false,\"InternalIndex\":24,\"isAoi\":false,\"aoiName\":null,\"isInjected\":false,\"lInfoAtt\":[]},{\"nameInModel\":\"D02\",\"lChildrens\":[],\"ParentID\":1,\"ID\":3,\"Type\":4,\"SubType\":0,\"EU\":\"\",\"Min\":0.0,\"Max\":0.0,\"Mul\":1.0,\"Del\":0.0,\"Exp\":true,\"Program\":\"MainProgram\",\"TagName\":\"D02\",\"UID\":28761764,\"iStartD\":2,\"hasTrigger\":false,\"hasChange\":true,\"hasBuffer\":false,\"hasAttributes\":false,\"updateRate\":0.0,\"isMulp\":false,\"InternalIndex\":24,\"isAoi\":false,\"aoiName\":null,\"isInjected\":false,\"lInfoAtt\":[]},{\"nameInModel\":\"Child Node\",\"lChildrens\":[],\"ParentID\":1,\"ID\":5,\"Type\":5,\"SubType\":0,\"EU\":\"\",\"Min\":0.0,\"Max\":0.0,\"Mul\":0.0,\"Del\":0.0,\"Exp\":true,\"Program\":\"MainProgram\",\"TagName\":\"ChildNode\",\"UID\":976015756,\"iStartD\":0,\"hasTrigger\":false,\"hasChange\":false,\"hasBuffer\":false,\"hasAttributes\":false,\"updateRate\":0.0,\"isMulp\":false,\"InternalIndex\":1,\"isAoi\":false,\"aoiName\":null,\"isInjected\":false,\"lInfoAtt\":[]},{\"nameInModel\":\"N01\",\"lChildrens\":[],\"ParentID\":1,\"ID\":6,\"Type\":0,\"SubType\":0,\"EU\":\"\",\"Min\":0.0,\"Max\":0.0,\"Mul\":0.0,\"Del\":0.0,\"Exp\":true,\"Program\":\"MainProgram\",\"TagName\":\"N01\",\"UID\":-2132528421,\"iStartD\":4,\"hasTrigger\":false,\"hasChange\":false,\"hasBuffer\":false,\"hasAttributes\":false,\"updateRate\":-1.000448,\"isMulp\":false,\"InternalIndex\":1,\"isAoi\":false,\"aoiName\":null,\"isInjected\":false,\"lInfoAtt\":[]}],\"ParentID\":0,\"ID\":1,\"Type\":0,\"SubType\":0,\"EU\":\"\",\"Min\":0.0,\"Max\":0.0,\"Mul\":0.0,\"Del\":0.0,\"Exp\":true,\"Program\":\"MainProgram\",\"TagName\":\"MyFirstNode\",\"UID\":1074049440,\"iStartD\":3,\"hasTrigger\":false,\"hasChange\":false,\"hasBuffer\":false,\"hasAttributes\":false,\"updateRate\":1.000448,\"isMulp\":false,\"InternalIndex\":1,\"isAoi\":false,\"aoiName\":null,\"isInjected\":false,\"lInfoAtt\":[]}],\"ParentID\":-1,\"ID\":0,\"Type\":0,\"SubType\":0,\"EU\":\"\",\"Min\":0.0,\"Max\":0.0,\"Mul\":0.0,\"Del\":0.0,\"Exp\":true,\"Program\":\"\",\"TagName\":\"\",\"UID\":0,\"iStartD\":0,\"hasTrigger\":false,\"hasChange\":false,\"hasBuffer\":false,\"hasAttributes\":false,\"updateRate\":0.0,\"isMulp\":false,\"InternalIndex\":0,\"isAoi\":false,\"aoiName\":null,\"isInjected\":false,\"lInfoAtt\":[]}")
}
