Ext.Loader.setConfig({
    enabled : true,
    disableCaching : true
});

Ext.application({
    name: 'MyGrid',
    launch : function() {
        
        // Define our data model
        Ext.define('Films', {
            extend: 'Ext.data.Model',
            fields: [ 'category', 'name' ] 
        });
        
        var actionFilms = [ { name: 'Djanjo Unchained' }, { name: 'Inception' }, 
                            { name: 'Matrix' }, { name: 'Mission Impossible' } ];
        var comedyFilms = [ { name: 'Hangover' }, { name: 'Hot Fuzz' }, 
                            { name: 'Full Monty' }, { name: 'Ace Ventura' } ];
        var dramaFilms = [ { name: 'Thank You for Smoking' }, { name: '21 grams' }, 
                           { name: 'Second Hand Lion' }, { name: '50/50' }, { name: 'Crash' } ];

        var categoryStore = Ext.create('Ext.data.ArrayStore', {
            fields: [ 'category' ],
            data: [ [ 'Action' ], ['Comedy'], ['Drama'], ['Other'] ]
        });
        
        var nameStore = Ext.create('Ext.data.ArrayStore', {
            fields: [ 'name' ]
        });
        
        // create the Data Store
        var filmStore = Ext.create('Ext.data.Store', {
            // destroy the store if the grid is destroyed
            autoDestroy: true,
            model: 'Films',
            proxy: {
                type: 'memory'
            },
            data: [ { category: 'Action', name: 'Django Unchained' }, 
                    { category: 'Comedy', name: 'Hangover' },
                    { category: 'Drama', name: '50/50' }, 
                    { category: 'Other', name: 'Old Boy' } ],
            sorters: [{
                property: 'start',
                direction: 'ASC'
            }]
        });
        
        var editor = Ext.create('Ext.grid.plugin.RowEditing', {
            saveText : 'Save'
        });

        // Initiate the nameStore values based on the category
        // combo value
        var populateNameStore = function(cat) {
            switch (cat) {
            case 'Action':
                nameStore.loadData(actionFilms);
                break;
            case 'Comedy':
                nameStore.loadData(comedyFilms);
                break;
            case 'Drama':
                nameStore.loadData(dramaFilms);
                break;
            }
        };

        // Based on category store value, setup the editor of the name column
        var setupNameEditor = function(cat, nameCell) {
            var e = nameCell.getEditor();
            if (cat == 'Other') {
                if (e.xtype !== 'textfield') {
                    nameCell.setEditor({
                        xtype: 'textfield',
                        allowBlank: false
                    });
                }
            } else {
                populateNameStore(cat);
                if (e.xtype !== 'combo') {
                    nameCell.setEditor({
                        xtype: 'combo',
                        queryMode: 'local',
                        store: nameStore,
                        triggerAction: 'all',
                        editable: false,
                        displayField: 'name',
                        valueField: 'name'
                    });
                }
            }
        };

        // Cancel edit: anything not saved are removed
        editor.on('canceledit', function(roweditor, forced) {
            editor.cancelEdit();
        });

        // Save - Update is clicked
        editor.on('afteredit', function(roweditor, obj, record, rowIdx) {

        });

        var grid = Ext.create('Ext.grid.Panel', {
            store : filmStore,
            id: 'films',
            plugins : [editor],
            clicksToEdit : 2,
            width : 500,
            height : 300,
            listeners: {
                itemdblclick: function(gridview, record, item, index) {
                    // Check out the value of category column
                    var cat = gridview.getHeaderCt().gridDataColumns[0].getEditor().getValue();
                    var nameCell = gridview.getHeaderCt().gridDataColumns[1];
                    setupNameEditor(cat, nameCell);
                }
            },
            columns : [{
                header : 'Film Category',
                dataIndex : 'category',
                width : 150,
                editor : {
                    xtype: 'combo',
                    store: categoryStore,
                    id: 'catCombo',
                    displayField: 'category',
                    valueField: 'category',
                    triggerAction: 'all',
                    editable: false,
                    forceSelection: true,
                    queryMode: 'local',
                    listeners: {
                        change: function(combo, newCat, oldCat) {
                            var store = combo.getStore();
                            var gridview = Ext.getCmp('films').getView();
                            var nameCell = gridview.getHeaderCt().gridDataColumns[1];
                            setupNameEditor(newCat, nameCell);
                            if (newCat !== 'Other') {
                                // Select the first from different category
                                nameCell.getEditor().setValue(nameStore.getAt(0).data.name);
                            }
                        }
                    }
                } // editor
            }, {
                header : 'Name',
                dataIndex : 'name',
                width : 150
            }]
        });
        
        var version = Ext.getVersion('extjs');
        
        // The Add Bookmark windows
        var win = new Ext.Window({
            title : "Double click to edit an entry<BR>Select 'Other' in 'Film Category' to change editor ( ExtJs " + version + ' )',
            closable: false,
            layout : 'fit',
            items : [grid]
        });
        
        win.show();
    }
});
