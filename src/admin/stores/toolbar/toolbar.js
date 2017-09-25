import { useView, inject, bindable } from 'aurelia-framework'
import { HttpClient } from 'aurelia-http-client'
import { CheckAuth } from 'authConfig'
import { EventAggregator } from 'aurelia-event-aggregator'

@inject(HttpClient, EventAggregator)
export class Toolbar {
  constructor(http, emitter) {
    this.emitter = emitter
    this.filters = [{name:'SELECT A FILTER', type:null}, {name:'Un Confirmed Stores', type:'isConfirmed'}]
    this.sorters = [{name:'SORT BY', type:'name'}, {name:'name', type:'name'}, {name:'Expiration Date',type:'leaseExpDate'},{name:'Notification Date',type:'leaseNotifDate'} ]
    this.state = {
      filter:{},
      sorter:{},
      listStyle: 'list',
      isList: false
    }
    this.http = http
    this.isLoading = true
  }

  toggleList() {
    this.state.isList = !this.state.isList
    this.emitter.publish('list-channel', true)
    this.toggleListIcon()
  }

  toggleListIcon(){
    this.state.isList
    ? this.state.listStyle = 'list'
    : this.state.listStyle = ''
  }

  filterChanged(filterable) {
    this.emitter.publish('filter-channel', {title:'filterable', msg:filterable.type})
  }

  sortTypeChanged(sortType) {
    this.emitter.publish('sort-channel', {title:'sortType', msg:sortType.type})
  }
}