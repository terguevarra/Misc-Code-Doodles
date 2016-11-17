/*
	

	[TREE attribute]
	angular-treeview: the treeview directive
	tree-id : each tree's unique id.
	tree-model : the tree model on $scope.
	node-id : each node's id
	node-label : each node's label
	node-children: each node's children

	<div ng-if="vm.approvalItemModel.ApprovalItemList != null">
        <div data-angular-treeview="true"
            data-tree-id="tree01"
            data-tree-model="vm.approvalItemModel.ApprovalItemList"
            data-node-id="DramId"
            data-node-label="Name[vm.languageCode]"
            data-node-description="Description"
            data-node-language="vm.languageCode"
            data-node-ref="RefNo"
            data-node-children="children"
            data-node-project-specific="IsProjectSpecific"
            data-admin-mode="vm.isAdminMode"
            data-admin-filter="ForAdminMode"
            data-select-click="vm.onClick_ApprovalItem"
            data-select-click-url="'@Url.Action("Item","Approval")'"
            data-edit-click="vm.onOpen_EditApprovalItemForm"
            data-open-note-modal-call-back="vm.openNoteModal"
            data-org-id="vm.divisionmodel.selecteddivision"
            data-has-selected-project="vm.searchFilters.projectmodel.project.selected">
        </div>
    </div>

*/
(function (angular) {
	'use strict';
	
    angular.module('myApp')

        .directive('openNoteModal', function () {
            return {
                restrict: 'A',
                scope: {
                    openNoteModal: '=',
                    desc: '='
                },
                link: function (scope, ele, attr) {
                    var eventName = attr.eventName || 'click';
                    ele.on(eventName, function () {
                        scope.openNoteModal(scope.desc);
                    });
                }
            };
        })

        .directive('clickRedirect', function () {
            return {
                restrict: 'A',
                scope: {
                    clickRedirect: '=',
                    event: '=',
                    url: '='
                },
                link: function (scope, ele, attr) {
                    var eventName = attr.eventName || 'click';
                    ele.on(eventName, function () {
                        scope.clickRedirect(scope.event, scope.url);
                    });
                }
            };
        })
        .directive('openEdit', function () {
            return {
                restrict: 'A',
                scope: {
                    openEdit: '=',
                    item: '='
                },
                link: function (scope, ele, attr) {
                    var eventName = attr.eventName || 'click';
                    ele.on(eventName, function () {
                        scope.openEdit(scope.item);
                    });
                }
            };
        })
        .directive('treeModel', ['$compile', 'ApiUrl', function ($compile, ApiUrl) {
		    return {
			    restrict: 'A',
			    link: function (scope, element, attrs) {
			        //tree id
			        var treeId = attrs.treeId;

			        //tree model
			        var treeModel = attrs.treeModel;

			        //node id
			        var nodeId = attrs.nodeId || 'id';
			        //node refNo
			        var nodeRef = attrs.nodeRef || 'refNo';

			        //node label
			        var nodeLabel = attrs.nodeLabel || 'label';

			        var nodeDescription = attrs.nodeDescription || 'description';

			        var nodeLanguage = attrs.nodeLanguage || 'EN';

			        //children
			        var nodeChildren = attrs.nodeChildren || 'children';

			        var nodeProjectSpecific = attrs.nodeProjectSpecific || 'IsProjectSpecific';

			        var isAdminMode = attrs.adminMode;

			        var adminFilter = attrs.adminFilter || 'ForAdminMode';

			        var selectClick = attrs.selectClick;
                    
			        var selectClickUrl = attrs.selectClickUrl || ApiUrl.subroot + 'Approval/Item';

			        var editClick = attrs.editClick;

			        var openNoteModalCallBack = attrs.openNoteModalCallBack;

			        var orgId = attrs.orgId;

			        var hasSelectedProject = attrs.hasSelectedProject;

			        //tree template

			        var toolTip =
                        '<span class="am-note btn yellow btn-outline btn-xs" ng-if="node.' + nodeDescription + '[' + nodeLanguage + '].length > 0">' +
                            '<span class="am-note-link popovers" style="width: 400px;" ng-if="node.' + nodeDescription + '[' + nodeLanguage + '].length < 500" data-animation="am-flip-x" data-trigger="hover" data-type="success" data-title="{{node.' + nodeDescription + '[' + nodeLanguage + ']}}" bs-tooltip>Read Note</span>' +
                            '<span class="am-note-link popovers" style="width: 400px;" ng-if="node.' + nodeDescription + '[' + nodeLanguage + '].length >= 500" open-note-modal="' + openNoteModalCallBack + '" desc="node.' + nodeDescription + '[' + nodeLanguage + ']">Read Note</span>' +
                        '</span>&nbsp;&nbsp;';

			        var noChildren =
					    '<section class="list-group list-approval" style="box-shadow: none; -webkit-box-shadow: none;">' +
						    '<a class="list-group-item list-approval-item" data-toggle="collapse" data-parent="#accordion" href="#" style="border: none;">' +
							    '<span class="list-table">' +
								    '<i class="fa fa-file-text-o" aria-hidden="true" click-redirect="' + selectClick + '" event="node" url="' + selectClickUrl + '"></i>' +
								    '<span class="reference-number" click-redirect="' + selectClick + '" event="node" url="' + selectClickUrl + '">{{node.' + nodeRef + '}}</span>' +
								    '<span class="title-approval-item" click-redirect="' + selectClick + '" event="node" url="' + selectClickUrl + '">{{node.' + nodeLabel + '}}</span> &nbsp;&nbsp;' +
                                     toolTip +
                                    '<span class="badge badge-default badge-roundless" ng-if="node.' + nodeProjectSpecific + '">' +
                                        'Project Specific' + 
                                    '</span>' +
							    '</span>' +
						    '</a>' +
					    '</section>';

			        var withChildren =
					    '<div class="panel-heading" ng-disabled="true">' +
						    '<h3 class="panel-title">' +
							    '<a data-toggle="collapse" data-parent="#accordion" href="#collapse1G" >' +
								    '<span class="list-table">' +
									    '<i class="fa fa-chevron-down" aria-hidden="true" data-ng-click="' + treeId + '.selectNodeHead(node)"></i>' +
									    '<span class="reference-number" data-ng-click="' + treeId + '.selectNodeHead(node)">{{node.' + nodeRef + '}}</span>' +
									    '<span class="title-approval-item" data-ng-click="' + treeId + '.selectNodeHead(node)">{{node.' + nodeLabel + '}}</span> &nbsp;&nbsp;' +
                                        toolTip +
                                        '<span class="am-note btn blue-dark btn-outline btn-xs" ng-if="' + isAdminMode + ' == true" open-edit="' + editClick + '" item="node">' +
                                            '<i class="glyphicon glyphicon-edit"></i> Edit Approval Item' +
                                        '</span>' +
								    '</span>' +
							    '</a>' +
						    '</h3>' +
					    '</div>';

			        var repeatBody =
                        '<div class="panel-body">' +
						    '<div class="panel-group">' +
							    '<section class="list-group list-approval"  style="box-shadow: none; -webkit-box-shadow: none;">' +
								    '<div data-ng-hide="node.collapsed" data-tree-id="' + treeId +
                                    '" data-tree-model="node.' + nodeChildren +
                                    '" data-node-id=' + nodeId +
                                    ' data-node-label=' + nodeLabel +
                                    ' data-node-ref=' + nodeRef +
                                    ' data-node-children=' + nodeChildren +
                                    ' data-node-description="' + nodeDescription +
                                    '" data-select-click="' + selectClick +
                                    '" data-select-click-url="' + selectClickUrl +
                                    '" data-edit-click="' + editClick +
                                    '" data-admin-mode="' + isAdminMode +
                                    '" data-node-project-specific="' + nodeProjectSpecific +
                                    '" data-node-language="' + nodeLanguage +
                                    '" data-open-note-modal-call-back="' + openNoteModalCallBack +
			                        '" data-org-id="' + orgId +
                                    '" data-has-selected-project="' + hasSelectedProject + '"></div>' +
							    '</section>' +
						    '</div>' +
					    '</div>';

			        var lbiBody =
                            '<div class="panel panel-default" style="margin-bottom: 10px;">' +
                                //ADMIN FALSE START
                                '<div ng-if="' + isAdminMode + ' == false">' +
						            '<span data-ng-if="!node.' + nodeChildren + '.length">' +
							            noChildren +
						            '</span>' +
						            '<span data-ng-if="(node.' + nodeChildren + ' | filter: {' + adminFilter + ': 0}).length">' +
							            withChildren +
						            '</span>' +
						            '<span data-ng-if="!node.collapsed && (node.' + nodeChildren + ' | filter: {' + adminFilter + ': 0}).length">' +
							            repeatBody +
						            '</span>' +
                                '</div>' +
                                //ADMIN FALSE END

                                //ADMIN TRUE START
                                '<div ng-if="' + isAdminMode + ' == true">' +
						            '<span data-ng-if="!node.' + nodeChildren + '.length">' +
							            noChildren +
						            '</span>' +
						            '<span data-ng-if="node.' + nodeChildren + '.length">' +
							            withChildren +
						            '</span>' +
						            '<span data-ng-if="!node.collapsed && node.' + nodeChildren + '.length">' +
							            repeatBody +
						            '</span>' +
                                '</div>' +
                                //ADMIN TRUE END

                                //ADMIN NULL START
                                '<div ng-if="' + isAdminMode + ' == null">' +
						            '<span data-ng-if="!node.' + nodeChildren + '.length">' +
							            noChildren +
						            '</span>' +
						            '<span data-ng-if="node.' + nodeChildren + '.length">' +
							            withChildren +
						            '</span>' +
						            '<span data-ng-if="!node.collapsed && node.' + nodeChildren + '.length">' +
							            repeatBody +
						            '</span>' +
                                '</div>' +
                                //ADMIN NULL END
			                '</div>';

				    

			        var lbiRepeat =
                         //ADMIN FALSE START
                         '<div ng-repeat="node in ' + treeModel + ' | filter: {' + adminFilter + ': 0}" ng-if="' + isAdminMode + ' == false" style="margin-bottom: 10px;">' +
                             lbiBody +
                         '</div>' +
                         //ADMIN FALSE END

                         //ADMIN TRUE START
                         '<div ng-repeat="node in ' + treeModel + '" ng-if="' + isAdminMode + ' == true" style="margin-bottom: 10px;">' +
                             lbiBody +
                         '</div>' +
                         //ADMIN TRUE END

                         //ADMIN NULL START
                         '<div ng-repeat="node in ' + treeModel + '" ng-if="' + isAdminMode + ' == null" style="margin-bottom: 10px;">' +
                             lbiBody +
                         '</div>';
			        //ADMIN NULL END

			        var lbusBody =
                            //ADMIN FALSE EMPTY OBJECT - START
                            '<div ng-if="' + isAdminMode + ' == false && (' + hasSelectedProject + ' | typeof) == ' + "'object'" + ' && ' + hasSelectedProject + ' == null">' +
                                '<div class="panel panel-default" style="margin-bottom: 10px;" ng-if="(!node.' + nodeChildren + '.length && node.' + nodeProjectSpecific + ' == false) || ((node.' + nodeChildren + ' | filter: {' + nodeProjectSpecific + ': false, ' + adminFilter + ': 0}).length) || (!node.collapsed && (node.' + nodeChildren + ' | filter: {' + nodeProjectSpecific + ': false, ' + adminFilter + ': 0}).length)">' +
                                    '<span data-ng-if="!node.' + nodeChildren + '.length && node.' + nodeProjectSpecific + ' == false">' +
							            noChildren +
						            '</span>' +
						            '<span data-ng-if="(node.' + nodeChildren + ' | filter: {' + nodeProjectSpecific + ': false, ' + adminFilter + ': 0}).length">' +
							            withChildren +
						            '</span>' +
						            '<span data-ng-if="!node.collapsed && (node.' + nodeChildren + ' | filter: {' + nodeProjectSpecific + ': false, ' + adminFilter + ': 0}).length">' +
							            repeatBody +
						            '</span>' +
                                '</div>' +
                            '</div>' +
                            //ADMIN FALSE EMPTY OBJECT - END

                            //ADMIN FALSE STRING - START
                            '<div ng-if="' + isAdminMode + ' == false && (' + hasSelectedProject + ' | typeof) == ' + "'string'" + '">' +
                                '<div class="panel panel-default" style="margin-bottom: 10px;" ng-if="(!node.' + nodeChildren + '.length && node.' + nodeProjectSpecific + ' == false) || ((node.' + nodeChildren + ' | filter: {' + nodeProjectSpecific + ': false, ' + adminFilter + ': 0}).length) || (!node.collapsed && (node.' + nodeChildren + ' | filter: {' + nodeProjectSpecific + ': false, ' + adminFilter + ': 0}).length)">' +
						            '<span data-ng-if="!node.' + nodeChildren + '.length && node.' + nodeProjectSpecific + ' == false">' +
							            noChildren +
						            '</span>' +
						            '<span data-ng-if="(node.' + nodeChildren + ' | filter: {' + nodeProjectSpecific + ': false, ' + adminFilter + ': 0}).length">' +
							            withChildren +
						            '</span>' +
						            '<span data-ng-if="!node.collapsed && (node.' + nodeChildren + ' | filter: {' + nodeProjectSpecific + ': false, ' + adminFilter + ': 0}).length">' +
							            repeatBody +
						            '</span>' +
                                '</div>' +
                            '</div>' +
                            //ADMIN FALSE STRING - END

                            //ADMIN FALSE OBJECT - START
                            '<div ng-if="' + isAdminMode + ' == false && (' + hasSelectedProject + ' | typeof) == ' + "'object'" + ' && ' + hasSelectedProject + ' != null">' +
                                '<div class="panel panel-default" style="margin-bottom: 10px;" ng-if="(!node.' + nodeChildren + '.length && node.' + nodeProjectSpecific + ' == true) || ((node.' + nodeChildren + ' | filter: {' + nodeProjectSpecific + ': true, ' + adminFilter + ': 0}).length) || (!node.collapsed && (node.' + nodeChildren + ' | filter: {' + nodeProjectSpecific + ': true, ' + adminFilter + ': 0}).length)">' +
                                    '<span data-ng-if="!node.' + nodeChildren + '.length && node.' + nodeProjectSpecific + ' == true">' +
							            noChildren +
						            '</span>' +
						            '<span data-ng-if="(node.' + nodeChildren + ' | filter: {' + nodeProjectSpecific + ': true, ' + adminFilter + ': 0}).length">' +
							            withChildren +
						            '</span>' +
						            '<span data-ng-if="!node.collapsed && (node.' + nodeChildren + ' | filter: {' + nodeProjectSpecific + ': true, ' + adminFilter + ': 0}).length">' +
							            repeatBody +
						            '</span>' +
                                '</div>' +
                            '</div>' +
                            //ADMIN FALSE OBJECT - END

                            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                            //ADMIN TRUE EMPTY OBJECT - START
                            '<div ng-if="' + isAdminMode + ' == true && (' + hasSelectedProject + ' | typeof) == ' + "'object'" + ' && ' + hasSelectedProject + ' == null">' +
                                '<div class="panel panel-default" style="margin-bottom: 10px;" ng-if="(!node.' + nodeChildren + '.length && node.' + nodeProjectSpecific + ' == false) || ((node.' + nodeChildren + ' | filter: {' + nodeProjectSpecific + ': false}).length) || (!node.collapsed && (node.' + nodeChildren + ' | filter: {' + nodeProjectSpecific + ': false}).length)">' +
                                    '<span data-ng-if="!node.' + nodeChildren + '.length && node.' + nodeProjectSpecific + ' == false">' +
							            noChildren +
						            '</span>' +
						            '<span data-ng-if="(node.' + nodeChildren + ' | filter: {' + nodeProjectSpecific + ': false}).length">' +
							            withChildren +
						            '</span>' +
						            '<span data-ng-if="!node.collapsed && (node.' + nodeChildren + ' | filter: {' + nodeProjectSpecific + ': false}).length">' +
							            repeatBody +
						            '</span>' +
                                '</div>' + 
                            '</div>' +
                            //ADMIN TRUE EMPTY OBJECT - END

                            //ADMIN TRUE STRING - START
                            '<div ng-if="' + isAdminMode + ' == true && (' + hasSelectedProject + ' | typeof) == ' + "'string'" + '">' +
                                '<div class="panel panel-default" style="margin-bottom: 10px;" ng-if="(!node.' + nodeChildren + '.length && node.' + nodeProjectSpecific + ' == false) || ((node.' + nodeChildren + ' | filter: {' + nodeProjectSpecific + ': false}).length) || (!node.collapsed && (node.' + nodeChildren + ' | filter: {' + nodeProjectSpecific + ': false}).length)">' +
						            '<span data-ng-if="!node.' + nodeChildren + '.length && node.' + nodeProjectSpecific + ' == false">' +
							            noChildren +
						            '</span>' +
						            '<span data-ng-if="(node.' + nodeChildren + ' | filter: {' + nodeProjectSpecific + ': false}).length">' +
							            withChildren +
						            '</span>' +
						            '<span data-ng-if="!node.collapsed && (node.' + nodeChildren + ' | filter: {' + nodeProjectSpecific + ': false}).length">' +
							            repeatBody +
						            '</span>' +
                                '</div>' +
                            '</div>' +
                            //ADMIN TRUE STRING - END

                            //ADMIN TRUE OBJECT - START
                            '<div ng-if="' + isAdminMode + ' == true && (' + hasSelectedProject + ' | typeof) == ' + "'object'" + ' && ' + hasSelectedProject + ' != null">' +
                                '<div class="panel panel-default" style="margin-bottom: 10px;" ng-if="(!node.' + nodeChildren + '.length && node.' + nodeProjectSpecific + ' == true) || ((node.' + nodeChildren + ' | filter: {' + nodeProjectSpecific + ': true}).length) || (!node.collapsed && (node.' + nodeChildren + ' | filter: {' + nodeProjectSpecific + ': true}).length)">' +
						            '<span data-ng-if="!node.' + nodeChildren + '.length && node.'+nodeProjectSpecific+' == true">' +
							            noChildren +
						            '</span>' +
						            '<span data-ng-if="(node.' + nodeChildren + ' | filter: {' + nodeProjectSpecific + ': true}).length">' +
							            withChildren +
						            '</span>' +
						            '<span data-ng-if="!node.collapsed && (node.' + nodeChildren + ' | filter: {' + nodeProjectSpecific + ': true}).length">' +
							            repeatBody +
						            '</span>' +
                                '</div>' +
                            '</div>' +
                            //ADMIN TRUE OBJECT - END

                            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                            //ADMIN NULL EMPTY OBJECT - START
                            '<div ng-if="' + isAdminMode + ' == null && (' + hasSelectedProject + ' | typeof) == ' + "'object'" + ' && ' + hasSelectedProject + ' == null">' +
                                '<div class="panel panel-default" style="margin-bottom: 10px;" ng-if="(!node.' + nodeChildren + '.length && node.' + nodeProjectSpecific + ' == false) || ((node.' + nodeChildren + ' | filter: {' + nodeProjectSpecific + ': false}).length) || (!node.collapsed && (node.' + nodeChildren + ' | filter: {' + nodeProjectSpecific + ': false}).length)">' +
                                    '<span data-ng-if="!node.' + nodeChildren + '.length && node.' + nodeProjectSpecific + ' == false">' +
							            noChildren +
						            '</span>' +
						            '<span data-ng-if="(node.' + nodeChildren + ' | filter: {' + nodeProjectSpecific + ': false}).length">' +
							            withChildren +
						            '</span>' +
						            '<span data-ng-if="!node.collapsed && (node.' + nodeChildren + ' | filter: {' + nodeProjectSpecific + ': false}).length">' +
							            repeatBody +
						            '</span>' +
                                '</div>' +
                            '</div>' +
                            //ADMIN NULL EMPTY OBJECT - END

                            //ADMIN NULL STRING - START
                            '<div ng-if="' + isAdminMode + ' == null && (' + hasSelectedProject + ' | typeof) == ' + "'string'" + '">' +
                                '<div class="panel panel-default" style="margin-bottom: 10px;" ng-if="(!node.' + nodeChildren + '.length && node.' + nodeProjectSpecific + ' == false) || ((node.' + nodeChildren + ' | filter: {' + nodeProjectSpecific + ': false}).length) || (!node.collapsed && (node.' + nodeChildren + ' | filter: {' + nodeProjectSpecific + ': false}).length)">' +
                                    '<span data-ng-if="!node.' + nodeChildren + '.length && node.' + nodeProjectSpecific + ' == false">' +
							            noChildren +
						            '</span>' +
						            '<span data-ng-if="(node.' + nodeChildren + ' | filter: {' + nodeProjectSpecific + ': false}).length">' +
							            withChildren +
						            '</span>' +
						            '<span data-ng-if="!node.collapsed && (node.' + nodeChildren + ' | filter: {' + nodeProjectSpecific + ': false}).length">' +
							            repeatBody +
						            '</span>' +
                                '</div>' +
                            '</div>' +
                            //ADMIN NULL STRING - END

                            //ADMIN NULL OBJECT - START
                            '<div ng-if="' + isAdminMode + ' == null && (' + hasSelectedProject + ' | typeof) == ' + "'object'" + ' && ' + hasSelectedProject + ' != null">' +
                                '<div class="panel panel-default" style="margin-bottom: 10px;" ng-if="(!node.' + nodeChildren + '.length && node.' + nodeProjectSpecific + ' == true) || ((node.' + nodeChildren + ' | filter: {' + nodeProjectSpecific + ': true}).length) || (!node.collapsed && (node.' + nodeChildren + ' | filter: {' + nodeProjectSpecific + ': true}).length)">' +
                                    '<span data-ng-if="!node.' + nodeChildren + '.length && node.' + nodeProjectSpecific + ' == true">' +
							            noChildren +
						            '</span>' +
						            '<span data-ng-if="(node.' + nodeChildren + ' | filter: {' + nodeProjectSpecific + ': true}).length">' +
							            withChildren +
						            '</span>' +
						            '<span data-ng-if="!node.collapsed && (node.' + nodeChildren + ' | filter: {' + nodeProjectSpecific + ': true}).length">' +
							            repeatBody +
						            '</span>' +
                                '</div>' +
                            '</div>';
                            //ADMIN NULL OBJECT - END
			                
                            
			        var lbusRepeat =
                        //dont delete (for debugging)
                        //'<span>{{' + hasSelectedProject + ' | typeof}} || {{' + isAdminMode + '}}</span> <br/>' +

                        //'<span ng-if="' + isAdminMode + ' == false && (' + hasSelectedProject + ' | typeof) == ' + "'object'" + ' && ' + hasSelectedProject + ' == null">1 empty(object) admin off false</span>' +
                        //'<span ng-if="' + isAdminMode + ' == false && (' + hasSelectedProject + ' | typeof) == ' + "'string'" + '">2 string admin off false</span>' +
                        //'<span ng-if="' + isAdminMode + ' == false && (' + hasSelectedProject + ' | typeof) == ' + "'object'" + ' && ' + hasSelectedProject + ' != null">3 object admin off true</span>' +

                        //'<span ng-if="' + isAdminMode + ' == true && (' + hasSelectedProject + ' | typeof) == ' + "'object'" + ' && ' + hasSelectedProject + ' == null ">4 empty(object) admin on false</span>' +
                        //'<span ng-if="' + isAdminMode + ' == true && (' + hasSelectedProject + ' | typeof) == ' + "'string'" + '">5 string admin on false</span>' +
                        //'<span ng-if="' + isAdminMode + ' == true && (' + hasSelectedProject + ' | typeof) == ' + "'object'" + ' && ' + hasSelectedProject + ' != null">6 object admin on true</span>' +

                        //'<span ng-if="' + isAdminMode + ' == null && (' + hasSelectedProject + ' | typeof) == ' + "'object'" + ' && ' + hasSelectedProject + ' == null">7 empty(object) admin null false</span>' +
                        //'<span ng-if="' + isAdminMode + ' == null && (' + hasSelectedProject + ' | typeof) == ' + "'string'" + '">8 string admin null false</span>' +
                        //'<span ng-if="' + isAdminMode + ' == null && (' + hasSelectedProject + ' | typeof) == ' + "'object'" + ' && ' + hasSelectedProject + ' != null">9 object admin null true</span>' +
                        //'' +

                        //ADMIN FALSE EMPTY OBJECT - START
				        '<div ng-repeat="node in ' + treeModel + ' | filter: (((node.' + nodeChildren + ' | filter: {' + nodeProjectSpecific + ': false} | filter: {' + adminFilter + ': 0}).length) ? {' + nodeProjectSpecific + ' : false} : (node.' + nodeChildren + '.length) ? {' + nodeProjectSpecific + ' : false} : ' + "''" + ') |  filter: {' + adminFilter + ': 0}" ng-if="' + isAdminMode + ' == false && (' + hasSelectedProject + ' | typeof) == ' + "'object'" + ' && ' + hasSelectedProject + ' == null" style="margin-bottom: 10px;">' +
                           lbusBody +
                        '</div>' +
			            //ADMIN FALSE EMPTY OBJECT - END

			            //ADMIN FALSE STRING - START
                        '<div ng-repeat="node in ' + treeModel + ' | filter: (((node.' + nodeChildren + ' | filter: {' + nodeProjectSpecific + ': false} | filter: {' + adminFilter + ': 0}).length) ? {' + nodeProjectSpecific + ' : false} : (node.' + nodeChildren + '.length) ? {' + nodeProjectSpecific + ' : false} : ' + "''" + ' ) |  filter: {' + adminFilter + ': 0}" ng-if="' + isAdminMode + ' == false && (' + hasSelectedProject + ' | typeof) == ' + "'string'" + '" style="margin-bottom: 10px;">' +
                            lbusBody +
                        '</div>' +
			            //ADMIN FALSE STRING - END

			            //ADMIN FALSE OBJECT - START
                        '<div ng-repeat="node in ' + treeModel + ' | filter: (((node.' + nodeChildren + ' | filter: {' + nodeProjectSpecific + ': true} | filter: {' + adminFilter + ': 0}).length) ? {' + nodeProjectSpecific + ' : true} : (node.' + nodeChildren + '.length) ? {' + nodeProjectSpecific + ' : true} : ' + "''" + ') |  filter: {' + adminFilter + ': 0}" ng-if="' + isAdminMode + ' == false && (' + hasSelectedProject + ' | typeof) == ' + "'object'" + ' && ' + hasSelectedProject + ' != null" style="margin-bottom: 10px;">' +
                            lbusBody +
                        '</div>' +
			            //ADMIN FALSE OBJECT - END

                        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                        //ADMIN TRUE EMPTY OBJECT - START
				        '<div ng-repeat="node in ' + treeModel + ' | filter: (((node.' + nodeChildren + ' | filter: {' + nodeProjectSpecific + ': false}).length) ? {'+nodeProjectSpecific+' : false} : (node.'+nodeChildren+'.length) ? {'+nodeProjectSpecific+' : false} : '+"''"+')" ng-if="' + isAdminMode + ' == true && (' + hasSelectedProject + ' | typeof) == ' + "'object'" + ' && ' + hasSelectedProject + ' == null" style="margin-bottom: 10px;">' +
                            lbusBody +
                        '</div>' +
			            //ADMIN TRUE EMPTY OBJECT - END

			            //ADMIN TRUE STRING - START
                        '<div ng-repeat="node in ' + treeModel + ' | filter: (((node.' + nodeChildren + ' | filter: {' + nodeProjectSpecific + ': false}).length) ? {' + nodeProjectSpecific + ' : false} : (node.'+nodeChildren+'.length) ? {'+nodeProjectSpecific+' : false} : '+"''"+' )" ng-if="' + isAdminMode + ' == true && (' + hasSelectedProject + ' | typeof) == ' + "'string'" + '" style="margin-bottom: 10px;">' +
                            lbusBody +
                        '</div>' +
			            //ADMIN TRUE STRING - END

			            //ADMIN TRUE OBJECT - START
                        '<div ng-repeat="node in ' + treeModel + ' | filter: (((node.' + nodeChildren + ' | filter: {' + nodeProjectSpecific + ': true}).length) ? {' + nodeProjectSpecific + ' : true} : (node.'+nodeChildren+'.length) ? {'+nodeProjectSpecific+' : true} : '+"''"+')" ng-if="' + isAdminMode + ' == true && (' + hasSelectedProject + ' | typeof) == ' + "'object'" + ' && ' + hasSelectedProject + ' != null" style="margin-bottom: 10px;">' +
                           lbusBody +
                        '</div>' +
			            //ADMIN TRUE OBJECT - END

                        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

                        //ADMIN NULL EMPTY OBJECT - START
				        '<div ng-repeat="node in ' + treeModel + ' | filter: (((node.' + nodeChildren + ' | filter: {' + nodeProjectSpecific + ': false}).length) ? {' + nodeProjectSpecific + ' : false} : (node.' + nodeChildren + '.length) ? {' + nodeProjectSpecific + ' : false} : ' + "''" + ')" ng-if="' + isAdminMode + ' == null && (' + hasSelectedProject + ' | typeof) == ' + "'object'" + ' && ' + hasSelectedProject + ' == null" style="margin-bottom: 10px;">' +
                            lbusBody +
                        '</div>' +
			            //ADMIN NULL EMPTY OBJECT - END

			            //ADMIN NULL STRING - START
                        '<div ng-repeat="node in ' + treeModel + ' | filter: (((node.' + nodeChildren + ' | filter: {' + nodeProjectSpecific + ': false}).length) ? {' + nodeProjectSpecific + ' : false} : (node.' + nodeChildren + '.length) ? {' + nodeProjectSpecific + ' : false} : ' + "''" + ' )" ng-if="' + isAdminMode + ' == null && (' + hasSelectedProject + ' | typeof) == ' + "'string'" + '" style="margin-bottom: 10px;">' +
                            lbusBody +
                        '</div>' +
			            //ADMIN NULL STRING - END

			            //ADMIN NULL OBJECT - START
                        '<div ng-repeat="node in ' + treeModel + ' | filter: (((node.' + nodeChildren + ' | filter: {' + nodeProjectSpecific + ': true}).length) ? {' + nodeProjectSpecific + ' : true} : (node.' + nodeChildren + '.length) ? {' + nodeProjectSpecific + ' : true} : ' + "''" + ')" ng-if="' + isAdminMode + ' == null && (' + hasSelectedProject + ' | typeof) == ' + "'object'" + ' && ' + hasSelectedProject + ' != null" style="margin-bottom: 10px;">' +
                            lbusBody +
                        '</div>';
			            //ADMIN NULL OBJECT - END


				    var template =
					    '<div class="row">' +
						    '<div class="col-md-12 gray">' +
							    '<nav class="panel-group list-collapsible" id="accordion">' +
                                    '<div ng-if="' + orgId + ' == ' + "'LBI'" + '">' + lbiRepeat + '</div>' +
                                    '<div ng-if="' + orgId + ' == ' + "'LBUS'" + '"> ' + lbusRepeat + '</div>' +
							    '</nav>' +
						    '</div>' +
					    '</div>'

				    //check tree id, tree model
				    if (treeId && treeModel) {

					    //root node
					    if (attrs.angularTreeview) {

						    //create tree object if not exists
						    scope[treeId] = scope[treeId] || {};

						    //if node head clicks,
						    scope[treeId].selectNodeHead = scope[treeId].selectNodeHead || function (selectedNode) {
							    //Collapse or Expand
							    selectedNode.collapsed = !selectedNode.collapsed;
						    };

						    //if node label clicks,
						    scope[treeId].selectNodeLabel = scope[treeId].selectNodeLabel || function (selectedNode, selectedNodeScope) {
						    	if (selectedNodeScope) {
						    		var parentScope = selectedNodeScope.$parent,
						    			index,
						    			targetArray;
						    		if (parentScope.node) {
						    			targetArray = parentScope.node.children;
						    		} else {
						    			//root node
						    			targetArray = scope[treeModel];
						    		}
						    		// to insert after the index;
						    		if (!angular.isUndefined(targetArray)) {
						    			if (targetArray.length) {
						    				index = targetArray.indexOf(selectedNode);
						    				if (index !== -1) {
						    						//targetArray.splice(index, 0, newNodeToBeAdded)
						    						}
	
						    			}
						    		}
								


						    	}

						    	//remove highlight from previous node
						    	if (scope[treeId].currentNode && scope[treeId].currentNode.selected) {
						    		scope[treeId].currentNode.selected = undefined;
						    	}

						    	//set highlight to selected node
						    	selectedNode.selected = 'selected';

						    	//set currentNode
						    	scope[treeId].currentNode = selectedNode;
					        };
					    }

					    //Rendering template.
					    element.html('').append($compile(template)(scope));
				    }
			    }
		    };
	    }]);
})(angular);