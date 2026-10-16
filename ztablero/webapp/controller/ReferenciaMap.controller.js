sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox) {
        "use strict";
        var idMovim;
        var stado;
        return Controller.extend("nebula.com.ztablero.controller.ReferenciaMap", {
            onInit: function (evt) {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("ReferenciaMap").attachPatternMatched(this._onRouteMatched, this);

            },
            _onRouteMatched: function(oEvent) {
                var oArguments = oEvent.getParameter("arguments");
                //this.getCurrentPositionInitial();
                var oView = this.getView();
                //var oSwitch = this.getView().byId("swValidacion");
                var oButtonValidar = this.byId("_IDGenButton3");
                var oButtonObservar = this.byId("_IDGenButton4");       

                switch(oArguments.stado){
                  case "0":
                          oButtonValidar.setVisible(true);
                          oButtonObservar.setVisible(true);
                          break;
                  case "1":
                          oButtonValidar.setVisible(false);
                          oButtonObservar.setVisible(true);
                          break;
                  case "2":
                          oButtonValidar.setVisible(false);
                          oButtonObservar.setVisible(false);
                          break;      
                };

                //oSwitch.setState(auxSw);
                idMovim = oArguments.idMovim;
                stado = oArguments.stado;
                this.changePositionLocation(oArguments.latix,oArguments.longx);
                this.onVerDetalle();
              },
            onVerDetalle:function(){
              // https://b3ceeb8btrial-dev-zdatastreet-business-srv.cfapps.us10-001.hana.ondemand.com/service/zbusiness/MovimientoDiarioCustom
              var url_data1 = "./backend_mov/odata/v4/service/zbusiness/MovimientoDiarioCustom?$filter=idMovimientoDiario eq " + idMovim;
              this.cargaDatosaModelo(url_data1);

              },
            onVolver: function(){
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo('Main');
            },
            changePositionLocation: function (latx, longx) {
                var that = this;
                var oGeoMap = this.getView().byId("vbi");
                var oMapConfig = {
                  MapProvider: [
                    {
                      name: "GMAP",
                      Source: [
                        {
                          id: "s1",
                          url: "https://mt.google.com/vt/lyrs=m&x={X}&y={Y}&z={LOD}",
                        },
                      ],
                    },
                  ],
                  MapLayerStacks: [
                    {
                      name: "DEFAULT",
                      MapLayer: {
                        name: "layer1",
                        refMapProvider: "GMAP",
                        opacity: "1",
                        colBkgnd: "RGB(255,255,255)",
                      },
                    },
                  ],
                };

                this.latitudeG = "" + latx;
                this.longitudeG = "" + longx;
                var latitude = latx;
                var longitude = longx;
                oGeoMap.setMapConfiguration(oMapConfig);
                oGeoMap.setRefMapLayerStack("DEFAULT");
                oGeoMap.setInitialZoom(18);
                //Inicio - geomap
                if (navigator.geolocation) {
        
                  navigator.geolocation.getCurrentPosition((position) => {
                    //setStatus(null)
                    //setLatitude(position.coords.latitude);
                    //setLongitude(position.coords.longitude);
                    latitude = latx;
                    longitude = longx;
                    var currentPoint = longitude + ";" + latitude + ";" + "0";
                    that.currentPosition = latitude + "," + longitude;
                    oGeoMap.setInitialPosition(currentPoint);
                    oGeoMap.setCenterPosition(longitude + ";" + latitude);
        
                    oGeoMap.destroyVos();
                    var points = new sap.ui.vbm.Spots({
                      items: [new sap.ui.vbm.Spot({ position: currentPoint, type: "Error", text: "X" })]
                    });
                    oGeoMap.addVo(points);
                  },
                    () => {
                      MessageBox.error('Unable to retrieve your location');
                    });
                } else {
                  MessageBox.error('Geolocation is not supproted by your broswer');
                }
                
              },
              getCurrentPositionInitial: async function () {
                //ppo
                //this.getCurrentPositionGlobal();
                //var latitude = this.latitudeG;
                //var longitude = this.longitudeG;
                var that = this;
                var oGeoMap = this.getView().byId("vbi");
                var oMapConfig = {
                  MapProvider: [
                    {
                      name: "GMAP",
                      Source: [
                        {
                          id: "s1",
                          url: "https://mt.google.com/vt/lyrs=m&x={X}&y={Y}&z={LOD}",
                        },
                      ],
                    },
                  ],
                  MapLayerStacks: [
                    {
                      name: "DEFAULT",
                      MapLayer: {
                        name: "layer1",
                        refMapProvider: "GMAP",
                        opacity: "1",
                        colBkgnd: "RGB(255,255,255)",
                      },
                    },
                  ],
                };
        
                var latitude = '';
                var longitude = '';
        
                //var currentPoint = longitude + ";" + latitude + ";" + "0";
                oGeoMap.setMapConfiguration(oMapConfig);
                oGeoMap.setRefMapLayerStack("DEFAULT");
                oGeoMap.setInitialZoom(18);
                //Inicio - geomap
                if (navigator.geolocation) {
        
                  navigator.geolocation.getCurrentPosition((position) => {
                    //setStatus(null)
                    //setLatitude(position.coords.latitude);
                    //setLongitude(position.coords.longitude);
                    latitude = position.coords.latitude;
                    longitude = position.coords.longitude
                    var currentPoint = longitude + ";" + latitude + ";" + "0";
                    that.currentPosition = latitude + "," + longitude;
                    oGeoMap.setInitialPosition(currentPoint);
                    oGeoMap.setCenterPosition(longitude + ";" + latitude);
        
                    oGeoMap.destroyVos();
                    var points = new sap.ui.vbm.Spots({
                      items: [new sap.ui.vbm.Spot({ position: currentPoint, type: "Error", text: "X" })]
                    });
                    oGeoMap.addVo(points);
                  },
                    () => {
                      MessageBox.error('Unable to retrieve your location');
                    });
                } else {
                  MessageBox.error('Geolocation is not supproted by your broswer');
                }
                //Fin - geomap
        
              },
              ObservarReg: function(){
                var that = this;
                var objAux = {};
                 var oTextArea = new sap.m.TextArea({
                    width: "98%",
                    rows: 5,
                    maxLength: 1000,
                    placeholder: "Ingrese el motivo de la observación..."
                });
                var oDialog = new sap.m.Dialog({
                    title: "Registrar observación",
                    contentWidth: "450px",
                    content: [
                        new sap.m.Label({
                            //text: "Observación:",
                            labelFor: oTextArea
                        }),
                        oTextArea
                    ],
                    beginButton: new sap.m.Button({
                        text: "Guardar",
                        type: "Emphasized",
                        press: function () {
                            var sObservacion = oTextArea.getValue().trim();
                            if (!sObservacion) {
                                sap.m.MessageBox.warning(
                                    "Debe ingresar una observación."
                                );
                                return;
                            }
                            
                            //console.log("Observación:", sObservacion);
                            oDialog.close();
                                var url_data = "./backend_mov/odata/v4/service/zbusiness/MovimientosDiarios/" + idMovim
                                objAux.observacionGeneral = sObservacion;
                                objAux.status = "2";
                                var jsonObject = JSON.stringify(objAux);
                                var self = that;
                                var aData2 = jQuery.ajax({
                                  type: "PATCH",
                                  cache: false,
                                  contentType: "application/json",
                                  url: url_data,
                                  dataType: "json",
                                  async: false,
                                  data: jsonObject,
                                  success: function (data, textStatus, jqXHR) {
                                    //oGlobalBusyDialog.close();
                                     /*sap.m.MessageToast.show(
                                        "Observación ingresada correctamente."
                                      );
                                      */
                                    MessageBox.information("Se ha guardado la observacion correctamente", {
                                      actions: ["Aceptar"],
                                      emphasizedAction: "Aceptar",
                                      onClose: function (sAction) {
                                        //MessageToast.show("Action selected: " + sAction);
                                        self.onVolver();
                                      }
                                    });
                                  },
                                  error: function (xhr, readyState) {
                                    //oGlobalBusyDialog.close();
                                    MessageBox.error("no se pudo realizar la validacion de registro");
                                  },
                                });
                        }
                    }),
                    endButton: new sap.m.Button({
                        text: "Cancelar",
                        press: function () {
                            oDialog.close();
                        }
                    }),
                    afterClose: function () {
                        oDialog.destroy();
                    }
                });
                oTextArea.addStyleClass("sapUiSmallMarginBottom");
                this.getView().addDependent(oDialog);
                oDialog.open();
              },
              onSwitchChange: function(oEvent){
                //https://b3ceeb8btrial-dev-zdatastreet-business-srv.cfapps.us10-001.hana.ondemand.com/service/zbusiness/MovimientosDiarios/{IDMOV}

                //stado = argumentos.status;
                var oView = this.getView();
                //var oSwitch = this.getView().byId("swValidacion");
                //var valSw = oSwitch.getState();
                /*
                
                var auxSw;
                if (valSw === true){
                  auxSw = "1"
                }else{
                  auxSw = "0"
                };
                */
                  var that = this;
                  var objAux = {};
                  sap.m.MessageBox.confirm(
                      "¿Está seguro de que desea proceder con la validación del registro?",
                      {
                          title: "Confirmar validación",
                          actions: [
                              "Validar",
                              sap.m.MessageBox.Action.CANCEL
                          ],
                          emphasizedAction: "Validar",
                          onClose: function (sAction) {
                              if (sAction === "Validar") {
                                var url_data = "./backend_mov/odata/v4/service/zbusiness/MovimientosDiarios/" + idMovim
                                objAux.status = "1";
                                var jsonObject = JSON.stringify(objAux);
                                var self = that;
                                var aData2 = jQuery.ajax({
                                  type: "PATCH",
                                  cache: false,
                                  contentType: "application/json",
                                  url: url_data,
                                  dataType: "json",
                                  async: false,
                                  data: jsonObject,
                                  success: function (data, textStatus, jqXHR) {
                                    //oGlobalBusyDialog.close();
                                    MessageBox.information("Se ha validado correctamente.", {
                                      actions: ["Aceptar"],
                                      emphasizedAction: "Aceptar",
                                      onClose: function (sAction) {
                                        //MessageToast.show("Action selected: " + sAction);
                                        self.onVolver();
                                      }
                                    });
                                  },
                                  error: function (xhr, readyState) {
                                    //oGlobalBusyDialog.close();
                                    MessageBox.error("no se pudo realizar la validacion de registro");
                                  },
                                });
                              }

                          }
                      }
                  );               

               
              },
      
              cargaDatosaModelo(url_data){
                var oView = this.getView();
                var oJsonModelMovDiarios = new sap.ui.model.json.JSONModel();
                var listaMovDiarios = [];
                var aData = jQuery
                .ajax({
                  method: "GET",
                  cache: false,
                  headers: {
                    "X-CSRF-Token": "Fetch",
                  },
                  async: false,
                  url: url_data,
                })
                .then(
                  function successCallback(result, xhr, data) {
                    listaMovDiarios = result.value;
                  },
                  function errorCallback(xhr, readyState) {
                    jQuery.sap.log.debug(xhr);
                  }
                );
              //let obj = { listaMovDiarios: listaMovDiarios };
              oJsonModelMovDiarios.setData({
                direccion: listaMovDiarios[0].direccion,
                razonSocial: listaMovDiarios[0].razonSocial,
                horarioApertura: listaMovDiarios[0].horarioApertura,
                descripcionRubro: listaMovDiarios[0].descripcionRubro,
                descipcionAfluencia: listaMovDiarios[0].descipcionAfluencia,
                descripcionTemporada: listaMovDiarios[0].descripcionTemporada,
                descripcionCompetencia: listaMovDiarios[0].descripcionCompetencia,
                fechaRegistro: listaMovDiarios[0].fechaRegistro,
                descripcionZona: listaMovDiarios[0].descripcionZona,
                descripcionTPublico: listaMovDiarios[0].descripcionTPublico,
                descripcionDistrito: listaMovDiarios[0].descripcionDistrito,
                decripcionEstacion: listaMovDiarios[0].decripcionEstacion
              });
              //tabla.setModel(oJsonModelEstablecimiento);
              oView.setModel(oJsonModelMovDiarios, "modelView");
              }
        });
    });