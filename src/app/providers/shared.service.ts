import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { NodeTree, RealStateDintNode } from './node.interface';
import { DataHelper } from './data-helper';

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
  initNodeValueType: RealStateDintNode = this.nodeValueType;
  dataTREE = this.Tree;

  API_URL = 'http://localhost:13772/api/connect';
  API_URL_NODE = 'http://localhost:13772/api/node';
  action = {
    add: 'add',
    edit: 'edit',
    navigate: 'navigate'
  }
  nodeType = {
    real: 'real',
    state: 'state',
    dint: 'dint',
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
  getData() {
    return 'data';
  }
  sendNotification(msg: string, type: string, total = undefined) {
    const body = { 'msg': msg, 'type': type, 'total': total };
    this.SubjectNotifications.next(body);
  }
  connectVersionsofControllers() {
    return this.http.get(this.API_URL + '/get');
  }
  getStatus() {
    return this.http.get(this.API_URL + '/status');
  }
  chooseVersionsofControllers(body) {
    console.log(body)
    return this.http.post(this.API_URL + '/connect', body, this.options);
  }
  VerifyLogixInfoServer(body) {
    console.log(body)
    return this.http.post(this.API_URL + '/verify-logix', JSON.stringify(body), this.options);
  }
  switchOnController(body) {
    return this.http.post(this.API_URL + '/on', body);
  }
  switchOffController(body) {
    return this.http.post(this.API_URL + '/off', body);
  }
  addNode(body) {
    return this.http.post(this.API_URL_NODE + '/add-node', body);
  }
  getInfoNode(id) {
    return this.http.get(this.API_URL_NODE + '/info/' + id);
  }
  getInfoTypes() {
    return this.http.get(this.API_URL_NODE + '/infotypes');
  }
  getInfoOnEditNode(id) {
    return this.http.get(this.API_URL_NODE + '/edit/' + id);
  }
  updateNode(body) {
    return this.http.post(this.API_URL_NODE + '/update', body);
  }
  navigate() {
    return this.http.get(this.API_URL_NODE + '/navigate');
  }
}
