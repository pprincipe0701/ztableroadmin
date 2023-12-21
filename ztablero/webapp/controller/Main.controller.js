sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageBox"
],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (Controller,MessageBox) {
    "use strict";
    var latitud;
    var longitud;
    var iDMov;
    var stadoReg;
    return Controller.extend("nebula.com.ztablero.controller.Main", {
      onInit: function () {
        this.router = this.getOwnerComponent().getRouter(this);
        this.router.getRoute("Main").attachPatternMatched(this._onPatternMatched, this);
        this.cargaInicial();
        
      },
      _onPatternMatched: function (oEvt) {
        //this.cargaInicial();
        this.onSearch(oEvt)
      },
      cargaInicial:function(){
        var oView = this.getView();
        var currentDate = new Date();
        oView.byId("fechaFinal").setDateValue(currentDate)
        var currentDate1 = new Date();
        currentDate1.setDate(currentDate1.getDate() - 1);
        oView.byId("fechaInicio").setDateValue(currentDate1)
        this.poblarCombos();
        this.cargaUsuarios();

        var oModel = new sap.ui.model.json.JSONModel({
          opciones: [
            { idVal: "1", texto: "Validado" },
            { idVal: "0", texto: "No Validado" }
          ]
        });
        var oComboBox = this.getView().byId("cbxStatus");
        oComboBox.setModel(oModel);
        oComboBox.bindItems({
          path: "/opciones",
          template: new sap.ui.core.Item({
            key: "{idVal}",
            text: "{texto}"
          })
        });
        this.onSearchInitial();
      },
      onSearchInitial: function(){
        var oView = this.getView();
        var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" });
        var oDatePickerIni = this.getView().byId("fechaInicio");
        var selectedDateIni = oDatePickerIni.getDateValue();
        var oDatePickerFinal = this.getView().byId("fechaFinal");
        var selectedDateFinal = oDatePickerFinal.getDateValue();
  
        var listaMovDiarios = [];


        if (selectedDateIni) {
          var fechaInicio = dateFormat.format(selectedDateIni);

          if (selectedDateFinal) {
            var fechaFinal = dateFormat.format(selectedDateFinal);
 
                  var oJsonModelMovDiarios = new sap.ui.model.json.JSONModel();

                  //llAMAR AL SERVICIO QUE LISTA LOS ESTABLECIMIENTOS
                  var url_data = "./backend_mov/service/zbusiness/MovimientoDiarioCustom?$filter=fechaRegistro le " + fechaInicio + " and fechaRegistro ge " + fechaFinal;
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
                  let obj = { listaMovDiarios: listaMovDiarios };
                  oJsonModelMovDiarios.setData(obj);
                  //tabla.setModel(oJsonModelEstablecimiento);
                  oView.setModel(oJsonModelMovDiarios, "modelMovDiario");


                } else {
                  console.log("No se ha seleccionado Zona")
                }
              } else {
                console.log("No se ha seleccionado Zona")
          }
 
      },
      onSearch: function (oEvent) {
        var oView = this.getView();
        var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" });

        var oDatePickerIni = this.getView().byId("fechaInicio");
        var selectedDateIni = oDatePickerIni.getDateValue();
        var oDatePickerFinal = this.getView().byId("fechaFinal");
        var selectedDateFinal = oDatePickerFinal.getDateValue();
        var oComboBox = this.getView().byId("cbxDistrito");
        var idDistrito = oComboBox.getSelectedKey();

        var oComboBox = this.getView().byId("cbxzona");
        var selectedKeyzona = oComboBox.getSelectedKey();       
        var url_data1;

        var oComboBox = this.getView().byId("cbxUsuario");
        var selectedKeyusuario = oComboBox.getSelectedKey();

        var fechaInicio = dateFormat.format(selectedDateIni);
        var fechaFinal = dateFormat.format(selectedDateFinal);

            if (selectedKeyzona) {
              url_data1 = "./backend_mov/service/zbusiness/MovimientoDiarioCustom?$filter=idDistrito eq " + idDistrito + " and idMasterZona eq " + selectedKeyzona + "  and fechaRegistro ge " + fechaInicio + " and fechaRegistro lt " + fechaFinal;
              
            }else if (idDistrito) {
              url_data1 = "./backend_mov/service/zbusiness/MovimientoDiarioCustom?$filter=idDistrito eq " + idDistrito + "  and fechaRegistro ge " + fechaInicio + " and fechaRegistro lt " + fechaFinal;
              
            }else if(selectedKeyusuario){
              url_data1 = "./backend_mov/service/zbusiness/MovimientoDiarioCustom?$filter=idUsuario eq " + selectedKeyusuario + "  and fechaRegistro ge " + fechaInicio + " and fechaRegistro lt " + fechaFinal;
              
            } else {
              if (selectedDateIni && selectedDateFinal) {
                url_data1 = "./backend_mov/service/zbusiness/MovimientoDiarioCustom?$filter=fechaRegistro ge " + fechaInicio + " and fechaRegistro lt " + fechaFinal;
            
                };
            }
            this.cargaDatosaModelo(url_data1);
      },
      selectStatus: function(oEvent){
        var oView = this.getView();
        var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" });

        var oDatePickerIni = this.getView().byId("fechaInicio");
        var selectedDateIni = oDatePickerIni.getDateValue();
        var oDatePickerFinal = this.getView().byId("fechaFinal");
        var selectedDateFinal = oDatePickerFinal.getDateValue();
        var oComboBox = this.getView().byId("cbxDistrito");
        var idDistrito = oComboBox.getSelectedKey();

        var oComboBox = this.getView().byId("cbxzona");
        var selectedKeyzona = oComboBox.getSelectedKey();

        var oComboBox = this.getView().byId("cbxStatus");
        var idStatus = oComboBox.getSelectedKey();
        

        var url_data1;

        var oComboBox = this.getView().byId("cbxUsuario");
        var selectedKeyusuario = oComboBox.getSelectedKey();

        var fechaInicio = dateFormat.format(selectedDateIni);
        var fechaFinal = dateFormat.format(selectedDateFinal);

            if (selectedKeyzona) {
              url_data1 = "./backend_mov/service/zbusiness/MovimientoDiarioCustom?$filter=idDistrito eq " + idDistrito + " and idMasterZona eq " + selectedKeyzona + "  and fechaRegistro ge " + fechaInicio + " and fechaRegistro lt " + fechaFinal + " and status eq '" + idStatus + "'";
              
            }else if (idDistrito) {
              url_data1 = "./backend_mov/service/zbusiness/MovimientoDiarioCustom?$filter=idDistrito eq " + idDistrito + "  and fechaRegistro ge " + fechaInicio + " and fechaRegistro lt " + fechaFinal + " and status eq '" + idStatus + "'";
              
            }else if(selectedKeyusuario){
              url_data1 = "./backend_mov/service/zbusiness/MovimientoDiarioCustom?$filter=idUsuario eq " + selectedKeyusuario + "  and fechaRegistro ge " + fechaInicio + " and fechaRegistro lt " + fechaFinal + " and status eq '" + idStatus + "'";
              
            } else {
              if (selectedDateIni && selectedDateFinal) {
                url_data1 = "./backend_mov/service/zbusiness/MovimientoDiarioCustom?$filter=fechaRegistro ge " + fechaInicio + " and fechaRegistro lt " + fechaFinal + " and status eq '" + idStatus + "'";
            
                };
            }
            this.cargaDatosaModelo(url_data1);
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
      let obj = { listaMovDiarios: listaMovDiarios };
      oJsonModelMovDiarios.setData(obj);
      //tabla.setModel(oJsonModelEstablecimiento);
      oView.setModel(oJsonModelMovDiarios, "modelMovDiario");

      },
      formatValueToIcon: function (sId,oContext) {


     if (sId === "1") {
          return "sap-icon://accept";
        } else {
          return "sap-icon://cancel";
        }

      },
      convertToNumber: function (sId,oContext) {
        // Convierte la cadena en un número
        if (sId ===  "1"){
          return (true);
        } else{
          return (false);
        };
        
      },
      onFilterChange: function (evt) {
        alert("Hola soy change");
      },
      poblarCombos: function () {
        var oView = this.getView();
        var oJsonModel = new sap.ui.model.json.JSONModel();
        var objAux = {};
        objAux.listaDistrito = [];
        objAux.listaZona = [];


        var resultAll = [];
        var url_data = './backend_mov/service/zadmin/MasterData'

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
              resultAll = result.value;
            },
            function errorCallback(xhr, readyState) {
              jQuery.sap.log.debug(xhr);
            }
          );

        resultAll.forEach((item, index) => {

          if (item.groupMaster === "MasterDistritos")
            objAux.listaDistrito.push(item);

        });
        oJsonModel.setData(objAux);
        oView.setModel(oJsonModel, "modelParam");
      },
      cargaUsuarios: function () {

        var oView = this.getView();
        var oJsonModel = new sap.ui.model.json.JSONModel();
        var objAux = {};
        objAux.listaUsuarios = [];

        var resultAll = [];
        var url_data = './backend_mov/service/zadmin/MasterUsuarios'

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
              resultAll = result.value;
            },
            function errorCallback(xhr, readyState) {
              jQuery.sap.log.debug(xhr);
            }
          );

        let obj = { listaUsuarios: resultAll };
        oJsonModel.setData(obj);
        oView.setModel(oJsonModel, "modelUsuario");
      },
      selectDistrito: function (oEvent) {

        var oView = this.getView();
        var oJsonModel = new sap.ui.model.json.JSONModel();
        var objAux = {};
        objAux.listaZona = [];

        oView.byId("cbxzona").setSelectedKey(null);

        var resultAll = [];
        var selectedItem = oEvent.getParameter("selectedItem");
        if (selectedItem) {
          var idDistrito = selectedItem.getKey();
          var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" });

          var oDatePickerIni = this.getView().byId("fechaInicio");
          var selectedDateIni = oDatePickerIni.getDateValue();
          var oDatePickerFinal = this.getView().byId("fechaFinal");
          var selectedDateFinal = oDatePickerFinal.getDateValue();
          var oComboBox = this.getView().byId("cbxDistrito");
          var idDistrito = oComboBox.getSelectedKey();
  
          var fechaInicio = dateFormat.format(selectedDateIni);
          var fechaFinal = dateFormat.format(selectedDateFinal);
          var url_data1 = "./backend_mov/service/zbusiness/MovimientoDiarioCustom?$filter=idDistrito eq " + idDistrito + " and fechaRegistro ge " + fechaInicio + " and fechaRegistro lt " + fechaFinal;
        }
        var url_data = "./backend_mov/service/zadmin/MasterZonas?$filter=masterDistrito_ID eq " + idDistrito ;
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
              resultAll = result.value;
            },
            function errorCallback(xhr, readyState) {
              jQuery.sap.log.debug(xhr);
            }
          );
        resultAll.forEach((item, index) => {
          objAux.listaZona.push(item);
        });
        oJsonModel.setData(objAux);
        oView.setModel(oJsonModel, "modelParam3");
        
        this.cargaDatosaModelo(url_data1);

      },
      selectZona:function(oEvent){
        var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyy-MM-dd" });

        var oDatePickerIni = this.getView().byId("fechaInicio");
        var selectedDateIni = oDatePickerIni.getDateValue();
        var oDatePickerFinal = this.getView().byId("fechaFinal");
        var selectedDateFinal = oDatePickerFinal.getDateValue();
        var oComboBox = this.getView().byId("cbxDistrito");
        var idDistrito = oComboBox.getSelectedKey();

        var oComboBox = this.getView().byId("cbxzona");
        var selectedKeyzona = oComboBox.getSelectedKey();       
        
        var fechaInicio = dateFormat.format(selectedDateIni);
        var fechaFinal = dateFormat.format(selectedDateFinal);
        if(idDistrito){
          var url_data1 = "./backend_mov/service/zbusiness/MovimientoDiarioCustom?$filter=idDistrito eq " + idDistrito + " and idMasterZona eq " + selectedKeyzona + " and fechaRegistro ge " + fechaInicio + " and fechaRegistro lt " + fechaFinal;
          this.cargaDatosaModelo(url_data1);
        }else{
          MessageBox.error("Debe seleccionar un distrito");
        };
        
      },

      onRowPress: function (oEvent) {
        var oView = this.getView();
        var oSelectedItem = oEvent.getParameter("listItem");
        var oBindingContext = oSelectedItem.getBindingContext("modelMovDiario");
        var coord = oBindingContext.getProperty("coordenada");
        iDMov = oBindingContext.getProperty("idMovimientoDiario");
        stadoReg = oBindingContext.getProperty("status");
        var coordenadaArray = coord.split(',');
        latitud = coordenadaArray[0];
        longitud = coordenadaArray[1];
        //Habilitar enlace ver despues
        this.onLinkPress(oEvent);
    
      },
      onLinkPress: function (oEvt) {
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo('ReferenciaMap', {
          latix: latitud,
          longx: longitud,
          idMovim: iDMov,
          stado: stadoReg
        });
      },
      onSwitchChange: function(oEvent){
        //https://b3ceeb8btrial-dev-zdatastreet-business-srv.cfapps.us10-001.hana.ondemand.com/service/zbusiness/MovimientosDiarios/{IDMOV}
        var oView = this.getView();
        var oSwitch = this.getView().byId("swValidacion");
        var valSw = oSwitch.getState();

        var objAux = {};
        var auxSw;
        if (valSw === true){
          auxSw = "1"
        }else{
          auxSw = "0"
        };

        var url_data = "./backend_mov/service/zbusiness/MovimientosDiarios/" + iDMov
        
        objAux.status = auxSw;
        var jsonObject = JSON.stringify(objAux);
        var self = this;
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
            MessageBox.success('Se ha validado correctamente');
            //location.reload(true);
            //self.mensajeCierre();
            //self.onSearch();
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo('Main');
          },
          error: function (xhr, readyState) {
            //oGlobalBusyDialog.close();
            MessageBox.error("no se pudo realizar la validacion de registro");
          },
        });
       
      }
    });
  });
