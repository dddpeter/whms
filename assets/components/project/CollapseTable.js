import {Table,} from 'antd';
import React, {Component} from 'react';
const data = [{
    key: '1',
    name: 'John Brown',
    date: '2016.1.1',
    description: 'New York No. 1 Lake Park',
    duration: 'null',
    type: 'null'
}, {
    key: '2',
    name: 'Jim Green',
    date: '2016.1.2',
    description: 'London No. 1 Lake Park',
    duration: 'null',
    type: 'null'
}, {
    key: '3',
    name: 'Joe Black',
    date: '2017.4.21',
    description: 'Sidney No. 1 Lake Park',
    duration: 'null',
    type: 'null'
}, {
    key: '4',
    name: 'Jim Red',
    date: '2000.10.1',
    description: 'London No. 2 Lake Park',
    duration: 'null',
    type: 'null'
}, {
    key: '5',
    name: 'Jim Red',
    date: '2000.10.1',
    description: 'London No. 2 Lake Park',
    duration: 'null',
    type: 'null'
}, {
    key: '6',
    name: 'Jim Red',
    date: '2000.10.1',
    description: 'London No. 2 Lake Park',
    duration: 'null',
    type: 'null'
}, {
    key: '7',
    name: 'Jim Red',
    date: '2000.10.1',
    description: 'London No. 2 Lake Park',
    duration: 'null',
    type: 'null'
}];
const columns = [{
    title: 'Name',
    dataIndex: 'name',


}, {
    title: 'Date',
    dataIndex: 'date',

    sorter: (a, b) => parseFloat(a.date) - parseFloat(b.date),

}, {
    title: 'Description',
    dataIndex: 'description',


}, {
    title: 'Duration(hrs)',
    dataIndex: 'duration',


}, {
    title: 'Type',
    dataIndex: 'type',

}];


class CollapseTable extends Component{
    render(){
        return(
            <Table columns={columns} dataSource={data} />
        )
    }
}
export default CollapseTable;