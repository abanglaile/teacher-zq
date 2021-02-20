import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Icon,Spin,Table,Input,Select,message,Button,TreeSelect,Modal} from 'antd';
import *as action from '../Action';
import {connect} from 'react-redux';
import config from '../utils/Config';
import moment from 'moment';
import Highlighter from 'react-highlight-words';

class PathManager extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            visible:false,tree_value:[],
            filterDropdownVisible: false, searchText: '', 
            filtered: false, 
        };
    }
    
    componentDidMount(){
      const {teacher_id} = this.props;
      this.props.getPathTable(teacher_id);
    }

    handleSearch(selectedKeys, confirm){
        confirm();
        this.setState({ searchText: selectedKeys[0] });
        }
        
    handleReset(clearFilters){
        clearFilters();
        this.setState({ searchText: '' });
    }

    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
            <Input
            ref={ele => this.searchInput = ele}
            placeholder="输入关键字"
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
            <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm)}
            icon="search"
            size="small"
            style={{ width: 90, marginRight: 8 }}
            >
            Search
            </Button>
            <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
            </Button>
        </div>
        ),
        filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#108ee9' : '#aaa' }} />,
        onFilter: (value, record) => {
            // console.log('record:',record);
            if(record[dataIndex]){
                var indexs = record[dataIndex].indexOf(value);
                return (indexs >= 0 ? true : false);
            }else{
                return false;
            }
        },
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => {this.searchInput.focus();});
            }
        },
        render: text => (
        <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[this.state.searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ''}
        />
        ),
    });

    render(){
        this.columns = [
            {
                title: '班级分组',
                dataIndex: 'group_name',
                key:'stu_group_id',
                width: '20%',
                ...this.getColumnSearchProps('group_name'),
                render: (text,record,index) => {
                    return(
                        <div>
                            <a href={"/teacher-zq/group_path?group_id=" + record.stu_group_id + "&" + "path_id=" + record.path_id}>{text}</a>
                        </div>
                    );
                },
            }, {
                title: '路径名称',
                dataIndex: 'path_name',
                width: '15%',
                key:'path_id',
            },{
                title: '开始时间',
                dataIndex: 'bond_time',
                width: '16%',
                sorter: (a, b) => (moment(a.create_time)-moment(b.create_time)),
                render: (text, record) => {
                    if(text) return moment(text).format('YYYY-MM-DD HH:mm:ss'); //2014-09-24 23:36:09 
                    else return '';
                    return (text);
                },
            }
        ];
        const {isFetching,path_table} = this.props;
        return(
            !isFetching ?
            <div>
                < Table 
                    columns = { this.columns } 
                    dataSource = { path_table }
                /> 
            </div> 
            :<Spin spinning={isFetching} />  
        );
    }
}

export default connect(state => {
  const {path_table,isFetching} = state.pathData.toJS();
  return {
    path_table : path_table,
    isFetching : isFetching,
    teacher_id : state.AuthData.get('userid'),
  }
}, action)(PathManager);