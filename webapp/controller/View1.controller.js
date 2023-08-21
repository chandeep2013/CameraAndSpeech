sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/Dialog",
    "sap/m/MessageToast",
	"sap/m/Button"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Dialog, MessageToast,Button) {
        "use strict";

        return Controller.extend("com.bosch.camera.controller.View1", {
            onInit: function () {

            },
            oTakePicture: function () {
                var that = this;
                this.cameraDialog = new Dialog({
                    title: "Click on Capture to take a photo",
                    beginButton:new Button({
                        text: "Capture",
                        press: function (oEvent) {
                            that.imageValue = document.getElementById("player");
                            that.cameraDialog.close();
                            that.cameraDialog.destroy();
                        }
                    }),
                    content: [
                        new sap.ui.core.HTML({
                            content: '<video id="player" autoplay></video>'
                        })
                    ],
                    endButton:new Button({
                        text: "Cancel",
                        press: function () {
                            that.cameraDialog.close();
                            that.cameraDialog.destroy();
                        }
                    })
                });
                this.getView().addDependent(this.cameraDialog);
                this.cameraDialog.open();
                this.cameraDialog.attachBeforeClose(this.setImage, this);

                var handleSuccess = function (stream) {
                    player.srcObject = stream;
                }

                navigator.mediaDevices.getUserMedia({
                    video: true
                }).then(handleSuccess);
            },
            setImage:function(){
                var oVBox = this.getView().byId("VBox1");
                var items = oVBox.getItems();
                var snapId = "chand-"+ items.length;
                var imagVal = this.imageValue;
                if(imagVal == null){
                    MessageToast.show("Image not captured");
                }
                else{
                    var oCanvas = new sap.ui.core.HTML({
                        content:"<canvas id='"+snapId+"' width='320px' height='320px' + style= '2px solid red'></canvas>"
                    });
                    oVBox.addItem(oCanvas);
                    oCanvas.addEventDelegate({
                        onAfterRendering:function(){
                            var snapShotCanvas = document.getElementById(snapId);
                            var oContext = snapShotCanvas.getContext('2d');
                            oContext.drawImage(imagVal,0,0,snapShotCanvas.clientWidth,snapShotCanvas.height);
                            var imageData = snapShotCanvas.toDataURL('image/png');
                            var imageBase64 = imageData.substring(imageData.indexOf(",")+1);
                            //download(imageData,fileName+".png","image/png");
                            console.log("Base64",imageBase64);
                        }
                    })
                }
            }
        });
    });
