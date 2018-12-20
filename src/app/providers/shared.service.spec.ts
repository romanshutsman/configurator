import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { defer } from 'rxjs';
import { SharedService } from './shared.service';
import { HttpClientModule, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { HttpTestingController } from '@angular/common/http/testing';

function asyncError<T>(errorObject: any) {
    return defer(() => Promise.reject(errorObject));
}

describe('SharedService', () => {
    let ServiceSpy: jasmine.SpyObj<SharedService>;
    let service: SharedService;
    let httpSpy: { get: jasmine.Spy };


    beforeEach(async(() => {
        const spy = jasmine.createSpyObj('SharedService', ['getData', 'updateNode']);
        httpSpy = jasmine.createSpyObj('HttpClient', ['get']);
        service = new SharedService(<any>httpSpy);

        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [
                { provide: SharedService, useValue: spy },
                HttpTestingController
            ]
        });
        ServiceSpy = TestBed.get(SharedService);
    }));

    it('should be DATA', () => {
        const stubValue = 'data';
        ServiceSpy.getData.and.returnValue(stubValue);
        expect(ServiceSpy.getData()).toBe('data');
    });

    it('should call once', () => {
        ServiceSpy.getData();
        expect(ServiceSpy.getData.calls.count()).toBe(1);
    });

    it('should return controllers []', () => {
        const expectedControllers0 = [];
        httpSpy.get.and.returnValue(of(expectedControllers0));
        service.getActiveControllers().subscribe(contr => expect(contr).toEqual(expectedControllers0, 'expected contr 0'));
        expect(httpSpy.get.calls.count()).toBe(1, 'expect called once');
    });
    it('should return  1 controller', () => {
        const expectedControllers1 = [{ Version: 'v1', Name: 'test1' }];
        httpSpy.get.and.returnValue(of(expectedControllers1));
        service.getActiveControllers().subscribe(contr => expect(contr).toEqual(expectedControllers1, 'expected contr 1'));
        expect(httpSpy.get.calls.count()).toBe(1, 'expect called once');
    });
    it('should return 2 controllers ', () => {
        const expectedControllers2 = [{ Version: 'v1', Name: 'test1' }, { Version: 'v2', Name: 'test2' }];
        httpSpy.get.and.returnValue(of(expectedControllers2));
        service.getActiveControllers().subscribe(contr => expect(contr).toEqual(expectedControllers2, 'expected contr 2'));
        expect(httpSpy.get.calls.count()).toBe(1, 'expect called once');
    });
    it('should return error when server returns a 404', () => {
        const errRes = new HttpErrorResponse({ error: 'test 404 error', status: 404, statusText: 'not found' });
        httpSpy.get.and.returnValue(asyncError(errRes));
        service.getActiveControllers().subscribe(
            contr => fail('expected error'),
            error => { console.log(error); expect(error.error).toContain('test 404 error') }
        );
    });
    it('should return total of recorded file', () => {
        const expectedTotal = 50;
        httpSpy.get.and.returnValue(of(expectedTotal));
        service.getStatus().subscribe(total => expect(total).toEqual(expectedTotal, 'exprected 50'))
        expect(httpSpy.get.calls.count()).toBe(1, 'expect 1 call');
    });
    it('should return info of node', () => {
        const expectedId = 1;
        const expectedInfo = [{ 'Programs': ['prog1', 'prog2'], 'Routines': ['mainroutine'] }];
        httpSpy.get.and.returnValue(of(expectedInfo));
        service.getInfoNode(expectedId).subscribe(info => expect(info).toEqual(expectedInfo, 'exprected info'))
        expect(httpSpy.get.calls.count()).toBe(1, 'expect 1 call');
    });
    it('should return array for checkboxes', () => {
        const expectedArray = JSON.stringify([{ Name: 'sdfs', BIT: 0, selected: false }, { Name: 'sdfs', BIT: 1, selected: false }]);
        httpSpy.get.and.returnValue(of(expectedArray));
        service.getInfoTypes().subscribe(info => expect(info).toEqual(expectedArray, 'exprected info'))
        expect(httpSpy.get.calls.count()).toBe(1, 'expect 1 call');
    });
    it('should return Navigation', () => {
        const expectedBool = true;
        httpSpy.get.and.returnValue(of(expectedBool));
        service.navigate().subscribe(info => expect(info).toEqual(expectedBool, 'exprected info'))
        expect(httpSpy.get.calls.count()).toBe(1, 'expect 1 call');
    });
    it('should be updateNode', () => {
        const body = ['string']
        const stubValue = true;
        ServiceSpy.updateNode.and.returnValue(stubValue);
        expect(ServiceSpy.updateNode(body)).toBeTruthy();
        expect(ServiceSpy.updateNode).toHaveBeenCalledTimes(1);
    });
    it('should be updateNode', () => {
        const body = ['string']
        const expectedBool = true;
        httpSpy.get.and.returnValue(of(expectedBool));
        service.updateNode(body).subscribe(info => expect(info).toEqual(expectedBool, 'exprected info'))
        expect(httpSpy.get.calls.count()).toBe(1, 'expect 1 call');
    });
});
