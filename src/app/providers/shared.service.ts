import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { NodeTree } from './node.interface';
import { Programs } from './common.interface';
import { DataHelper } from './data-helper';
import { ApiResponse, ApiMessage } from './api-response-model';

@Injectable({
  providedIn: 'root'
})
export class SharedService extends DataHelper {
  SubjectOnConnect = new BehaviorSubject<any>(false);
  SubjectLoadTree = new BehaviorSubject<any>(null);
  SubjectTransferVersion = new BehaviorSubject<any>(false);
  SubjectNotifications = new BehaviorSubject<any>({ 'msg': 'Started', 'type': 'success' });
  SubjectControlTab = new BehaviorSubject<any>(false);
  SubjectOperationOnForm = new BehaviorSubject<any>(false);
  initNode: NodeTree = this.node;
  initNodeValueType: NodeTree = this.node;
  dataTREE = this.Tree;
  controllerMode = this.ControllerModeEnum;
  programsAndRoutines: any;

  API_URL = 'http://localhost:13772/api/connect';
  API_URL_NODE = 'http://localhost:13772/api/node';
  API_URL_AOI = 'http://localhost:13772/api/aoi';
  action = {
    add: 'add',
    edit: 'edit',
    navigate: 'navigate'
  }
  nodeType = {
    real: 'real',
    realWrite: 'real-write',
    state: 'state',
    dint: 'dint',
    dintWrite: 'dint-write',
    string: 'string',
    node: 'node'
  };

  options = {
    headers: new HttpHeaders(
      {
        'Content-Type': 'application/json',
      })
  }

  constructor(private http: HttpClient) { super() }
  sendNotification(msg: ApiMessage) {
    this.SubjectNotifications.next(msg);
  }
  getActiveControllers() {
    return this.http.get(this.API_URL + '/get');
  }
  getStatus() {
    return this.http.get(this.API_URL + '/status');
  }
  connectToController(body) {
    return this.http.post(this.API_URL + '/connect', body, this.options);
  }
  VerifyLogixInfoServer(body) {
    return this.http.post(this.API_URL + '/verify-logix', JSON.stringify(body), this.options);
  }
  StartCollectData(body) {
    return this.http.post(this.API_URL + '/on', body);
  }
  StopCollectData(body) {
    return this.http.post(this.API_URL + '/off', body);
  }
  addNode(body) {
    return this.http.post(this.API_URL_NODE + '/add-node', body);
  }
  getInfoNode(id) {
    return this.http.get(this.API_URL_NODE + '/info/' + id);
  }
  getInfoTypes() {
    return this.http.get(this.API_URL + '/infotypes');
  }
  getInfoOnEditNode(body) {
    return this.http.post(this.API_URL_NODE + '/edit/',  body);
  }
  updateNode(body) {
    return this.http.post(this.API_URL_NODE + '/update', body);
  }
  navigate() {
    return this.http.get(this.API_URL_NODE + '/navigate');
  }
  loadAOI(name) {
    return this.http.post(this.API_URL_AOI + '/load-aoi', { name: name });
  }
  insertAOI(body) {
    return this.http.post(this.API_URL_AOI + '/insert-aoi', body);
  }
  getPrograms() {
    return this.http.get<ApiResponse<Programs>>(this.API_URL + '/programs');
  }

  saveToHdrive(body){
    return this.http.post(this.API_URL + '/save-hdrive', body); 
  }

  cloneNode(item) : NodeTree {
    return {
      label: item.label,
      labelInfo: '',
      ParentID: item.ParentID,
      ID: item.ID,
      Type: item.Type,
      SubType: item.SubType,
      EU: item.EU,
      Min: item.Min,
      Max: item.Max,
      Mul: item.Mul,
      Exp: item.Exp,
      Program: item.Program,
      TagName: item.TagName,
      UID: item.UID,
      iStartD: item.iStartD,
      hasTrigger: item.hasTrigger,
      updateRate: item.updateRate,
      updateRateSeconds: item.updateRateSeconds,
      isMulp: item.isMulp,
      InternalIndex: item.InternalIndex,
      children: item.children,
      rung: item.rung,
      routine: item.routine,
      sProgramParent: item.sProgramParent,
      sParentTagName: item.TagName,
      updateRadio: item.updateRadio,
      isAoi: item.isAoi,
      nameAoi: item.nameAoi,
      lInfoAtt: item.lInfoAtt,
      isInjected: item.isInjected,
      hasChange: item.hasChange,
      hasBuffer: item.hasBuffer,
      Del: item.Del,
      isControllerScope: item.isControllerScope,
      valueType: item.valueType
    };
  }

}
