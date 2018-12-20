import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoBarComponent } from './info-bar.component';



fdescribe('InfoBarComponent', () => {
  let comp: InfoBarComponent;
  let fixture: ComponentFixture<InfoBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InfoBarComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoBarComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(comp).toBeTruthy();
  });
  it('should be offline by default', () => {
    expect(comp.statusController).toBeFalsy();
  });
  xit('should be offline', () => {
    const bodyStatus = { 'project': { 'Name': 'Blabla', 'Version': '46845.754' }, 'status': false };
    comp.status = bodyStatus;
    expect(comp.statusController).toBeFalsy();
  });
  it('should be online', () => {
    const bodyStatus = { 'project': { 'Name': 'Blabla', 'Version': '46845.754' }, 'status': true };
    comp.status = bodyStatus;
    expect(comp.statusController).toBeTruthy();
    console.log(comp);
  });
  it('should show selected Node', () => {
    const bodyStatus = { 'project': { 'Name': 'Blabla', 'Version': '46845.754' }, 'status': true };
    comp.status = bodyStatus;
    const node = {
      label: 'gvtfgbv',
      iParent: 0,
      iD: 0,
      iType: 0,
      iSubType: 0,
      iFunction: 0,
      sEU: 'gvdf',
      dMin: 0,
      dMax: 0,
      dMul: 0,
      sExp: false,
      sProgram: 'TEST',
      TagName: 'TESTTEST',
      UID: 0,
      iStartD: 0,
      bHasTrigger: false,
      updateRate: 0,
      isMulp: false,
      InternalIndex: 0,
      children: [],
      oTreeNode: 'vfd',
      rung: 0,
      routine: 'gvbtrfg',
      sProgramParent: 'gvfd',
      sParentTagName: 'fd',
      updateRadio: 'gvfd'
    };
    comp.SelectedNode = node;
    console.log(comp);
    console.log(node);
    console.log(comp.name);
    
    expect(comp.statusController).toBeTruthy();
    // expect(comp.node).toBeTruthy();
  });
  it('should be HTML', () => {
    const bannerElement: HTMLElement = fixture.nativeElement;
    const p = bannerElement.querySelectorAll('p');
    console.log(p);
  });

});
