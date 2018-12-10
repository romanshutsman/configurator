import { async, ComponentFixture, TestBed, inject  } from '@angular/core/testing';
import { defer } from 'rxjs';
import { SharedService } from './shared.service';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

function asyncError<T>(errorObject: any) {
    return defer(() => Promise.reject(errorObject));
  }

fdescribe('SharedService', () => {
    let ServiceSpy: jasmine.SpyObj<SharedService>;
    let service: SharedService;
    let httpSpy: { get: jasmine.Spy };


    beforeEach(async(() => {
        const spy = jasmine.createSpyObj('SharedService', ['getData']);
        httpSpy = jasmine.createSpyObj('HttpClient', ['get']);
        service = new SharedService(<any> httpSpy);

        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [
                { provide: SharedService, useValue: spy }
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
        service.connectVersionsofControllers().subscribe(contr => expect(contr).toEqual(expectedControllers0, 'expected contr 0'));
        expect(httpSpy.get.calls.count()).toBe(1, 'expect called once');
    });
    it('should return  1 controller', () => {
        const expectedControllers1 = [{Version: 'v1', Name: 'test1'}];
        httpSpy.get.and.returnValue(of(expectedControllers1));
        service.connectVersionsofControllers().subscribe(contr => expect(contr).toEqual(expectedControllers1, 'expected contr 1'));
        expect(httpSpy.get.calls.count()).toBe(1, 'expect called once');
    });
    it('should return 2 controllers ', () => {
        const expectedControllers2 = [{Version: 'v1', Name: 'test1'}, {Version: 'v2', Name: 'test2'}];
        httpSpy.get.and.returnValue(of(expectedControllers2));
        service.connectVersionsofControllers().subscribe(contr => expect(contr).toEqual(expectedControllers2, 'expected contr 2'));
        expect(httpSpy.get.calls.count()).toBe(1, 'expect called once');
    });
    it('should return error when server returns a 404', () => {
        const errRes = new HttpErrorResponse({error: 'test 404 error', status: 404, statusText: 'not found'});
        httpSpy.get.and.returnValue(asyncError(errRes));
        service.connectVersionsofControllers().subscribe(
            contr => fail('expected error'),
            error => {console.log(error); expect(error.error).toContain('test 404 error')}
        );
    });
    it('should return total of recorded file', () => {
        const expectedTotal = 50;
        httpSpy.get.and.returnValue(of(expectedTotal));
        service.getStatus().subscribe(total => expect(total).toEqual(expectedTotal, 'exprected 50'))
        expect(httpSpy.get.calls.count()).toBe(1, 'expect 1 call');
    });
});
