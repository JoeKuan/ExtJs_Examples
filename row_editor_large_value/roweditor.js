Ext.Loader.setConfig({
    enabled : true,
    disableCaching : true, // For debug only
});

Ext.application({
    // In ExtJs 4.2 - must define 'name' option in Ext.application
    name: 'MyGrid',
    launch : function() {

        var rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
            listeners: {
                // Break down the long value in the store into separate fields
                beforeedit: function(editor, e) {
                    // 4.1 fix the parameter
                    var record = (parseInt(Ext.versions.extjs.shortVersion) >= 410) ? e.record : editor.record;
                    var lteValUnit = convertValue(record.data.value);
                    var gtValUnit = convertBandwidth(record.data.bandwidth);
                    Ext.getCmp('value_numberField').setValue(lteValUnit[0]);
                    Ext.getCmp('value_combo').setValue(lteValUnit[1]);
                    Ext.getCmp('bandwidth_numberField').setValue(gtValUnit[0]);
                    Ext.getCmp('bandwidth_combo').setValue(gtValUnit[1]);
                },
                validateedit: function(editor, e) {
                    //console.log(e);
                    if (!Ext.isNumeric(e.newValues.value) || !Ext.isNumeric(e.newValues.bandwidth)) {
                        return false;
                    }
                    if (e.originalValues.value !== e.newValues.value) {
                        e.record.data.value = e.newValues.value;
                        e.record.setDirty(true);
                    }
                    if (e.originalValues.bandwidth !== e.newValues.bandwidth) {
                        e.record.data.bandwidth = e.newValues.bandwidth;
                        e.record.setDirty(true);
                    }
                    return true;
                }
            }
        });

        var convertValue = function(value) {
            if (value >= 1000000000000) {
                return [ value / 1000000000000, 1000000000000 ];
            } else if (value >= 1000000000) {
                return [ value / 1000000000, 1000000000];
            } else if (value >= 1000000) {
                return [ value / 1000000, 1000000 ];
            } else if (value >= 1000) {
                return [ value / 1000, 1000 ];
            }
            return [ value, 1 ];
        };

        var convertBandwidth = function(value) {
            if (value >= 1000000000) {
                return [ value / 1000000000, 1000000000 ];
            } else if (value >= 1000000) {
                return [ value / 1000000, 1000000 ];
            } else if (value >= 1000) {
                return [ value / 1000, 1000 ];
            }
            return [ value, 1 ];
        };

        var store = Ext.create("Ext.data.Store", {
            autoDestroy: false,
            proxy: {
                type: 'memory'
            },
            fields: [ 'value', 'bandwidth' ],
            data: [ { value: 123000000000000,  bandwidth: 12300000000000 } ,
                    { value: 2240000000, bandwidth: 2240000000 },
                    { value: 11330000, bandwidth: 1130000 },
                    { value: 9800, bandwidth: 987 },
                    { value: 886, bandwidth: 0 } ]
        });

        var valueUnit = Ext.create("Ext.data.ArrayStore", {
            autoDestroy: true,
            fields: [ 'name', 'value' ],
            data: [ [ 'T', 1000000000000 ],
                    [ 'B', 1000000000 ],
                    [ 'M', 1000000 ],
                    [ 'k', 1000 ],
                    [ ' ', 1 ]
                  ]
        });

        var bandwidthUnit = Ext.create("Ext.data.ArrayStore", {
            autoDestroy: true,
            fields: [ 'name', 'value' ],
            data: [ [ 'Gbps', 1000000000 ],
                    [ 'Mbps', 1000000 ],
                    [ 'kbps', 1000 ],
                    [ 'bps', 1 ]
                  ]
        });

        var formatValue = function(value) {
            if (value >= 1000000000000) {
                return (value / 1000000000000).toFixed(2) + " T";
            } else if (value >= 1000000000) {
                return (value / 1000000000).toFixed(2) + " B";
            } else if (value >= 1000000) {
                return (value / 1000000).toFixed(2) + " M";
            } else if (value >= 1000) {
                return (value / 1000).toFixed(2) + " k";
            }

            return value;
        };

        var formatBandwidth = function(value) {
            if (value >= 1000000000) {
                return (value / 1000000000).toFixed(2) + " Gbps";
            } else if (value >= 1000000) {
                return (value / 1000000).toFixed(2) + " Mbps";
            } else if (value >= 1000) {
                return (value / 1000).toFixed(2) + " kbps";
            }

            return value + " bps";
        };

        var win = Ext.create('Ext.window.Window', {
            title: 'Large values example (ExtJs ' + Ext.versions.extjs.version + ')',
            layout: 'fit',
            items: [{
                xtype: 'grid',
                width: 400,
                plugins: [ rowEditing ],
                frame: true,
                store: store,
                columns: [{
                    text: 'Value ($)',
                    sortable: true,
                    width: 150,
                    dataIndex: 'value',
                    renderer: formatValue,
                    editor: {
                        xtype: 'container',
                        layout: 'hbox',
                        flex: 1,
                        // This getValue is called by the roweditor plugin
                        // we provide it to emulate as a field getValue
                        getValue: function() {
                            // Combine both fields to a single value
                            var val = Ext.getCmp('value_numberField').getValue();
                            var unit = Ext.getCmp('value_combo').getValue();
                            // console.log(val + ", " + unit);
                            return val * unit;
                        },
                        items: [{
                            xtype: 'numberfield',
                            width: 75,
                            id: 'value_numberField',
                            allowBlank: false,
                            allowNegative: false
                        }, {
                            xtype: 'combo',
                            width: 70,
                            id: 'value_combo',
                            valueField: 'value',
                            displayField: 'name',
                            store: valueUnit,
                            mode: 'local',
                            triggerAction: 'all',
                            editable: false
                        }]
                    }
                }, {
                    text: 'Bandwidth (bps)',
                    width: 150,
                    sortable: true,
                    dataIndex: 'bandwidth',
                    renderer: formatBandwidth,
                    editor: {
                        xtype: 'container',
                        layout: 'hbox',
                        flex: 1,
                        // This getValue is called by the roweditor plugin
                        // we provide it to emulate as a field getValue
                        getValue: function() {
                            // Combine both fields to a single value
                            var val = Ext.getCmp('bandwidth_numberField').getValue();
                            var unit = Ext.getCmp('bandwidth_combo').getValue();
                            return val * unit;
                        },
                        items: [{
                            xtype: 'numberfield',
                            width: 75,
                            id: 'bandwidth_numberField',
                            allowBlank: false,
                            allowNegative: false
                        }, {
                            xtype: 'combo',
                            width: 70,
                            id: 'bandwidth_combo',
                            valueField: 'value',
                            displayField: 'name',
                            store: bandwidthUnit,
                            mode: 'local',
                            triggerAction: 'all',
                            editable: false
                        }]
                    }
                }]
            }]
        });

        win.show();
    }

});
