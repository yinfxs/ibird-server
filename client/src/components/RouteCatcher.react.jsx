/**
 * 路由捕手组件
 * 捕获所有界面上的路由响应
 * Created by yinfxs on 16-6-21.
 */

'use strict';

const React = require('react');
const AdminIndex = require('./AdminIndex.react');
const AdminTable = require('./AdminTable.react');
const AdminForm = require('./AdminForm.react');
const CodeUtils = require('../utils/CodeUtils');
const cv = JSON.parse(CodeUtils.decodeBase64(localStorage.getItem('C_V'), 5)) || [];

const RouteCatcher = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },
    getInitialState(){
        return {}
    },
    componentDidMount(){
        console.log('RouteCatcher...');
    },
    getSchemaByCode(moduleCode, modelCode){
        let schema = {};
        cv.map(function (module) {
            if (!module || module.code != moduleCode) return;
            const schemas = module.schemas;
            Object.keys(schemas).map(function (key) {
                if (!key || key != modelCode) return;
                schema = schemas[key];
            });
        });
        return schema;
    },
    render(){
        console.log('RouteCatcher.render...');
        const module = this.props.params.module;
        const path = this.props.params.path, query = this.props.location.query;
        const schema = this.getSchemaByCode(module, query.m);
        const f = query.f, i = query.i, com = query.com;
        const content = !f ? <AdminTable module={module} path={path} model={query.m} schema={schema}/> :
            <AdminForm module={module} path={path} model={query.m} schema={schema} i={i}/>;
        console.log(query.com);
        if (com) {
            const Component = require(com);
            console.log('com=' + com, 'Component=' + Component);
            return <Component module={module} path={path} model={query.m} schema={schema} i={i}/>
        }
        return content;
    }
});

module.exports = RouteCatcher;