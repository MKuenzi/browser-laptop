var EmergencyAccessUserContainer=function(a,b){this.pendingGroup=new SharedSiteGroup(Strings.translateString("Pending"),"pendingFolder");this.acceptedGroup=new SharedSiteGroup(Strings.translateString("People I Trust"),"acceptedFolder");this.declinedGroup=new SharedSiteGroup(Strings.translateString("Declined Offers"),"declinedFolder");Container.call(this,[this.declinedGroup,this.pendingGroup,this.acceptedGroup],b);for(var c=0,d=a.length;c<d;++c)this.addChild(a[c])};
EmergencyAccessUserContainer.prototype=Object.create(SharingContainer.prototype);EmergencyAccessUserContainer.prototype.constructor=EmergencyAccessUserContainer;EmergencyAccessUserContainer.prototype.addChild=function(){var a=function(a){a._model.hasAccepted()?this.acceptedGroup.addChild(a):a._model.hasDeclined()?this.addDeclined(a):this.pendingGroup.addChild(a)};return function(){this.checkForStateChange(a,arguments)}}();EmergencyAccessUserContainer.prototype.addDeclined=function(){};
var EmergencyAccessRecipientContainer=function(a,b){EmergencyAccessUserContainer.call(this,a,b)};EmergencyAccessRecipientContainer.prototype=Object.create(EmergencyAccessUserContainer.prototype);EmergencyAccessRecipientContainer.prototype.constructor=EmergencyAccessRecipientContainer;EmergencyAccessRecipientContainer.prototype.addDeclined=function(a){this.declinedGroup.addChild(a)};
var EmergencyAccessSharerContainer=function(a,b){EmergencyAccessUserContainer.call(this,a,b);this.acceptedGroup._model._data.group=Strings.translateString("People Who Trust Me")};EmergencyAccessSharerContainer.prototype=Object.create(EmergencyAccessUserContainer.prototype);EmergencyAccessSharerContainer.prototype.constructor=EmergencyAccessSharerContainer;var EmergencyAccessUser=function(a){VaultItemBase.call(this,a)};EmergencyAccessUser.prototype=Object.create(VaultItemBase.prototype);
EmergencyAccessUser.prototype.constructor=EmergencyAccessUser;EmergencyAccessUser.prototype.getName=function(){return this._data.username};EmergencyAccessUser.prototype.getID=EmergencyAccessUser.prototype.getName;EmergencyAccessUser.prototype.getFormData=function(a){var b=VaultItemBase.prototype.getFormData.apply(this,arguments);b.hours_to_override=this.getHours();return b};EmergencyAccessUser.prototype.getHours=function(){return this._data.hours_to_override};
EmergencyAccessUser.prototype.isLinked=function(){return"1"===this._data.linked};EmergencyAccessUser.prototype.hasAccepted=function(){return"1"===this._data.accepted};EmergencyAccessUser.prototype.hasDeclined=function(){return"-1"===this._data.accepted};EmergencyAccessUser.prototype.hasRequestedAccess=function(){return"1"===this._data.confirmed};EmergencyAccessUser.prototype.allowedAccess=function(){return"1"===this._data.allowed_access};EmergencyAccessUser.prototype.getAccessDateAsString=function(){return this._data.override_date.toLocaleString()};
var EmergencyAccessUserDisplay=function(a){VaultItemBaseDisplay.call(this,a)};EmergencyAccessUserDisplay.prototype=Object.create(VaultItemBaseDisplay.prototype);EmergencyAccessUserDisplay.prototype.constructor=EmergencyAccessUserDisplay;
EmergencyAccessUserDisplay.prototype.buildItemInfoTextElements=function(){var a=VaultItemBaseDisplay.prototype.buildItemInfoTextElements.apply(this,arguments),b=[];this._model.hasRequestedAccess()?(Date.now()<this._model._data.override_date?b.push(LPTools.createElement("p","small infoLabel",Strings.Vault.ACCESS_PENDING)):b.push(LPTools.createElement("p","small infoLabel",Strings.Vault.ACCESS_GRANTED)),b.push(this.createTextElement("p",this.getAccessDate,"small"))):(b.push(LPTools.createElement("p",
"small infoLabel",Strings.Vault.WAITING_PERIOD)),b.push(this.createTextElement("p",this.getHoursAsString,"small")));a.push(this.buildItemInfoTextElement(b));return a};EmergencyAccessUserDisplay.prototype.getIconElement=function(){return LPTools.createElement("img",{src:"images/vault_4.0/Identity_Avatar.png","class":"bigIcon"})};
EmergencyAccessUserDisplay.prototype.getHoursAsString=function(){var a=parseInt(this._model.getHours());return a=0===a?Strings.translateString("Immediately"):72>a?a+(" "+Strings.translateString("hours")):parseInt(a/24)+" "+Strings.translateString("days")};EmergencyAccessUserDisplay.prototype.getAccessDate=function(){return this._model.getAccessDateAsString()};EmergencyAccessRecipient=function(a){EmergencyAccessUser.call(this,a)};EmergencyAccessRecipient.prototype=Object.create(EmergencyAccessUser.prototype);
EmergencyAccessRecipient.prototype.constructor=EmergencyAccessRecipient;EmergencyAccessRecipient.prototype.getDisplayClass=function(){return EmergencyAccessRecipientDisplay};EmergencyAccessRecipient.prototype.handleClickEvent=function(a,b){switch(a){case Constants.ACTION_EMAIL:this.resendOffer();break;case Constants.ACTION_REVOKE:case Constants.ACTION_CANCEL:this.revokeOffer();break;default:VaultItemBase.prototype.handleClickEvent.apply(this,arguments)}};EmergencyAccessRecipient.prototype.edit=function(){Topics.get(Topics.EDIT_EMERGENCY_RECIPIENT).publish(this)};
EmergencyAccessRecipient.prototype.revokeOffer=function(){var a=this;LPRequest.makeRequest(LPProxy.revokeEmergencyAccessOffer,{parameters:a,success:function(){Topics.get(Topics.SUCCESS).publish(Strings.translateString("Revoked"));a.deleteUpdates()},lockItems:!0,confirm:{title:Strings.Vault.REVOKE,text:Strings.translateString("Are you sure you want to revoke emergency access for %1?",a.getName())}})};
EmergencyAccessRecipient.prototype.add=function(){var a=this;LPRequest.makeRequest(LPProxy.addEmergencyAccessRecipient,{parameters:a,success:function(){Topics.get(Topics.EMERGENCY_RECIPIENT_ADDED).publish(a);Topics.get(Topics.SUCCESS).publish(Strings.translateString("Invitation sent."))}})};EmergencyAccessRecipient.prototype.save=function(a){var b=this;LPRequest.makeRequest(LPProxy.updateEmergencyAccessRecipient,{parameters:[b,a],success:function(){b.update(a);b.publishSuccess(Strings.Vault.SAVED)}})};
EmergencyAccessRecipient.prototype.resendOffer=function(){LPRequest.makeRequest(LPProxy.updateEmergencyAccessRecipient,{parameters:[this,this._data],lockItems:!0,success:function(){Topics.get(Topics.SUCCESS).publish(Strings.translateString("Invitation sent."))}})};EmergencyAccessRecipient.prototype.toString=function(){return Strings.Vault.EMERGENCY_ACCESS_RECIPIENT+": "+this.getName()};var EmergencyAccessRecipientDisplay=function(a){EmergencyAccessUserDisplay.call(this,a)};
EmergencyAccessRecipientDisplay.prototype=Object.create(EmergencyAccessUserDisplay.prototype);EmergencyAccessRecipientDisplay.prototype.constructor=EmergencyAccessRecipientDisplay;EmergencyAccessRecipientDisplay.prototype.getItemButtonActions=function(){return this._model.hasAccepted()?[Constants.ACTION_EDIT,Constants.ACTION_REVOKE]:[Constants.ACTION_EDIT,Constants.ACTION_EMAIL,Constants.ACTION_CANCEL]};
EmergencyAccessRecipientDisplay.prototype.getContextMenuItems=function(){var a=[new LPTools.ContextMenuItem(Constants.ACTION_EDIT)];this._model.hasAccepted()?a.push(new LPTools.ContextMenuItem(Constants.ACTION_REVOKE)):(a.push(new LPTools.ContextMenuItem(Constants.ACTION_EMAIL)),a.push(new LPTools.ContextMenuItem(Constants.ACTION_CANCEL)));return a};
EmergencyAccessRecipientDisplay.prototype.createSecondaryNameTextElement=function(){if(this._model.isLinked()){var a=LPTools.createElement("p","small infoLabel",Strings.Vault.LINKED);a.insertBefore(LPTools.createElement("i","badge danger small"),a.firstChild);return a}return null};EmergencyAccessSharer=function(a){EmergencyAccessUser.call(this,a)};EmergencyAccessSharer.prototype=Object.create(EmergencyAccessUser.prototype);EmergencyAccessSharer.prototype.constructor=EmergencyAccessSharer;
EmergencyAccessSharer.prototype.getDisplayClass=function(){return EmergencyAccessSharerDisplay};EmergencyAccessSharer.prototype.handleClickEvent=function(a,b){switch(a){case Constants.ACTION_ACCESS:this.requestAccess();break;case Constants.ACTION_ACCEPT:this.acceptOffer();break;case Constants.ACTION_REJECT:this.declineOffer();break;case Constants.ACTION_UNLINK:this.unlinkAccount();break;default:VaultItemBase.prototype.handleClickEvent.apply(this,arguments)}};
EmergencyAccessSharer.prototype.requestAccess=function(){LPRequest.makeRequest(LPProxy.requestEmergencyAccess,{parameters:this,confirm:{title:Strings.Vault.CONFIRM_REQUEST_ACCESS,text:[Strings.translateString("Emergency Access should only be requested if there is a valid emergency situation and you need to manage another user's vault."),Strings.translateString("Are you sure you want to continue?")]}})};
EmergencyAccessSharer.prototype.unlinkAccount=function(){var a=this;LPRequest.makeRequest(LPProxy.unlinkEmergencyAccessAccount,{parameters:a.getName(),success:function(){Topics.get(Topics.SUCCESS).publish(Strings.translateString("Account (%1) unlinked.",a.getName()))}})};EmergencyAccessSharer.prototype.acceptOffer=function(){var a=this;LPRequest.makeUpdateRequest(LPProxy.acceptEmergencyAccessOffer,{parameters:a,lockItems:!0,success:function(){a._data.accepted="1";a.update(a._data);Topics.get(Topics.SUCCESS).publish(Strings.translateString("Accepted"))}})};
EmergencyAccessSharer.prototype.declineOffer=function(){var a=this;LPRequest.makeUpdateRequest(LPProxy.declineEmergencyAccessOffer,{parameters:a,success:function(){for(var b=a.getName(),c=0,d=bg.g_emer_sharers.length;c<d;++c)if(bg.g_emer_sharers[c].username===b){bg.g_emer_sharers.splice(c,1);break}Topics.get(Topics.REFRESH_NOTIFICATIONS).publish();Topics.get(Topics.SUCCESS).publish(Strings.translateString("Declined"));a.deleteUpdates(!1)},lockItems:!0,confirm:{title:Strings.translateString("Decline"),
text:Strings.translateString("Are you sure you want to decline to be the emergency access contact for %1?",a.getName())}})};var EmergencyAccessSharerDisplay=function(a){EmergencyAccessUserDisplay.call(this,a)};EmergencyAccessSharerDisplay.prototype=Object.create(EmergencyAccessUserDisplay.prototype);EmergencyAccessSharerDisplay.prototype.constructor=EmergencyAccessSharerDisplay;
EmergencyAccessSharerDisplay.prototype.getLaunchElementAction=function(){var a=null;this._model.hasAccepted()?this._model.isLinked()?a=Constants.ACTION_UNLINK:this._model.hasRequestedAccess()||(a=Constants.ACTION_ACCESS):a=Constants.ACTION_ACCEPT;return a};EmergencyAccessSharerDisplay.prototype.getItemButtonActions=function(){var a=[Constants.ACTION_REJECT];this._model.hasAccepted()||a.unshift(Constants.ACTION_ACCEPT);return a};
EmergencyAccessSharerDisplay.prototype.getContextMenuItems=function(){var a=[new LPTools.ContextMenuItem(Constants.ACTION_REJECT)];this._model.hasAccepted()?this._model.isLinked()?a.unshift(new LPTools.ContextMenuItem(Constants.ACTION_UNLINK,{text:Strings.Vault.UNLINK})):a.unshift(new LPTools.ContextMenuItem(Constants.ACTION_ACCESS)):a.unshift(new LPTools.ContextMenuItem(Constants.ACTION_ACCEPT));return a};
EmergencyAccessSharerDisplay.prototype.createSecondaryNameTextElement=function(){if(this._model.isLinked()){var a=LPTools.createElement("p","small infoLabel",Strings.Vault.LINKED);a.insertBefore(LPTools.createElement("i","badge success small"),a.firstChild);return a}return null};EmergencyAccessSharerDisplay.prototype.updateView=function(){this.rebuild();var a=this.getContainer();a&&(this._parent.removeChild(this),a.addChild(this))};