import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import *as action from '../Action/';
import { Icon, Button, Table, Input, Modal, List, Select, Row, Col } from 'antd'
import Highlighter from 'react-highlight-words';
import moment from 'moment';

class ClasshourManager extends React.Component{
    constructor(props){
        super();
        this.state = { 
            searchText: '', filtered: false, visible: false,
        };
    }

    componentDidMount(){
        const { teacher_id } = this.props;
        this.props.getClassHourTable(teacher_id);
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
        const { class_hour } = this.props;

        this.columns = [{
            title: '学生姓名',
            dataIndex: 'realname',
            width: '5%',
            ...this.getColumnSearchProps('realname'),
            // render: (text, record, index) => {
            //     // console.log("realname record:",record);
            //     return(
            //         <div>
            //             <span>{text}</span>
            //         </div>
            //     );
            // },
        }, {
            title: '参与课程',
            dataIndex: 'group_name',
            width: '12%',
            ...this.getColumnSearchProps('group_name'),
        }, {
            title: '导学(合同)',
            dataIndex: 'guide_min',
            width: '5%',
            render: (text, record, index) => {
                return(
                    <div>
                        <span>{(text/60).toFixed(1)}h</span>
                    </div>
                );
            },
        }, {
            title: '函授(合同)',
            dataIndex: 'class_min',
            width: '5%',
            render: (text, record, index) => {
                return(
                    <div>
                        <span>{(text/60).toFixed(1)}h</span>
                    </div>
                );
            },
        }, {
            title: '导学(消费)',
            dataIndex: 'consume_guide_min',
            width: '5%',
            render: (text, record, index) => {
                return(
                    <div>
                        <span>{(text/60).toFixed(1)}h</span>
                    </div>
                );
            },
        }, {
            title: '函授(消费)',
            dataIndex: 'consume_class_min',
            width: '5%',
            render: (text, record, index) => {
                return(
                    <div>
                        <span>{(text/60).toFixed(1)}h</span>
                    </div>
                );
            },
        },{
            title: '导学(剩余)',
            dataIndex: 'remain_guide_min',
            width: '5%',
            sorter: (a, b) => a.remain_guide_min - b.remain_guide_min,
            render: (text, record, index) => {
                return(
                    <div style={{color:text >= 0? 'green' : 'red'}}>
                        <span>{(text/60).toFixed(1)}</span>
                    </div>
                );
            },
        }, {
            title: '函授(剩余)',
            dataIndex: 'remain_class_min',
            width: '5%',
            sorter: (a, b) => a.remain_class_min - b.remain_class_min,
            render: (text, record, index) => {
                return(
                    <div style={{color:text >= 0? 'green' : 'red'}}>
                        <span>{(text/60).toFixed(1)}</span>
                    </div>
                );
            },
        }];

    
      return(
        <div>
            < Table 
                columns = { this.columns } 
                dataSource = { class_hour }
            /> 
        </div>   
      );
    }
}

export default connect(state => {
    const class_data = state.classGroupData.toJS();
    return {
        class_hour : class_data.class_hour,
        teacher_id: state.AuthData.get('userid'),
    }
}, action)(ClasshourManager);